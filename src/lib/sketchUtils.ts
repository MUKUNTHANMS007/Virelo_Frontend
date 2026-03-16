/**
 * captureToSketch
 * Captures the Three.js WebGL canvas, applies a binarisation (Cinarization)
 * filter, and returns a JSON payload for the ToonCrafter worker.
 *
 * Fix for "TypeError: Failed to execute 'drawImage'":
 *  - Guards on canvas existence and non-zero dimensions before drawing.
 *  - Uses a timeout-wrapped Image.decode() to ensure the PNG is fully
 *    decodable before calling ctx.drawImage().
 *  - Falls back gracefully and returns null rather than throwing.
 */
/**
 * ensureImageLoaded
 * Waits for an image element to be fully decoded and ready for drawImage.
 */
export async function ensureImageLoaded(img: HTMLImageElement): Promise<void> {
  const timeout = 6000;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Image decode timeout')), timeout);
    const done = () => { clearTimeout(timer); resolve(); };
    
    if (img.complete && img.naturalWidth !== 0) {
      done();
      return;
    }

    img.onload = done;
    img.onerror = () => { clearTimeout(timer); reject(new Error('Image decode failed')); };
    
    if (typeof img.decode === 'function') {
      img.decode().then(done).catch((err) => {
        console.warn('[sketchUtils] img.decode() failed, relying on onload:', err);
      });
    }
  });

  if (!img.naturalWidth || !img.naturalHeight) {
    throw new Error('Image natural dimensions are zero.');
  }
}

/**
 * safeDrawImage
 * A hardened wrapper around drawImage that prevents crashes due to zero dimensions,
 * non-decodable sources, or invalid contexts.
 */
export function safeDrawImage(ctx: CanvasRenderingContext2D, source: CanvasImageSource, dx = 0, dy = 0): boolean {
  try {
    // Check dimensions
    let sw = 0, sh = 0;
    if (source instanceof HTMLImageElement) {
      sw = source.naturalWidth;
      sh = source.naturalHeight;
    } else if (source instanceof HTMLVideoElement) {
      sw = source.videoWidth;
      sh = source.videoHeight;
    } else if (typeof VideoFrame !== 'undefined' && source instanceof VideoFrame) {
      sw = (source as any).displayWidth;
      sh = (source as any).displayHeight;
    } else {
      sw = Number((source as any).width || 0);
      sh = Number((source as any).height || 0);
    }

    if (!sw || !sh) return false;

    ctx.drawImage(source, dx, dy);
    return true;
  } catch (err) {
    console.error('[sketchUtils] safeDrawImage failed:', err);
    return false;
  }
}

export async function captureToSketch(): Promise<any> {
  try {
    const canvas = document.querySelector('canvas');
    if (!canvas || canvas.width === 0 || canvas.height === 0) return null;

    let dataUrl: string;
    try {
      dataUrl = canvas.toDataURL('image/png');
    } catch (e) {
      console.warn('[sketchUtils] canvas.toDataURL failed:', e);
      return null;
    }

    if (!dataUrl || dataUrl === 'data:,') return null;

    const img = new Image();
    img.src = dataUrl;
    await ensureImageLoaded(img);

    const offCanvas = document.createElement('canvas');
    offCanvas.width = img.naturalWidth;
    offCanvas.height = img.naturalHeight;
    const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('No 2D context');

    // Use safeDrawImage
    const drawn = safeDrawImage(ctx, img);
    if (!drawn) throw new Error('Failed to draw safely');

    // ── 6. Binarisation / Cinarization filter ────────────────────────────────
    // Sharpened threshold for ToonCrafter matching
    const imageData = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      // High-contrast binary: Black strokes (0) on White background (255)
      const color = avg > 180 ? 255 : 0;
      data[i] = color;
      data[i + 1] = color;
      data[i + 2] = color;
    }
    ctx.putImageData(imageData, 0, 0);

    const lineArtBase64 = offCanvas.toDataURL('image/png');

    return {
      lineArtBase64,
      imageData: lineArtBase64,
      startFrame: { imageData: lineArtBase64 },
      endFrame:   { imageData: lineArtBase64 },
      width:  offCanvas.width,
      height: offCanvas.height,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[sketchUtils] captureToSketch failed:', err);
    return null;
  }
}
