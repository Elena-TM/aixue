import Gallery from "@/components/gallery/Gallery";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="pt-30">
      <Gallery />
      <About />
      <Contact />
    </main>
  );
}