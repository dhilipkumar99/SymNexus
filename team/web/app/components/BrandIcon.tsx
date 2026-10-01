import Image from 'next/image';

// The SymNexus lattice mark (the symnexus.co favicon).
export function BrandIcon({ size, className = '' }: { size: number; className?: string }) {
  return (
    <Image src="/brand/symnexus-icon.png" alt="SymNexus" width={size} height={size} className={className} priority unoptimized />
  );
}
