"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ArtworkCard from "./ArtworkCard";
import StatusFilter from "./StatusFilter";
import SubjectFilter from "./SubjectFilter";
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

type Status = "all" | "available" | "archive";

export default function Gallery() {
  const galleryRef = useRef<HTMLElement>(null);

  const [cardHeight, setCardHeight] = useState(500);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const [status, setStatus] = useState<Status>("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    async function loadArtworks() {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading artworks:", error);
        return;
      }

      setArtworks(data ?? []);
    }

    loadArtworks();
  }, []);

  useEffect(() => {
    function updateHeight() {
      if (!galleryRef.current) return;

      const galleryTop = galleryRef.current.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - galleryTop - 140;

      setCardHeight(availableHeight);
    }

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const subjects = Array.from(
    new Set(
      artworks
        .map((artwork) => artwork.subject)
        .filter((subject) => subject && subject.trim() !== "")
    )
  );

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesStatus =
      status === "all" ||
      (status === "available" && !artwork.archived) ||
      (status === "archive" && artwork.archived);

    const matchesSubject =
      selectedSubject === "all" ||
      artwork.subject === selectedSubject;

    return matchesStatus && matchesSubject;
  });

  return (
    <>
      <StatusFilter
        status={status}
        onChange={setStatus}
      />

      <SubjectFilter
        subjects={subjects}
        selectedSubject={selectedSubject}
        onChange={setSelectedSubject}
      />

      <section
        ref={galleryRef}
        className="mx-auto max-w-7xl px-6 py-12"
      >
        <div
          className="grid justify-center gap-x-10 gap-y-16"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, max-content))",
          }}
        >
          {filteredArtworks.map((artwork) => {
            const imageUrl = supabase.storage
              .from("artworks")
              .getPublicUrl(artwork.image).data.publicUrl;

            return (
                <Link
    key={artwork.id}
    href={`/artwork/${artwork.artwork_code}`}
    className="block"
  >
    <ArtworkCard
      title={artwork.title}
      image={imageUrl}
      price={artwork.price}
      archived={artwork.archived}
      destination={artwork.destination ?? undefined}
      cardHeight={cardHeight}
      printAvailable={artwork.print_available}
    />
  </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}