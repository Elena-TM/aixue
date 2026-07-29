import Image from "next/image";

type ArtworkCardProps = {
  title: string;
  image: string;
  price: number;
  archived: boolean;
  destination: string;
};

export default function ArtworkCard({
  title,
  image,
  price,
  archived,
  destination,
}: ArtworkCardProps) {
  return (
    <article className="mb-10 cursor-pointer">
        <Image
    src={image}
    alt={title}
    width={900}
    height={1200}
    loading="eager"
    className="w-full h-auto"
    />

      <div className="mt-4">
        <h2 className="text-lg font-light">{title}</h2>

        {archived ? (
          <p className="mt-1 text-sm text-neutral-500">
            Sold to {destination}
          </p>
        ) : (
          <p className="mt-1 text-sm text-emerald-700">
            CHF {price}
          </p>
        )}
      </div>
    </article>
  );
}