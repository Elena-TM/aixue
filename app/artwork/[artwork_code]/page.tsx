"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Artwork {
  id: number;
  artwork_code: string;
  title: string;
  subject: string;
  year: number;
  medium: string;
  width_cm: number;
  height_cm: number;
  price: number;
  archived: boolean;
  destination: string | null;
  image: string;
  print_available: boolean;
}

export default function ArtworkPage() {
  const params = useParams();
  const artworkCode = params.artwork_code as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadArtwork() {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("artwork_code", artworkCode)
        .single();

      if (error || !data) {
        console.error("Error loading artwork:", error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArtwork(data);
      setLoading(false);
    }

    if (artworkCode) {
      loadArtwork();
    }
  }, [artworkCode]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-60">
        <p className="text-sm text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (notFound || !artwork) {
    return (
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-60">
        <h1 className="text-3xl">Artwork not found</h1>

        <Link
          href="/"
          className="mt-6 inline-block text-sm underline"
        >
          Back to gallery
        </Link>
      </main>
    );
  }

  const imageUrl = supabase.storage
    .from("artworks")
    .getPublicUrl(artwork.image).data.publicUrl;

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-26">
      <Link
        href="/"
        className="mb-10 inline-block text-sm text-neutral-500 hover:text-black"
      >
        ← Back to gallery
      </Link>

      <div className="mt-1 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex justify-center lg:justify-end">
          <img
            src={imageUrl}
            alt={artwork.title}
            className="max-h-[65vh] w-auto max-w-full object-contain shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
          />
        </div>

        <div className="flex flex-col justify-center">
          
          <h1 className="text-4xl font-normal">
            {artwork.title}
          </h1>

          <div className="mt-8 space-y-2 text-neutral-600">
            <p>{artwork.year}</p>

            <p>{artwork.medium}</p>

            <p>
              {artwork.width_cm} × {artwork.height_cm} cm
            </p>
          </div>

          <div className="mt-10">
            {artwork.archived ? (
              <>
                <p className="text-lg text-red-700">
                  Archive
                </p>

                {artwork.destination && (
                  <p className="mt-2 text-sm text-neutral-500">
                    {artwork.destination}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-2xl">
                  CHF {artwork.price}
                </p>

                <p className="mt-2 text-sm text-green-700">
                  Original available
                </p>
              </>
            )}
          </div>

          {artwork.print_available && (
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <p className="text-sm">
                Fine art print available
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}