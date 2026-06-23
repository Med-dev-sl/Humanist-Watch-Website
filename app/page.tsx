import HeroCarousel from "@/app/components/hero-carousel";
import WhoWeAreSection from "@/app/components/who-we-are-section";
import ProgramsSection from "@/app/components/programs-section";
import EventsSection from "@/app/components/events-section";
import BlogSection from "@/app/components/blog-section";
import SlideIn from "@/app/components/slide-in";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <SlideIn>
        <WhoWeAreSection />
      </SlideIn>
      <SlideIn direction="left">
        <ProgramsSection />
      </SlideIn>
      <BlogSection />
      <EventsSection />
    </>
  );
}
