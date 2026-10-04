import { responsiveImageFromRef } from '../services/boardData';

interface BoardImageProps {
  assetRef?: string;
  alt: string;
  detail?: boolean;
  className: string;
}

export default function BoardImage({ assetRef, alt, detail = false, className }: BoardImageProps) {
  const image = responsiveImageFromRef(assetRef, detail);
  if (!image) return null;
  return <img {...image} alt={alt} className={className} loading="lazy" decoding="async" />;
}
