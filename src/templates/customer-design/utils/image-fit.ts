export function loadImageSize(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({
        width: img.naturalWidth || img.width || 200,
        height: img.naturalHeight || img.height || 200,
      });
    img.onerror = () => resolve({ width: 200, height: 200 });
    img.src = url;
  });
}

export function fitImageToCanvas(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight?: number,
) {
  let w = width;
  let h = height;

  if (w > maxWidth) {
    const ratio = h / w;
    w = maxWidth;
    h = Math.round(w * ratio);
  }

  if (maxHeight && h > maxHeight) {
    const ratio = w / h;
    h = maxHeight;
    w = Math.round(h * ratio);
  }

  return { width: Math.max(1, w), height: Math.max(1, h) };
}

export function getImageCoverCrop(
  image: HTMLImageElement,
  boxWidth: number,
  boxHeight: number,
) {
  const imgWidth = image.naturalWidth || image.width;
  const imgHeight = image.naturalHeight || image.height;

  if (!imgWidth || !imgHeight || !boxWidth || !boxHeight) {
    return null;
  }

  const boxRatio = boxWidth / boxHeight;
  const imgRatio = imgWidth / imgHeight;

  if (Math.abs(boxRatio - imgRatio) < 0.001) {
    return null;
  }

  if (imgRatio > boxRatio) {
    const visibleWidth = imgHeight * boxRatio;
    return {
      x: (imgWidth - visibleWidth) / 2,
      y: 0,
      width: visibleWidth,
      height: imgHeight,
    };
  }

  const visibleHeight = imgWidth / boxRatio;
  return {
    x: 0,
    y: (imgHeight - visibleHeight) / 2,
    width: imgWidth,
    height: visibleHeight,
  };
}
