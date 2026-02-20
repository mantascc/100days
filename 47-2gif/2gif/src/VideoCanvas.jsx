import { useEffect, useRef, useState } from 'react'
import './VideoCanvas.css'

import TrimTimeline from './TrimTimeline'
import ZoomTimeline from './ZoomTimeline'

function VideoCanvas({
  videoFile,
  onCropChange,
  onZoomTimeChange,
  externalCropRect,
  trimRange,
  onTrimChange,
  onDurationChange,
  zoomTime,
  zoomEndTime,
  onZoomEndTimeChange,
  onCurrentTimeChange,
  backgroundSettings
}) {
  // Helper to calculate the rendered video rect (inner area if background enabled)
  const getVideoRect = (renderWidth, renderHeight) => {
    if (backgroundSettings && backgroundSettings.enabled) {
      const scaleFactor = 1 / (1 + backgroundSettings.padding)
      const innerWidth = renderWidth * scaleFactor
      const innerHeight = renderHeight * scaleFactor
      const ox = (renderWidth - innerWidth) / 2
      const oy = (renderHeight - innerHeight) / 2
      return { x: ox, y: oy, width: innerWidth, height: innerHeight }
    }
    return { x: 0, y: 0, width: renderWidth, height: renderHeight }
  }
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })

  // Crop state
  const [cropRect, setCropRect] = useState(null)
  const [zoomStartTime, setZoomStartTime] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragHandle, setDragHandle] = useState(null)

  // Sync with external crop clear
  useEffect(() => {
    if (externalCropRect === null) {
      setCropRect(null)
      setZoomStartTime(null)
    }
  }, [externalCropRect])

  // Initialize video
  useEffect(() => {
    if (!videoFile || !videoRef.current) return

    const video = videoRef.current
    const url = URL.createObjectURL(videoFile)
    video.src = url

    video.addEventListener('loadedmetadata', () => {
      const dur = video.duration
      setDuration(dur)
      onDurationChange && onDurationChange(dur)
      setVideoDimensions({ width: video.videoWidth, height: video.videoHeight })

      // Initialize trim range if not set
      if (!trimRange || trimRange[1] === 0) {
        onTrimChange && onTrimChange([0, dur])
      }
    })

    return () => {
      URL.revokeObjectURL(url)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [videoFile])

  // Render video frames to canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || videoDimensions.width === 0) return

    const ctx = canvas.getContext('2d')

    const render = () => {
      if (video.readyState >= 2) {
        // Calculate canvas size to fit container while maintaining aspect ratio
        const containerWidth = canvas.parentElement.clientWidth
        const containerHeight = canvas.parentElement.clientHeight
        const videoAspect = videoDimensions.width / videoDimensions.height
        const containerAspect = containerWidth / containerHeight

        let renderWidth, renderHeight
        if (containerAspect > videoAspect) {
          renderHeight = containerHeight
          renderWidth = renderHeight * videoAspect
        } else {
          renderWidth = containerWidth
          renderHeight = renderWidth / videoAspect
        }

        canvas.width = renderWidth
        canvas.height = renderHeight

        drawVideoFrame(ctx, video, renderWidth, renderHeight)
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(render)
      }
    }

    render()

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(render)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [videoDimensions, isPlaying, cropRect, backgroundSettings])

  const drawVideoFrame = (ctx, video, width, height) => {
    // Draw video
    if (backgroundSettings && backgroundSettings.enabled) {
      // Fill background
      ctx.fillStyle = backgroundSettings.color
      ctx.fillRect(0, 0, width, height)

      const { x: ox, y: oy, width: innerWidth, height: innerHeight } = getVideoRect(width, height)

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(ox, oy, innerWidth, innerHeight, backgroundSettings.borderRadius)
      ctx.clip()

      ctx.drawImage(video, ox, oy, innerWidth, innerHeight)
      ctx.restore()
    } else {
      ctx.drawImage(video, 0, 0, width, height)
    }

    // Draw crop overlay
    if (cropRect) {
      drawCropOverlay(ctx, width, height)
    }
  }

  const renderFrame = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !video || !ctx) return

    drawVideoFrame(ctx, video, canvas.width, canvas.height)
  }

  const drawCropOverlay = (ctx, canvasWidth, canvasHeight) => {
    if (!cropRect) return

    const { x, y, width, height } = cropRect

    // Antialiasing fix: Round coordinates to avoid sub-pixel flickering on the dashed line
    const rx = Math.round(x)
    const ry = Math.round(y)
    const rw = Math.round(width)
    const rh = Math.round(height)

    // Darken area outside crop
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvasWidth, ry)
    ctx.fillRect(0, ry, rx, rh)
    ctx.fillRect(rx + rw, ry, canvasWidth - (rx + rw), rh)
    ctx.fillRect(0, ry + rh, canvasWidth, canvasHeight - (ry + rh))

    // Draw crop border
    ctx.strokeStyle = 'rgba(0, 168, 255, 0.3)' // Very subtle accent
    ctx.lineWidth = 1
    ctx.strokeRect(rx, ry, rw, rh)

    // Draw resize handles
    const handleRadius = 3 // 6px diameter
    const handles = [
      { x: x, y: y }, // top-left
      { x: x + width, y: y }, // top-right
      { x: x, y: y + height }, // bottom-left
      { x: x + width, y: y + height }, // bottom-right
    ]

    ctx.fillStyle = 'var(--accent)'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2

    handles.forEach(handle => {
      ctx.beginPath()
      ctx.arc(handle.x, handle.y, handleRadius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    })

    // Draw dimensions (centered above)
    ctx.fillStyle = 'var(--accent)'
    ctx.font = '12px var(--font-mono)'

    // Calculate display dimensions based on inner video
    const { width: innerWidth, height: innerHeight } = getVideoRect(canvasWidth, canvasHeight)
    const scaleX = videoDimensions.width / innerWidth
    const scaleY = videoDimensions.height / innerHeight

    const actualWidth = Math.round(width * scaleX)
    const actualHeight = Math.round(height * scaleY)
    const text = `${actualWidth}×${actualHeight}`
    const textMetrics = ctx.measureText(text)
    ctx.fillText(text, rx + rw / 2 - textMetrics.width / 2, ry - 10)
  }

  // Mouse interactions
  const getMousePos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const getHandleAtPos = (x, y) => {
    if (!cropRect) return null

    const handleSize = 30

    // Adjust handles to visual position
    // cropRect is in VIDEO space relative coords? 
    // NO, cropRect is currently in CANVAS pixels from previous implementation.
    // BUT we need to check handles visually on screen.
    // If cropRect is stored relative to canvas 0,0 (old way), then it might be partly in padding area.
    // Ideally, cropRect should track position relative to VIDEO surface?
    // Let's assume cropRect is in CANVAS coordinates but we force it inside video area during drag.
    // So here we just check distance.

    const handles = [
      { name: 'tl', x: cropRect.x, y: cropRect.y },
      { name: 'tr', x: cropRect.x + cropRect.width, y: cropRect.y },
      { name: 'bl', x: cropRect.x, y: cropRect.y + cropRect.height },
      { name: 'br', x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height },
    ]

    for (const handle of handles) {
      if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
        return handle.name
      }
    }

    // Check if inside crop rect (for dragging)
    if (x >= cropRect.x && x <= cropRect.x + cropRect.width &&
      y >= cropRect.y && y <= cropRect.y + cropRect.height) {
      return 'move'
    }

    return null
  }

  const handleCanvasMouseDown = (e) => {
    const pos = getMousePos(e)
    const handle = getHandleAtPos(pos.x, pos.y)

    if (handle) {
      setIsDragging(true)
      setDragHandle(handle)
      setDragStart(pos)
    } else {
      // Start drawing new crop rect
      // Constrain start point to video area
      const canvas = canvasRef.current
      const videoRect = getVideoRect(canvas.width, canvas.height)

      const startX = Math.max(videoRect.x, Math.min(pos.x, videoRect.x + videoRect.width))
      const startY = Math.max(videoRect.y, Math.min(pos.y, videoRect.y + videoRect.height))

      setIsDrawing(true)
      setDragStart({ x: startX, y: startY })
      setCropRect({ x: startX, y: startY, width: 0, height: 0 })
    }
  }

  const handleCanvasMouseMove = (e) => {
    const pos = getMousePos(e)

    if (isDrawing) {
      const width = pos.x - dragStart.x
      const videoAspect = videoDimensions.width / videoDimensions.height
      const height = Math.abs(width) / videoAspect

      setCropRect({
        x: width < 0 ? pos.x : dragStart.x,
        y: (pos.y - dragStart.y) < 0 ? pos.y : dragStart.y, // Keep y anchor but ignore drag dist
        width: Math.abs(width),
        height: height
      })
      requestAnimationFrame(renderFrame)
    } else if (isDragging && cropRect) {
      const dx = pos.x - dragStart.x
      const dy = pos.y - dragStart.y

      let newCrop = { ...cropRect }

      if (dragHandle === 'move') {
        newCrop.x += dx
        newCrop.y += dy
      } else if (dragHandle === 'tl') {
        newCrop.x += dx
        newCrop.y += dy
        newCrop.width -= dx
        newCrop.height -= dy
      } else if (dragHandle === 'tr') {
        newCrop.y += dy
        newCrop.width += dx
        newCrop.height -= dy
      } else if (dragHandle === 'bl') {
        newCrop.x += dx
        newCrop.width -= dx
        newCrop.height += dy
      } else if (dragHandle === 'br') {
        newCrop.width += dx
        newCrop.height += dy
      }

      // Clamp to VIDEO bounds (not canvas bounds)
      const canvas = canvasRef.current
      // Calculate video rect again
      const videoRect = getVideoRect(canvas.width, canvas.height)
      const videoAspect = videoDimensions.width / videoDimensions.height

      // First clamp x/y to bounds
      newCrop.x = Math.max(videoRect.x, Math.min(newCrop.x, videoRect.x + videoRect.width - 20)) // min 20 px?
      newCrop.y = Math.max(videoRect.y, Math.min(newCrop.y, videoRect.y + videoRect.height - 20))

      // Enforce aspect ratio on width/height
      if (dragHandle === 'move') {
        // Just moving, check bounds
        newCrop.x = Math.max(videoRect.x, Math.min(newCrop.x, videoRect.x + videoRect.width - newCrop.width))
        newCrop.y = Math.max(videoRect.y, Math.min(newCrop.y, videoRect.y + videoRect.height - newCrop.height))
      } else {
        // Resizing
        // Calculate max available width based on x position
        const maxWidth = (videoRect.x + videoRect.width) - newCrop.x

        // Apply aspect ratio
        newCrop.height = newCrop.width / videoAspect

        // Check vertical bounds
        if (newCrop.y + newCrop.height > videoRect.y + videoRect.height) {
          newCrop.height = (videoRect.y + videoRect.height) - newCrop.y
          newCrop.width = newCrop.height * videoAspect
        }
      }

      setCropRect(newCrop)
      setDragStart(pos)

      requestAnimationFrame(renderFrame)
    } else {
      // Update cursor
      const handle = getHandleAtPos(pos.x, pos.y)
      const canvas = canvasRef.current
      if (handle === 'move') {
        canvas.style.cursor = 'move'
      } else if (handle === 'tl' || handle === 'br') {
        canvas.style.cursor = 'nwse-resize'
      } else if (handle === 'tr' || handle === 'bl') {
        canvas.style.cursor = 'nesw-resize'
      } else {
        canvas.style.cursor = 'crosshair'
      }
    }
  }

  const handleCanvasMouseUp = () => {
    if (isDrawing || isDragging) {
      if (cropRect && onCropChange) {
        const canvas = canvasRef.current
        const videoRect = getVideoRect(canvas.width, canvas.height)

        // Scale needs to be relative to the INNER video size, not full canvas
        const scaleX = videoDimensions.width / videoRect.width
        const scaleY = videoDimensions.height / videoRect.height

        // Coords need to be relative to video origin (ox, oy)
        onCropChange({
          x: Math.round((cropRect.x - videoRect.x) * scaleX),
          y: Math.round((cropRect.y - videoRect.y) * scaleY),
          width: Math.round(cropRect.width * scaleX),
          height: Math.round(cropRect.height * scaleY)
        })

        // Only set zoom-in marker when initially drawing crop, not when editing
        if (isDrawing) {
          const newZoomTime = currentTime
          setZoomStartTime(newZoomTime)
          if (onZoomTimeChange) {
            onZoomTimeChange(newZoomTime)
          }
        }
      }
    }
    setIsDrawing(false)
    setIsDragging(false)
    setDragHandle(null)
  }

  const setZoomAtCurrentTime = () => {
    if (cropRect) {
      const newZoomTime = currentTime
      setZoomStartTime(newZoomTime)
      if (onZoomTimeChange) {
        onZoomTimeChange(newZoomTime)
      }
    }
  }

  // Playback controls
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * duration
    setCurrentTime(video.currentTime)
    onCurrentTimeChange && onCurrentTimeChange(video.currentTime)

    renderFrame()
  }

  const handleTimelineSeek = (time) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = time
    setCurrentTime(time)
    onCurrentTimeChange && onCurrentTimeChange(time)

    renderFrame()
  }

  // Update time
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      const time = video.currentTime
      setCurrentTime(time)
      onCurrentTimeChange && onCurrentTimeChange(time)
    }
    video.addEventListener('timeupdate', updateTime)

    return () => video.removeEventListener('timeupdate', updateTime)
  }, [onCurrentTimeChange])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="video-canvas-container">
      <video ref={videoRef} style={{ display: 'none' }} />
      {/* STAGE 2: Crop interaction enabled */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="video-canvas"
          style={{ cursor: 'crosshair' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>

      <div className="video-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button className="control-button" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>

          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Trim Timeline - Always visible */}
        <TrimTimeline
          duration={duration}
          currentTime={currentTime}
          trimRange={trimRange || [0, duration]}
          onSeek={handleTimelineSeek}
          onTrimChange={onTrimChange}
        />

        {/* Zoom Timeline - Only when crop exists */}
        <ZoomTimeline
          duration={duration}
          currentTime={currentTime}
          trimRange={trimRange || [0, duration]}
          zoomTime={zoomTime}
          zoomEndTime={zoomEndTime}
          hasCrop={!!cropRect}
          onSeek={handleTimelineSeek}
          onZoomTimeChange={(time) => {
            setZoomStartTime(time)
            onZoomTimeChange && onZoomTimeChange(time)
          }}
          onZoomEndTimeChange={onZoomEndTimeChange}
        />
      </div>
    </div>
  )
}

export default VideoCanvas
