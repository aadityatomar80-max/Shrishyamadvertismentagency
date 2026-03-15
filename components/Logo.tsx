import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
        <Image
          src="/logo.jpg"
          alt="Shree Shyam Advertising Agency"
          width={48}
          height={48}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      <div>
        <div className="text-lg font-bold text-primary">
          Shree Shyam
        </div>
        <div className="text-xs text-slate-600">
          Advertising & Marketing Agency – Jaipur
        </div>
      </div>
    </Link>
  );
}
