import ArtworkCard from "./ArtworkCard";
import { artworks } from "@/data/artworks";

export default function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="break-inside-avoid mb-16 mx-auto max-w-[400px]">
            <ArtworkCard
              title={artwork.title}
              image={artwork.image}
              price={artwork.price}
              archived={artwork.archived}
              destination={artwork.destination}
            />
          </div>
        ))}
      </div>
    </section>
  );
}