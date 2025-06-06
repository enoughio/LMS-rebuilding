import SmartLibrary from "@/components/home/smartLibrary";
import Hero from "@/components/home/hero";
import What from "@/components/home/what";
import Ready from "@/components/home/readyToJoin";
import WhyAdda from '@/components/home/whyadda';
import Explore from "@/components/home/explore";
import Faq from "@/components/home/faq";

export default function App() {
  return (

      <main className="max-w-[1920px] mx-auto">
        <Hero />
        <SmartLibrary />
        <WhyAdda />
        <What />
        <Explore />
        <Faq />
        <Ready />
      </main>
  );
}