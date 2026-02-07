import { useState, useRef, useEffect } from 'react'
import './ZoomTimeline.css'

export default function ZoomTimeline({
    duration,
    currentTime,
    trimRange,
    zoomTime,
    zoomEndTime,
    onSeek,
    onZoomTimeChange,
    onZoomEndTimeChange,
    hasCrop
}) {
    const containerRef = useRef(null)
    const trackRef = useRef(null)
    const [isDragging, setIsDragging] = useState(null) // 'zoom-in', 'zoom-out'

    const getPercentage = (e) => {
        if (!trackRef.current) return 0
        const rect = trackRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        return x / rect.width
    }

    const handleMouseDown = (e, type) => {
        e.stopPropagation()
        e.preventDefault()
        setIsDragging(type)
    }

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging || !duration) return

            const pct = getPercentage(e)
            const time = pct * duration

            if (isDragging === 'zoom-in') {
                // Clamp between trim start and zoom-out (0.1s minimum gap)
                const maxTime = zoomEndTime ? zoomEndTime - 0.1 : trimRange[1]
                const newTime = Math.min(Math.max(time, trimRange[0]), maxTime)
                onZoomTimeChange(newTime)
                onSeek(newTime)
            } else if (isDragging === 'zoom-out') {
                // Clamp between zoom-in and trim end (0.1s minimum gap)
                const minTime = zoomTime ? zoomTime + 0.1 : trimRange[0]
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
    }, [isDragging, duration, trimRange, zoomTime, zoomEndTime, onSeek, onZoomTimeChange, onZoomEndTimeChange])

    const handleTrackClick = (e) => {
        if (isDragging || !trackRef.current) return

        const rect = trackRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const pct = x / rect.width
        onSeek(pct * duration)
    }

    const toPct = (time) => (time / duration) * 100

    if (!hasCrop) {
        return (
            <div className="zoom-timeline-wrapper">
                <label className="timeline-label">Zoom</label>
                <div className="zoom-timeline-disabled">
                    <p>Draw a crop rectangle to enable zoom controls</p>
                </div>
            </div>
        )
    }

    return (
        <div className="zoom-timeline-wrapper">
            <label className="timeline-label">Zoom</label>
            <div
                className="zoom-timeline-control"
                ref={containerRef}
                onMouseDown={(e) => {
                    if (e.target === trackRef.current ||
                        e.target.classList.contains('zoom-timeline-track')) {
                        handleTrackClick(e)
                    }
                }}
            >
                <div className="zoom-timeline-track" ref={trackRef}>
                    {/* Trimmed region reference (subtle) */}
                    <div
                        className="zoom-trim-reference"
                        style={{
                            left: `${toPct(trimRange[0])}%`,
                            width: `${toPct(trimRange[1] - trimRange[0])}%`
                        }}
                    />

                    {/* Zoom Region */}
                    {zoomTime !== null && zoomEndTime !== null && (
                        <div
                            className="zoom-region"
                            style={{
                                left: `${toPct(zoomTime)}%`,
                                width: `${toPct(zoomEndTime - zoomTime)}%`
                            }}
                        />
                    )}

                    {/* Zoom In Marker */}
                    {zoomTime !== null && (
                        <div
                            className="zoom-marker marker-in"
                            style={{ left: `${toPct(zoomTime)}%` }}
                            onMouseDown={(e) => handleMouseDown(e, 'zoom-in')}
                            title="Zoom In Start"
                        >
                            <div className="marker-icon"></div>
                            <div className="marker-line" />
                        </div>
                    )}

                    {/* Zoom Out Marker */}
                    {zoomEndTime !== null && (
                        <div
                            className="zoom-marker marker-out"
                            style={{ left: `${toPct(zoomEndTime)}%` }}
                            onMouseDown={(e) => handleMouseDown(e, 'zoom-out')}
                            title="Zoom Out/Reset"
                        >
                            <div className="marker-icon"></div>
                            <div className="marker-line" />
                        </div>
                    )}

                    {/* Playhead */}
                    <div
                        className="zoom-playhead"
                        style={{ left: `${toPct(currentTime)}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
