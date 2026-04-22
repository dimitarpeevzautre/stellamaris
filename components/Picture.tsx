import React from 'react';

interface PictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const toWebp = (src: string) => src.replace(/\.(jpe?g|png)$/i, '.webp');

const Picture: React.FC<PictureProps> = ({ src, alt, ...imgProps }) => {
  const webp = toWebp(src);
  const hasWebp = webp !== src;
  return (
    <picture style={{ display: 'contents' }}>
      {hasWebp && <source type="image/webp" srcSet={webp} />}
      <img src={src} alt={alt} {...imgProps} />
    </picture>
  );
};

export default Picture;
