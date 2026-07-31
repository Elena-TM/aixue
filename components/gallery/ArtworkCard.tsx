import Image from "next/image";

type ArtworkCardProps = {
  title: string;
  image: string;
  price: number;
  archived: boolean;
  destination?: string;
  cardHeight: number;
  printAvailable: boolean;
};

export default function ArtworkCard({
  title,
  image,
  price,
  archived,
  destination,
  cardHeight,
  printAvailable,
}: ArtworkCardProps) {
  return (
    <article className="mb-10 cursor-pointer text-center">
      <div className="flex justify-center">
        <Image
          src={image}
          alt={title}
          width={900}
          height={1200}
          loading="eager"
          style={{
            height: `${cardHeight}px`,
            width: "auto",
          }}
          className="mx-auto shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        />
      </div>

      <div className="mt-5">
        <h2 className="text-xl font-light">{title}</h2>

        {archived ? (
          <>
            {destination && (
              <p className="mt-2 text-sm text-neutral-500">
                Sold to {destination}
              </p>
            )}
          </>
        ) : (
          <p className="mt-2 text-sm text-emerald-700">
            CHF {price}
          </p>
        )}

        {printAvailable && (
          <p className="mt-1 text-sm text-neutral-500">
            Fine art prints available
          </p>
        )}
      </div>
    </article>
  );
}