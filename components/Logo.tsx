import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <Image
      src="/images/gxpore-logo.svg"
      alt="GXPORE"
      width={160}
      height={41}
      priority={priority}
      className={`h-8 w-auto sm:h-9 ${className}`}
    />
  );
}
