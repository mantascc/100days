// Configuration
const CONFIG = {
    // Flight route: Copenhagen to Barcelona
    origin: [12.5683, 55.6761],        // Copenhagen [lng, lat]
    destination: [2.1734, 41.3851],    // Barcelona [lng, lat]

    // Animation settings
    animationDuration: 45000,  // 45 seconds
    pathColor: '#ffffff',
    pathWidth: 2,
    markerRadius: 8
};

// Initialize map with CARTO Dark Matter tiles
const map = L.map('map', {
    center: [48.5, 7.5],  // Central Europe view
    zoom: 5,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    touchZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false,
    tap: false
});

// Add CARTO Dark Matter tiles (free, no API key needed)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Great circle path calculation
function createGreatCirclePath(start, end, numPoints = 100) {
    const from = turf.point(start);
    const to = turf.point(end);
    const distance = turf.distance(from, to);

    const path = [];
    for (let i = 0; i <= numPoints; i++) {
        const segment = distance * (i / numPoints);
        const point = turf.along(turf.greatCircle(from, to), segment);
        path.push(point.geometry.coordinates);
    }

    return path;
}

// Initialize visualization
let fullPath;
let animationStartTime = null;
let animationFrameId = null;
let isPaused = true;  // Start paused - user must click play
let pausedElapsed = 0;
let airplaneMarker = null;

// Wait for map to be ready
map.whenReady(function() {
    // Calculate the great circle path
    fullPath = createGreatCirclePath(CONFIG.origin, CONFIG.destination);

    // Create dashed grey line showing the full flight path
    const fullPathCoords = fullPath.map(coord => [coord[1], coord[0]]);
    L.polyline(fullPathCoords, {
        color: '#666666',
        weight: 1,
        opacity: 0.5,
        dashArray: '5, 10',
        smoothFactor: 1
    }).addTo(map);

    // Create polyline for the animated path (white)
    const pathLine = L.polyline([], {
        color: CONFIG.pathColor,
        weight: CONFIG.pathWidth,
        opacity: 1,
        smoothFactor: 1
    }).addTo(map);

    // Add origin marker
    L.circleMarker([CONFIG.origin[1], CONFIG.origin[0]], {
        radius: CONFIG.markerRadius,
        fillColor: CONFIG.pathColor,
        fillOpacity: 1,
        stroke: false,
        interactive: false
    }).addTo(map);

    // Add destination marker
    L.circleMarker([CONFIG.destination[1], CONFIG.destination[0]], {
        radius: CONFIG.markerRadius,
        fillColor: CONFIG.pathColor,
        fillOpacity: 1,
        stroke: false,
        interactive: false
    }).addTo(map);

    // Add optimization waypoints (green dots along the path)
    // First waypoint at 33% of the journey
    const waypoint1Index = Math.floor(fullPath.length * 0.33);
    const waypoint1Coords = fullPath[waypoint1Index];
    const waypoint1 = L.circleMarker([waypoint1Coords[1], waypoint1Coords[0]], {
        radius: 4,  // 8px diameter = 4px radius
        fillColor: '#B4E03C',
        fillOpacity: 1,
        stroke: false,
        interactive: true,  // Enable interaction
        className: 'waypoint-marker'
    }).addTo(map);

    // Second waypoint at 66% of the journey
    const waypoint2Index = Math.floor(fullPath.length * 0.66);
    const waypoint2Coords = fullPath[waypoint2Index];
    const waypoint2 = L.circleMarker([waypoint2Coords[1], waypoint2Coords[0]], {
        radius: 4,  // 8px diameter = 4px radius
        fillColor: '#B4E03C',
        fillOpacity: 1,
        stroke: false,
        interactive: true,  // Enable interaction
        className: 'waypoint-marker'
    }).addTo(map);

    // Waypoint popover functionality
    const popover = document.getElementById('waypointPopover');
    const closePopoverBtn = document.getElementById('closePopover');
    const rejectBtn = document.getElementById('rejectBtn');
    const acceptBtn = document.getElementById('acceptBtn');
    let currentWaypointNum = null;

    function showPopover(latlng, waypointNum) {
        currentWaypointNum = waypointNum;
        // Get pixel position of the waypoint on the map
        const point = map.latLngToContainerPoint(latlng);

        // Position popover below the waypoint with offset
        const offsetY = 20; // Distance below the waypoint
        const popoverWidth = 320;
        const popoverHeight = 280; // Approximate height

        // Calculate position
        let left = point.x - (popoverWidth / 2);
        let top = point.y + offsetY;

        // Get map container bounds to prevent popover from going off-screen
        const mapRect = map.getContainer().getBoundingClientRect();

        // Keep popover within horizontal bounds
        if (left < 10) {
            left = 10;
        } else if (left + popoverWidth > mapRect.width - 10) {
            left = mapRect.width - popoverWidth - 10;
        }

        // Keep popover within vertical bounds
        if (top + popoverHeight > mapRect.height - 10) {
            // If it goes off bottom, position it above the waypoint instead
            top = point.y - popoverHeight - offsetY;
        }
        if (top < 10) {
            top = 10;
        }

        // Apply position and show
        popover.style.left = left + 'px';
        popover.style.top = top + 'px';
        popover.style.display = 'block';
    }

    function hidePopover() {
        popover.style.display = 'none';
    }

    // Add click/tap handlers to waypoints
    waypoint1.on('click', function() {
        showPopover(waypoint1.getLatLng(), 1);
    });
    waypoint2.on('click', function() {
        showPopover(waypoint2.getLatLng(), 2);
    });

    // Close button handler
    closePopoverBtn.addEventListener('click', hidePopover);

    // Close on outside click
    popover.addEventListener('click', function(e) {
        if (e.target === popover) {
            hidePopover();
        }
    });

    // Reject button handler
    rejectBtn.addEventListener('click', function() {
        if (currentWaypointNum === 1) {
            // Disable waypoint 1
            const waypointElement = waypoint1.getElement();
            if (waypointElement) {
                waypointElement.classList.add('disabled');
            }
            // Change color to grey
            waypoint1.setStyle({ fillColor: '#666666' });
            // Hide notification card
            const notificationCard = document.querySelector('.notification-card[data-waypoint="1"]');
            if (notificationCard) {
                notificationCard.classList.add('hidden');
            }
        } else if (currentWaypointNum === 2) {
            // Disable waypoint 2
            const waypointElement = waypoint2.getElement();
            if (waypointElement) {
                waypointElement.classList.add('disabled');
            }
            // Change color to grey
            waypoint2.setStyle({ fillColor: '#666666' });
            // Hide notification card
            const notificationCard = document.querySelector('.notification-card[data-waypoint="2"]');
            if (notificationCard) {
                notificationCard.classList.add('hidden');
            }
        }
        // Close the popover
        hidePopover();
    });

    // Accept button handler (inactive for now)
    acceptBtn.addEventListener('click', function() {
        // Placeholder for future functionality
        hidePopover();
    });

    // Notification card handlers
    const notificationCards = document.querySelectorAll('.notification-card');

    notificationCards.forEach(card => {
        card.addEventListener('click', function() {
            const waypointNum = parseInt(this.getAttribute('data-waypoint'));

            // Pan map to the corresponding waypoint
            if (waypointNum === 1) {
                map.panTo([waypoint1Coords[1], waypoint1Coords[0]], {
                    animate: true,
                    duration: 0.5
                });
                // Show popover after a short delay to let the pan complete
                setTimeout(() => {
                    showPopover(waypoint1.getLatLng(), 1);
                }, 500);
            } else if (waypointNum === 2) {
                map.panTo([waypoint2Coords[1], waypoint2Coords[0]], {
                    animate: true,
                    duration: 0.5
                });
                // Show popover after a short delay to let the pan complete
                setTimeout(() => {
                    showPopover(waypoint2.getLatLng(), 2);
                }, 500);
            }
        });
    });

    // Create airplane marker as a white triangle pointing upward initially
    const airplaneIcon = L.divIcon({
        html: `<svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2 L22 22 L12 18 L2 22 Z" fill="white" stroke="none" style="filter: drop-shadow(0 0 2px rgba(0,0,0,0.8));"/>
        </svg>`,
        className: 'airplane-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    airplaneMarker = L.marker([CONFIG.origin[1], CONFIG.origin[0]], {
        icon: airplaneIcon,
        interactive: false,
        zIndexOffset: 1000
    }).addTo(map);

    // Get progress elements
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Start animation
    function animate(timestamp) {
        if (isPaused) {
            return;
        }

        if (!animationStartTime) {
            animationStartTime = timestamp - pausedElapsed;
        }

        const elapsed = timestamp - animationStartTime;
        const progress = Math.min(elapsed / CONFIG.animationDuration, 1);

        // Update progress bar
        const progressPercent = Math.round(progress * 100);
        if (progressFill) {
            progressFill.style.width = progressPercent + '%';
        }
        if (progressText) {
            progressText.textContent = progressPercent + '%';
        }

        // Calculate how many points to show
        const numPointsToShow = Math.floor(progress * fullPath.length);
        const currentPath = fullPath.slice(0, Math.max(2, numPointsToShow));

        // Update the path - convert [lng, lat] to [lat, lng] for Leaflet
        const leafletPath = currentPath.map(coord => [coord[1], coord[0]]);
        pathLine.setLatLngs(leafletPath);

        // Update airplane position and rotation
        if (currentPath.length > 0) {
            const currentPos = currentPath[currentPath.length - 1];
            airplaneMarker.setLatLng([currentPos[1], currentPos[0]]);

            // Calculate rotation angle if we have at least 2 points
            if (currentPath.length >= 2) {
                const prevPos = currentPath[currentPath.length - 2];
                // Calculate bearing angle from previous to current position
                const angle = Math.atan2(
                    currentPos[0] - prevPos[0],  // longitude difference
                    currentPos[1] - prevPos[1]   // latitude difference
                ) * 180 / Math.PI;

                const iconElement = airplaneMarker.getElement();
                if (iconElement) {
                    const svg = iconElement.querySelector('svg');
                    if (svg) {
                        // Rotate the triangle to point in the direction of travel
                        svg.style.transform = `rotate(${angle}deg)`;
                    }
                }
            }
        }

        // Continue animation until complete
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Animation complete - reset for replay
            isPaused = true;
            pausedElapsed = CONFIG.animationDuration;
            updatePlayPauseButton();
        }
    }

    // Don't start the animation automatically - wait for user to click play
    // animationFrameId = requestAnimationFrame(animate);

    // Play/Pause functionality
    const playPauseBtn = document.getElementById('playPauseBtn');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const playIcon = playPauseBtn.querySelector('.play-icon');

    function updatePlayPauseButton() {
        if (isPaused) {
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
        } else {
            pauseIcon.style.display = 'block';
            playIcon.style.display = 'none';
        }
    }

    playPauseBtn.addEventListener('click', function() {
        if (isPaused) {
            // Resume or restart
            const currentProgress = pausedElapsed / CONFIG.animationDuration;
            if (currentProgress >= 1) {
                // Restart from beginning
                animationStartTime = null;
                pausedElapsed = 0;
                // Reset airplane to origin
                airplaneMarker.setLatLng([CONFIG.origin[1], CONFIG.origin[0]]);
                // Reset path
                pathLine.setLatLngs([]);
                // Reset progress bar
                if (progressFill) progressFill.style.width = '0%';
                if (progressText) progressText.textContent = '0%';
            }
            isPaused = false;
            // Reset animation start time to account for paused time
            animationStartTime = null;
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Pause
            isPaused = true;
            if (animationStartTime) {
                // Store exactly how much time has elapsed
                pausedElapsed = performance.now() - animationStartTime;
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }
        updatePlayPauseButton();
    });

    // Initial button state
    updatePlayPauseButton();
});

// Toggle info panel
const toggleInfoPanelBtn = document.getElementById('toggleInfoPanel');
const infoPanel = document.querySelector('.info-panel');

toggleInfoPanelBtn.addEventListener('click', function() {
    infoPanel.classList.toggle('collapsed');
    // Update button text
    toggleInfoPanelBtn.textContent = infoPanel.classList.contains('collapsed') ? '+' : '−';

    // Trigger map resize after transition
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
});

// Toggle bottom panel
const toggleBottomPanelBtn = document.getElementById('toggleBottomPanel');
const bottomPanel = document.querySelector('.bottom-panel');

toggleBottomPanelBtn.addEventListener('click', function() {
    bottomPanel.classList.toggle('collapsed');
    bottomPanel.classList.toggle('expanded');
    // Update button text
    toggleBottomPanelBtn.textContent = bottomPanel.classList.contains('expanded') ? '−' : '+';

    // Trigger map resize after transition
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
});
