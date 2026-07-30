"use client";
import { useEffect, useState } from "react";
import ArtworkCard from "./ArtworkCard";
import { artworks } from "@/data/artworks";

export default function Gallery() {
  const [cardHeight, setCardHeight] = useState(500);

useEffect(() => {
  function updateHeight() {
    const header = 180;      // we'll measure later
    const filters = 140;     // we'll measure later
    const margin = 40;

    const available =
      window.innerHeight - header - filters - margin;

    setCardHeight(available);
  }

  updateHeight();

  window.addEventListener("resize", updateHeight);

  return () => window.removeEventListener("resize", updateHeight);
}, []);
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="break-inside-avoid mb-16 mx-auto max-w-[400px]">
            <ArtworkCard
              title={artwork.title}
              image={artwork.image}
              price={artwork.price}
              archived={artwork.archived}
              destination={artwork.destination}
              cardHeight={cardHeight}
            />
          </div>
        ))}
      </div>
    </section>
  );
}