export interface Artwork {
  id: string;
  title: string;
  subject: string;
  image: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number;
  archived: boolean;
  destination?: string;
}

export const artworks: Artwork[] = [
  {
    id: "Landscape001",
    title: "Landscape No. 1",
    subject: "Landscape",
    image: "/images/artworks/Landscape001.jpg",
    year: 2025,
    price: 350,
    archived: false,
  },

  {
    id: "Bamboo001",
    title: "Bamboo No. 1",
    subject: "Bamboo",
    image: "/images/artworks/Bamboo001.jpg",
    year: 2025,
    price: 350,
    archived: false,
  },

  {
    id: "Bamboo002",
    title: "Bamboo No. 2",
    subject: "Bamboo",
    image: "/images/artworks/Bamboo002.jpg",
    year: 2025,
    price: 350,
    archived: false,
  },

  {
    id: "Bamboo003",
    title: "Bamboo No. 3",
    subject: "Bamboo",
    image: "/images/artworks/Bamboo003.jpg",
    year: 2025,
    price: 350,
    archived: false,
  },

  {
    id: "Bamboo004",
    title: "Bamboo No. 4",
    subject: "Bamboo",
    image: "/images/artworks/Bamboo004.jpg",
    year: 2025,
    price: 350,
    archived: false,
  },

  {
    id: "Bamboo005",
    title: "Bamboo No. 5",
    subject: "Bamboo",
    image: "/images/artworks/Bamboo005.jpg",
    year: 2025,
    price: 350,
    archived: false,
  },

  {
    id: "Orchid012",
    title: "Orchid No. 12",
    subject: "Orchid",
    image: "/images/artworks/Orchid012.jpg",
    year: 2026,
    price: 350,
    archived: false,
  },
];