import { useState, useRef, useEffect } from 'react'
import './TrimTimeline.css'

export default function TrimTimeline({
    duration,
    currentTime,
    trimRange,
    onSeek,
    onTrimChange
}) {
    const containerRef = useRef(null)
    const trackRef = useRef(null)
    const [isDragging, setIsDragging] = useState(null) // 'scrubber', 'start', 'end'

    const getPercentage = (e) => {
        if (!trackRef.current) return 0
        const rect = trackRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        return x / rect.width
    }

    const handleMouseDown = (e, type) => {
        e.stopPropagation()
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
                const newStart = Math.min(time, trimRange[1] - 0.5)
                onTrimChange([Math.max(0, newStart), trimRange[1]])
                onSeek(newStart)
            } else if (isDragging === 'end') {
                const newEnd = Math.max(time, trimRange[0] + 0.5)
                onTrimChange([trimRange[0], Math.min(duration, newEnd)])
                onSeek(newEnd)
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
    }, [isDragging, duration, trimRange, onSeek, onTrimChange])

    const handleTrackClick = (e) => {
        if (isDragging || !trackRef.current) return

        const rect = trackRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const pct = x / rect.width
        onSeek(pct * duration)
    }

    const toPct = (time) => (time / duration) * 100

    return (
        <div className="trim-timeline-wrapper">
            <label className="timeline-label">Trim</label>
            <div
                className="trim-timeline-control"
                ref={containerRef}
                onMouseDown={(e) => {
                    if (e.target === trackRef.current ||
                        e.target.classList.contains('trim-timeline-track') ||
                        e.target.classList.contains('trim-active-region')) {
                        handleTrackClick(e)
                    }
                }}
            >
                <div className="trim-timeline-track" ref={trackRef}>
                    {/* Active Region (Trimmed) */}
                    <div
                        className="trim-active-region"
                        style={{
                            left: `${toPct(trimRange[0])}%`,
                            width: `${toPct(trimRange[1] - trimRange[0])}%`
                        }}
                    />

                    {/* Trim Handles */}
                    <div
                        className="trim-handle handle-start"
                        style={{ left: `${toPct(trimRange[0])}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 'start')}
                        title="Drag to trim start"
                    >
                        <div className="handle-grip" />
                    </div>
                    <div
                        className="trim-handle handle-end"
                        style={{ left: `${toPct(trimRange[1])}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 'end')}
                        title="Drag to trim end"
                    >
                        <div className="handle-grip" />
                    </div>

                    {/* Playhead */}
                    <div
                        className="trim-playhead"
                        style={{ left: `${toPct(currentTime)}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
