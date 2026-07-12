import Image from "next/image";
import { isOptimizableImageUrl } from "@/lib/images/remote";
import { cn } from "@/lib/utils";

type OptimizedImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  fill = false,
  width = 400,
  height = 400,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: OptimizedImageProps) {
  if (!src) return null;

  if (!isOptimizableImageUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", containerClassName)}>
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
