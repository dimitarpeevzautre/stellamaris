import React from 'react';
import { fallbackUrl, getImageInfo, webpSrcSet } from '../utils/images';

interface PictureProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Public JPEG URL of an image from assets-src/images, e.g. '/images/arthy.jpg'. */
  src: string;
  alt: string;
  /**
   * How wide the image is rendered, for choosing a WebP variant (the `sizes` attribute).
   * Defaults to the full viewport width; pass something tighter for images in columns.
   */
  sizes?: string;
  /** Classes for the <picture> wrapper (defaults to a block that fills its parent). */
  pictureClassName?: string;
}

/**
 * Responsive image: WebP variants in a srcset with a JPEG fallback, the intrinsic width/height
 * (so the browser reserves the space before the file arrives) and lazy loading by default.
 * For the main above-the-fold image pass loading="eager" and fetchPriority="high".
 */
const Picture: React.FC<PictureProps> = ({
  src,
  alt,
  sizes = '100vw',
  pictureClassName = 'block w-full h-full',
  loading = 'lazy',
  decoding = 'async',
  ...imgProps
}) => {
  const info = getImageInfo(src);
  const srcSet = webpSrcSet(src);
  return (
    <picture className={pictureClassName}>
      {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
      {/* loading/decoding come before src so client-created images are lazy from the start. */}
      <img
        loading={loading}
        decoding={decoding}
        width={info?.width}
        height={info?.height}
        {...imgProps}
        src={fallbackUrl(src)}
        alt={alt}
      />
    </picture>
  );
};

export default Picture;
