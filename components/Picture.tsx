import React from 'react';

interface PictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const toWebpSrcSet = (src: string) =>
  src.replace(/\.(jpe?g|png)$/i, '.webp')
    .replace(/ /g, '%20')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');

const Picture: React.FC<PictureProps> = ({ src, alt, ...imgProps }) => {
  const srcSet = toWebpSrcSet(src);
  const hasWebp = /\.(jpe?g|png)$/i.test(src);
  return (
    <picture style={{ display: 'block', width: '100%', height: '100%' }}>
      {hasWebp && <source type="image/webp" srcSet={srcSet} />}
      <img src={src} alt={alt} {...imgProps} />
    </picture>
  );
};

export default Picture;
