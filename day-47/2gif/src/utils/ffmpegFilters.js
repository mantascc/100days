/**
 * FFmpeg filter generation utilities for video-to-GIF conversion
 */

/**
 * Builds a 3-part filter for: Normal → Zoomed → Zoom Out
 */
export const buildThreePartFilter = (
  trimRange,
  zoomStartTime,
  zoomEndTime,
  cropRect,
  fps,
  safeWidth,
  safeHeight,
  colors,
  dither,
  bgSettings,
  maskFile
) => {
  const parts = [
    `[0:v]split=3[v_start][v_zoom][v_end]`,
    `[v_start]trim=start=${trimRange[0]}:end=${zoomStartTime},setpts=PTS-STARTPTS,fps=${fps},scale=${safeWidth}:${safeHeight}:flags=lanczos[part1]`,
    `[v_zoom]trim=start=${zoomStartTime}:end=${zoomEndTime},setpts=PTS-STARTPTS,fps=${fps},crop=${cropRect.width}:${cropRect.height}:${cropRect.x}:${cropRect.y},scale=${safeWidth}:${safeHeight}:flags=lanczos[part2]`,
    `[v_end]trim=start=${zoomEndTime}:end=${trimRange[1]},setpts=PTS-STARTPTS,fps=${fps},scale=${safeWidth}:${safeHeight}:flags=lanczos[part3]`,
    `[part1][part2][part3]concat=n=3:v=1:a=0[concatenated]`
  ]

  let lastStream = '[concatenated]'

  if (maskFile && bgSettings) {
    // 1. Masking
    // Scale mask to match video EXACTLY to avoid sizing errors
    parts.push(`[1:v]scale=${safeWidth}:${safeHeight}[mask_scaled]`)
    parts.push(`${lastStream}[mask_scaled]alphamerge[masked]`)
    lastStream = '[masked]'

    // 2. Padding
    // width=iw*(1+padding)
    const padW = `iw*(1+${bgSettings.padding})`
    const padH = `ih*(1+${bgSettings.padding})`
    const x = '(ow-iw)/2'
    const y = '(oh-ih)/2'
    parts.push(`${lastStream}pad=width=${padW}:height=${padH}:x=${x}:y=${y}:color=${bgSettings.color}[padded]`)
    lastStream = '[padded]'
  }

  parts.push(`${lastStream}split[s0][s1]`)
  parts.push(`[s0]palettegen=max_colors=${colors}[p]`)
  parts.push(`[s1][p]paletteuse=dither=bayer:bayer_scale=${dither}`)

  return parts.join(';')
}

/**
 * Builds a 2-part filter for: Normal → Zoomed (stays zoomed)
 */
export const buildTwoPartFilter = (
  trimRange,
  zoomStartTime,
  cropRect,
  fps,
  safeWidth,
  safeHeight,
  colors,
  dither,
  bgSettings,
  maskFile
) => {
  const parts = [
    `[0:v]split=2[v_start][v_zoom]`,
    `[v_start]trim=start=${trimRange[0]}:end=${zoomStartTime},setpts=PTS-STARTPTS,fps=${fps},scale=${safeWidth}:${safeHeight}:flags=lanczos[part1]`,
    `[v_zoom]trim=start=${zoomStartTime}:end=${trimRange[1]},setpts=PTS-STARTPTS,fps=${fps},crop=${cropRect.width}:${cropRect.height}:${cropRect.x}:${cropRect.y},scale=${safeWidth}:${safeHeight}:flags=lanczos[part2]`,
    `[part1][part2]concat=n=2:v=1:a=0[concatenated]`
  ]

  let lastStream = '[concatenated]'

  if (maskFile && bgSettings) {
    // 1. Masking
    parts.push(`[1:v]scale=${safeWidth}:${safeHeight}[mask_scaled]`)
    parts.push(`${lastStream}[mask_scaled]alphamerge[masked]`)
    lastStream = '[masked]'

    // 2. Padding
    const padW = `iw*(1+${bgSettings.padding})`
    const padH = `ih*(1+${bgSettings.padding})`
    const x = '(ow-iw)/2'
    const y = '(oh-ih)/2'
    parts.push(`${lastStream}pad=width=${padW}:height=${padH}:x=${x}:y=${y}:color=${bgSettings.color}[padded]`)
    lastStream = '[padded]'
  }

  parts.push(`${lastStream}split[s0][s1]`)
  parts.push(`[s0]palettegen=max_colors=${colors}[p]`)
  parts.push(`[s1][p]paletteuse=dither=bayer:bayer_scale=${dither}`)

  return parts.join(';')
}

/**
 * Builds a simple trim+scale filter (no zoom/crop)
 */
export const buildSimpleFilter = (trimRange, fps, width, colors, dither, bgSettings, maskFile) => {
  let filter = `trim=start=${trimRange[0]}:end=${trimRange[1]},setpts=PTS-STARTPTS,fps=${fps},scale=${width}:-1:flags=lanczos`

  // Note: For simple filter, we don't have safeWidth/safeHeight passed in easily same way, 
  // but we can assume 'width' is the target. Height is auto.
  // However, mask requires exact match.
  // Let's rely on filter chaining.
  // The 'scale=${width}:-1' might result in odd height.
  // We should enforce evenness if we are masking.

  // Actually, to align with complex filters, we might want to force scale to specific dims?
  // But here we only simply modified 'filter'.
  // If we have mask, we need filter complex string logic.

  if (maskFile && bgSettings) {
    // We need to return a full filter_complex string now, not just a simple filter chain
    // But App.jsx passes this to -vf? 
    // WAIT. App.jsx calls -vf for simple filter. -vf CANNOT take multiple inputs easily for alphamerge if we treat it as simple chain.
    // We must change App.jsx to use -filter_complex (or -lavfi) if we are masking.
    // OR rewrite buildSimpleFilter to return a complex filter string and update App.jsx to ALWAYS use -filter_complex.

    // Let's assume we will update App.jsx to use filter_complex for both cases OR we make this return just the chain interacting with [0:v].
    // But alphamerge needs [1:v].

    // Let's update App.jsx to use filter_complex for simple filter too?
    // OR we constructing the string here assuming it will be used in complex filter.
    // App.jsx: 
    // await ffmpeg.exec(['-i', 'input.mp4', '-vf', filter, ...]) 
    // VS 
    // await ffmpeg.exec(['-i', 'input.mp4', '-filter_complex', filterComplex, ...])

    // I need to change App.jsx to use filter_complex for simple case if masking is enabled.
    // The implementation plan missed this detail for simple filter.
    // I will update this function to return a COMPLEX filter string, and I will strictly need to double check App.jsx.

    // Let's look at App.jsx again. 
    // logic: 
    // if (zoom...) { ... -filter_complex ... } 
    // else { const filter = buildSimpleFilter(...); await ffmpeg.exec([..., '-vf', filter, ...]) }

    // I MUST update App.jsx to use filter_complex for simple case if I want to support masks there.
    // For now, I will write the complex filter string here.

    const parts = []
    parts.push(`[0:v]trim=start=${trimRange[0]}:end=${trimRange[1]},setpts=PTS-STARTPTS,fps=${fps},scale=${width}:-2:flags=lanczos[scaled]`)

    // Masking
    // We need to ensure mask is same size.
    parts.push(`[1:v]scale=${width}:-2[mask_scaled]`) // Use same scale logic
    parts.push(`[scaled][mask_scaled]alphamerge[masked]`)

    // Padding
    const padW = `iw*(1+${bgSettings.padding})`
    const padH = `ih*(1+${bgSettings.padding})`
    const x = '(ow-iw)/2'
    const y = '(oh-ih)/2'
    parts.push(`[masked]pad=width=${padW}:height=${padH}:x=${x}:y=${y}:color=${bgSettings.color}[padded]`)

    parts.push(`[padded]split[s0][s1]`)
    parts.push(`[s0]palettegen=max_colors=${colors}[p]`)
    parts.push(`[s1][p]paletteuse=dither=bayer:bayer_scale=${dither}`)

    return parts.join(';')
  }

  return `trim=start=${trimRange[0]}:end=${trimRange[1]},setpts=PTS-STARTPTS,fps=${fps},scale=${width}:-2:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${colors}[p];[s1][p]paletteuse=dither=bayer:bayer_scale=${dither}`
}
