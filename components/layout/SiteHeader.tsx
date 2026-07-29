import Image from "next/image";
export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-4">

        <div className="relative w-[72px] h-[72px] flex-shrink-0">
  <Image
    src="/images/seal.png"
    alt="Ai Xue seal"
    fill
    priority
    className="object-contain"
  />
</div>

        <div>
          <h1 className="font-serif text-4xl leading-none">
            Ai Xue
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-neutral-500">
            Contemporary Chinese Ink Artist
          </p>
        </div>

      </div>
    </header>
  );
}