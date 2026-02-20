import { useState, useRef, useEffect } from 'react'
import './TimelineControl.css'

export default function TimelineControl({
    duration,
    currentTime,
    trimRange,
    zoomTime,
    onSeek,
    onTrimChange,
    onZoomTimeChange,
    zoomEndTime,
    onZoomEndTimeChange
}) {
    const containerRef = useRef(null)
    const [isDragging, setIsDragging] = useState(null) // 'scrubber', 'start', 'end', 'zoom-in', 'zoom-out'

    const getPercentage = (e) => {
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        return x / rect.width
    }

    const handleMouseDown = (e, type) => {
        e.stopPropagation()
        e.preventDefault() // Prevent text selection etc
        setIsDragging(type)
    }

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging || !duration) return

            const pct = getPercentage(e)
            const time = pct * duration

            if (isDragging === 'scrubber') {
                onSeek(time)
            } else if (isDragging === 'start') {
                const newStart = Math.min(time, trimRange[1] - 0.5) // Min 0.5s duration
                onTrimChange([Math.max(0, newStart), trimRange[1]])
                onSeek(newStart) // Preview start point
            } else if (isDragging === 'end') {
                const newEnd = Math.max(time, trimRange[0] + 0.5)
                onTrimChange([trimRange[0], Math.min(duration, newEnd)])
                onSeek(newEnd) // Preview end point
                onSeek(newEnd) // Preview end point
            } else if (isDragging === 'zoom-in') {
                // Enforce max < zoomEndTime if it exists
                const maxTime = zoomEndTime ? zoomEndTime - 0.5 : trimRange[1]
                const newTime = Math.min(Math.max(time, trimRange[0]), maxTime)
                onZoomTimeChange(newTime)
                onSeek(newTime)
            } else if (isDragging === 'zoom-out') {
                // Enforce min > zoomTime
                const minTime = zoomTime ? zoomTime + 0.5 : trimRange[0]
                const newTime = Math.max(Math.min(time, trimRange[1]), minTime)
                onZoomEndTimeChange(newTime)
                onSeek(newTime)
            }
        }

        const handleMouseUp = () => {
            setIsDragging(null)
        }

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, duration, trimRange, zoomTime, zoomEndTime, onSeek, onTrimChange, onZoomTimeChange, onZoomEndTimeChange])

    // Click on track to seek (if not clicking a handle)
    const handleTrackClick = (e) => {
        // Only if not dragging and target is track
        if (isDragging) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const pct = x / rect.width
        onSeek(pct * duration)
    }

    const toPct = (time) => (time / duration) * 100

    return (
        <div
            className="timeline-control"
            ref={containerRef}
            onMouseDown={(e) => {
                if (e.target === containerRef.current || e.target.classList.contains('timeline-track') || e.target.classList.contains('timeline-active-region')) {
                    handleTrackClick(e)
                }
            }}
        >
            <div className="timeline-track">
                {/* Dimmed Background (Full Duration) */}

                {/* Active Region (Trimmed) */}
                <div
                    className="timeline-active-region"
                    style={{
                        left: `${toPct(trimRange[0])}%`,
                        width: `${toPct(trimRange[1] - trimRange[0])}%`
                    }}
                />

                {/* Trim Handles */}
                <div
                    className="timeline-handle handle-start"
                    style={{ left: `${toPct(trimRange[0])}%` }}
                    onMouseDown={(e) => handleMouseDown(e, 'start')}
                    title="Drag to trim start"
                >
                    <div className="handle-grip" />
                </div>
                <div
                    className="timeline-handle handle-end"
                    style={{ left: `${toPct(trimRange[1])}%` }}
                    onMouseDown={(e) => handleMouseDown(e, 'end')}
                    title="Drag to trim end"
                >
                    <div className="handle-grip" />
                </div>

                {/* Zoom Region */}
                {zoomTime !== null && zoomEndTime !== null && (
                    <div
                        className="timeline-zoom-region"
                        style={{
                            left: `${toPct(zoomTime)}%`,
                            width: `${toPct(zoomEndTime - zoomTime)}%`
                        }}
                    />
                )}

                {/* Zoom Markers */}
                {zoomTime !== null && (
                    <div
                        className="timeline-zoom-marker marker-in"
                        style={{ left: `${toPct(zoomTime)}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 'zoom-in')}
                        title="Zoom In"
                    >
                        <div className="zoom-icon">Z</div>
                        <div className="zoom-line" />
                    </div>
                )}

                {zoomEndTime !== null && (
                    <div
                        className="timeline-zoom-marker marker-out"
                        style={{ left: `${toPct(zoomEndTime)}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 'zoom-out')}
                        title="Zoom Out"
                    >
                        <div className="zoom-icon">O</div>
                        <div className="zoom-line" />
                    </div>
                )}

                {/* Playhead */}
                <div
                    className="timeline-playhead"
                    style={{ left: `${toPct(currentTime)}%` }}
                />
            </div>
        </div>
    )
}
