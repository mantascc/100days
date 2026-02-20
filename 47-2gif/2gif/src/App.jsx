import { useState, useRef } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import VideoCanvas from './VideoCanvas'
import { buildThreePartFilter, buildTwoPartFilter, buildSimpleFilter } from './utils/ffmpegFilters'
import './App.css'

function App() {
  const [videoFile, setVideoFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [cropRect, setCropRect] = useState(null)
  const [zoomStartTime, setZoomStartTime] = useState(null)
  const [zoomEndTime, setZoomEndTime] = useState(null)
  const [trimRange, setTrimRange] = useState([0, 0]) // [start, end]
  const [currentTime, setCurrentTime] = useState(0)
  const [exportSettings, setExportSettings] = useState({
    fps: 15,
    width: 600,
    colors: 256,
    dither: 5,
    loop: 0,
    quality: 'high'
  })
  const [backgroundSettings, setBackgroundSettings] = useState({
    enabled: true,
    color: '#292929', // Default dark gray
    padding: 0.1,     // 10%
    borderRadius: 16
  })
  const fileInputRef = useRef(null)
  const ffmpegRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const loadFFmpeg = async () => {
    if (!ffmpegRef.current) {
      const ffmpeg = new FFmpeg()

      ffmpeg.on('log', ({ message }) => {
        // FFmpeg internal logging (no output)
      })

      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100))
      })

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })

      ffmpegRef.current = ffmpeg
    }
    return ffmpegRef.current
  }

  const getVideoDuration = () => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.src = URL.createObjectURL(videoFile)
      video.onloadedmetadata = () => {
        resolve(video.duration)
        URL.revokeObjectURL(video.src)
      }
    })
  }

  const handleExport = async () => {
    if (!videoFile) return

    try {
      setProcessing(true)
      setProgress(0)

      const ffmpeg = await loadFFmpeg()
      const videoDuration = await getVideoDuration()

      // Write video file to ffmpeg filesystem
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))

      // Build filter string based on settings
      const { fps, width, colors, dither, loop } = exportSettings

      // Generate mask if background is enabled
      let maskFile = null
      if (backgroundSettings.enabled) {
        // Create a canvas to draw the mask
        const maskCanvas = document.createElement('canvas')
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(videoFile)
        await new Promise(r => videoElement.onloadedmetadata = r)

        // Use export width to determine dimensions
        const videoAspect = videoElement.videoWidth / videoElement.videoHeight
        const targetHeight = Math.round(width / videoAspect)

        maskCanvas.width = width
        maskCanvas.height = targetHeight

        const ctx = maskCanvas.getContext('2d')
        // Clear with transparent
        ctx.clearRect(0, 0, width, targetHeight)

        // Draw white rounded rectangle
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.roundRect(0, 0, width, targetHeight, backgroundSettings.borderRadius)
        ctx.fill()

        // Convert to blob and write to ffmpeg
        const blob = await new Promise(r => maskCanvas.toBlob(r, 'image/png'))
        const arrayBuffer = await blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        await ffmpeg.writeFile('mask.png', uint8Array)
        maskFile = 'mask.png'
      }

      // STAGE 2: Zoom/Crop Logic with Zoom In/Out support
      if (cropRect && zoomStartTime !== null && zoomStartTime > 0) {
        // Calculate target height to maintain aspect ratio
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(videoFile)
        await new Promise(r => videoElement.onloadedmetadata = r)
        const videoAspect = videoElement.videoWidth / videoElement.videoHeight
        const targetHeight = Math.round(width / videoAspect)

        // Ensure even dimensions for ffmpeg
        const safeWidth = width % 2 === 0 ? width : width - 1
        const safeHeight = targetHeight % 2 === 0 ? targetHeight : targetHeight - 1

        // Clamp cropRect to prevent FFmpeg errors
        // Reuse videoElement from line 155
        const videoWidth = videoElement.videoWidth
        const videoHeight = videoElement.videoHeight

        const clampedCrop = {
          x: Math.max(0, Math.min(cropRect.x, videoWidth - cropRect.width)),
          y: Math.max(0, Math.min(cropRect.y, videoHeight - cropRect.height)),
          width: Math.min(cropRect.width, videoWidth),
          height: Math.min(cropRect.height, videoHeight)
        }

        // Double check right/bottom edges to ensure we don't exceed bounds
        if (clampedCrop.x + clampedCrop.width > videoWidth) {
          clampedCrop.width = Math.max(1, videoWidth - clampedCrop.x)
        }
        if (clampedCrop.y + clampedCrop.height > videoHeight) {
          clampedCrop.height = Math.max(1, videoHeight - clampedCrop.y)
        }

        // Ensure even dimensions for crop to avoid some ffmpeg issues with certain codecs/filters
        clampedCrop.width = Math.floor(clampedCrop.width / 2) * 2
        clampedCrop.height = Math.floor(clampedCrop.height / 2) * 2

        let filterComplex

        if (zoomEndTime !== null && zoomEndTime > zoomStartTime) {
          // 3-PART: Normal → Zoomed → Zoom Out
          filterComplex = buildThreePartFilter(
            trimRange,
            zoomStartTime,
            zoomEndTime,
            clampedCrop,
            fps,
            safeWidth,
            safeHeight,
            colors,
            dither,
            backgroundSettings.enabled ? backgroundSettings : null,
            maskFile
          )
        } else {
          // 2-PART: Normal → Zoomed (no zoom out)
          filterComplex = buildTwoPartFilter(
            trimRange,
            zoomStartTime,
            clampedCrop,
            fps,
            safeWidth,
            safeHeight,
            colors,
            dither,
            backgroundSettings.enabled ? backgroundSettings : null,
            maskFile
          )
        }

        const ffmpegArgs = ['-i', 'input.mp4']
        if (maskFile) {
          ffmpegArgs.push('-i', maskFile)
        }
        ffmpegArgs.push('-filter_complex', filterComplex)
        ffmpegArgs.push('-loop', loop.toString())
        ffmpegArgs.push('output.gif')

        await ffmpeg.exec(ffmpegArgs)
      } else {
        // STAGE 1: Basic full video export with trimming
        const filter = buildSimpleFilter(
          trimRange,
          fps,
          width,
          colors,
          dither,
          backgroundSettings.enabled ? backgroundSettings : null,
          maskFile
        )

        const filterFlag = backgroundSettings.enabled ? '-filter_complex' : '-vf'

        const ffmpegArgs = ['-i', 'input.mp4']
        if (maskFile && backgroundSettings.enabled) {
          ffmpegArgs.push('-i', maskFile)
        }
        ffmpegArgs.push(filterFlag, filter)
        ffmpegArgs.push('-loop', loop.toString())
        ffmpegArgs.push('output.gif')

        await ffmpeg.exec(ffmpegArgs)
      }

      // Read the output GIF
      const data = await ffmpeg.readFile('output.gif')

      // Create download link
      const blob = new Blob([data.buffer], { type: 'image/gif' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = videoFile.name.replace(/\.[^/.]+$/, '') + '.gif'
      a.click()
      URL.revokeObjectURL(url)

      // Cleanup
      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.gif')
      if (maskFile) await ffmpeg.deleteFile('mask.png')

      setProcessing(false)
      setProgress(0)
    } catch (error) {
      console.error('Export failed:', error)
      setProcessing(false)
      setProgress(0)
      alert('Export failed. Check console for details.')
    }
  }

  const applyPreset = (preset) => {
    const presets = {
      high: { fps: 15, width: 800, colors: 256, dither: 5, loop: 0, quality: 'high' },
      medium: { fps: 12, width: 600, colors: 128, dither: 4, loop: 0, quality: 'medium' },
      low: { fps: 10, width: 480, colors: 64, dither: 3, loop: 0, quality: 'low' },
    }
    setExportSettings(presets[preset])
  }

  return (
    <div className="app">
      {/* Canvas Area */}
      <div className="canvas-area">
        {!videoFile ? (
          <div
            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h2>Drop video here</h2>
            <p>or</p>
            <button className="upload-button" onClick={handleUploadClick}>
              Select File
            </button>
            <p>MP4, MOV, WebM • Max 500MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <VideoCanvas
            videoFile={videoFile}
            onCropChange={(rect) => {
              setCropRect(rect)
              if (!rect) {
                // Clear zoom markers only when "Clear Crop" is clicked
                setZoomEndTime(null)
                setZoomStartTime(null)
              }
              // Note: zoom in marker is set by VideoCanvas via onZoomTimeChange
            }}
            onZoomTimeChange={setZoomStartTime}
            externalCropRect={cropRect}
            trimRange={trimRange}
            onTrimChange={setTrimRange}
            zoomTime={zoomStartTime}
            zoomEndTime={zoomEndTime}
            onZoomEndTimeChange={setZoomEndTime}
            onCurrentTimeChange={setCurrentTime}
            backgroundSettings={backgroundSettings}
          />
        )}
      </div>

      {/* Settings Panel */}
      <div className="settings-panel">
        <div className="settings-section">
          <h2>2GIF</h2>
        </div>

        {videoFile && (
          <>
            <div className="settings-section">
              <h2>Video</h2>
              <div className="control-group">
                <div className="control-label">File</div>
                <p style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  wordBreak: 'break-all'
                }}>
                  {videoFile.name}
                </p>
                <button
                  className="button-primary"
                  onClick={handleExport}
                  disabled={processing}
                  style={{ marginTop: '12px', width: '100%' }}
                >
                  {processing ? `Exporting... ${progress}%` : 'Export GIF'}
                </button>
              </div>
            </div>

            {/* STAGE 2: Zoom UI */}
            <div className="settings-section">
              <h2>Zoom</h2>
              <div className="control-group">
                {cropRect ? (
                  <>
                    <div className="control-label">Selection</div>
                    <p style={{
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}>
                      {cropRect.width}×{cropRect.height}
                    </p>
                    {zoomStartTime !== null && (
                      <p style={{
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--success)',
                        marginTop: '4px'
                      }}>
                        Zoom-in at {(zoomStartTime - trimRange[0]).toFixed(1)}s
                      </p>
                    )}
                    {zoomEndTime !== null && (
                      <p style={{
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                        color: '#e67e22',
                        marginTop: '4px'
                      }}>
                        Zoom-out at {(zoomEndTime - trimRange[0]).toFixed(1)}s
                      </p>
                    )}
                    <button
                      style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        backgroundColor: 'var(--surface-2)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                      }}
                      onClick={() => {
                        setCropRect(null)
                        setZoomStartTime(null)
                      }}
                    >
                      Clear Zoom
                    </button>
                    {zoomStartTime !== null && zoomEndTime === null && (
                      <button
                        style={{
                          marginTop: '8px',
                          marginLeft: '8px',
                          padding: '6px 12px',
                          backgroundColor: 'var(--surface-2)',
                          color: '#e67e22',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius)',
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                        }}
                        onClick={() => {
                          const end = Math.max(zoomStartTime + 0.5, Math.min(trimRange[1], currentTime))
                          setZoomEndTime(end)
                        }}
                      >
                        Add Zoom Out
                      </button>
                    )}
                  </>
                ) : (
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-disabled)',
                  }}>
                    Select an area in the video to zoom in
                  </p>
                )}
              </div>
            </div>

            <div className="settings-section">
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  marginBottom: showSettings ? '16px' : '0'
                }}
              >
                <h2 style={{ margin: 0 }}>Export Settings</h2>
                <span style={{
                  transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>
                  ▼
                </span>
              </button>

              {showSettings && (
                <div className="settings-content" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="control-group">
                    <label className="control-label">Quality Preset</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: exportSettings.quality === 'high' ? 'var(--surface-hover)' : 'var(--surface-2)',
                          color: 'var(--text-primary)',
                          border: exportSettings.quality === 'high' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius)',
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                        }}
                        onClick={() => applyPreset('high')}
                      >
                        High
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: exportSettings.quality === 'medium' ? 'var(--surface-hover)' : 'var(--surface-2)',
                          color: 'var(--text-primary)',
                          border: exportSettings.quality === 'medium' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius)',
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                        }}
                        onClick={() => applyPreset('medium')}
                      >
                        Medium
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: exportSettings.quality === 'low' ? 'var(--surface-hover)' : 'var(--surface-2)',
                          color: 'var(--text-primary)',
                          border: exportSettings.quality === 'low' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius)',
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                        }}
                        onClick={() => applyPreset('low')}
                      >
                        Low
                      </button>
                    </div>
                  </div>

                  <div className="control-group">
                    <label className="control-label">
                      FPS <span style={{ color: 'var(--text-primary)' }}>{exportSettings.fps}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={exportSettings.fps}
                      onChange={(e) => setExportSettings({ ...exportSettings, fps: parseInt(e.target.value), quality: 'custom' })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="control-group">
                    <label className="control-label">
                      Width <span style={{ color: 'var(--text-primary)' }}>{exportSettings.width}px</span>
                    </label>
                    <input
                      type="range"
                      min="320"
                      max="1200"
                      step="40"
                      value={exportSettings.width}
                      onChange={(e) => setExportSettings({ ...exportSettings, width: parseInt(e.target.value), quality: 'custom' })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="control-group">
                    <label className="control-label">
                      Colors <span style={{ color: 'var(--text-primary)' }}>{exportSettings.colors}</span>
                    </label>
                    <input
                      type="range"
                      min="32"
                      max="256"
                      step="32"
                      value={exportSettings.colors}
                      onChange={(e) => setExportSettings({ ...exportSettings, colors: parseInt(e.target.value), quality: 'custom' })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="control-group">
                    <label className="control-label">
                      Dither <span style={{ color: 'var(--text-primary)' }}>{exportSettings.dither}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={exportSettings.dither}
                      onChange={(e) => setExportSettings({ ...exportSettings, dither: parseInt(e.target.value), quality: 'custom' })}
                      style={{ width: '100%' }}
                    />
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--text-disabled)',
                      marginTop: '4px'
                    }}>
                      Higher = smoother gradients, larger file
                    </p>
                  </div>

                  <div className="control-group">
                    <label className="control-label">Loop</label>
                    <select
                      value={exportSettings.loop}
                      onChange={(e) => setExportSettings({ ...exportSettings, loop: parseInt(e.target.value), quality: 'custom' })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'var(--surface-2)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px'
                      }}
                    >
                      <option value="0">Loop forever</option>
                      <option value="-1">Play once</option>
                      <option value="1">Loop 1 time</option>
                      <option value="2">Loop 2 times</option>
                      <option value="3">Loop 3 times</option>
                      <option value="5">Loop 5 times</option>
                      <option value="10">Loop 10 times</option>
                    </select>
                  </div>


                </div>
              )}
            </div>

            <div className="settings-section">
              <h2>Background</h2>
              <div className="control-group">
                <label className="control-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Enable Background
                  <input
                    type="checkbox"
                    checked={backgroundSettings.enabled}
                    onChange={(e) => setBackgroundSettings({ ...backgroundSettings, enabled: e.target.checked })}
                  />
                </label>
              </div>

              {backgroundSettings.enabled && (
                <>
                  <div className="control-group">
                    <label className="control-label">Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={backgroundSettings.color}
                        onChange={(e) => setBackgroundSettings({ ...backgroundSettings, color: e.target.value })}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          padding: 0,
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="text"
                        value={backgroundSettings.color}
                        onChange={(e) => setBackgroundSettings({ ...backgroundSettings, color: e.target.value })}
                        style={{
                          flex: 1,
                          backgroundColor: 'var(--surface-2)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius)',
                          padding: '6px 8px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
