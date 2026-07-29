import StatusFilter from "@/components/gallery/StatusFilter";
import SubjectFilter from "@/components/gallery/SubjectFilter";
import Gallery from "@/components/gallery/Gallery";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="pt-30">
      <StatusFilter />
      <SubjectFilter />
      <Gallery />
      <About />
      <Contact />
    </main>
  );
}