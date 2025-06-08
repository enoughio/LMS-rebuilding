import SmartLibrary from "@/components/home/smartLibrary";
import Hero from "@/components/home/hero";
import What from "@/components/home/what";
import Ready from "@/components/home/readyToJoin";
import WhyAdda from '@/components/home/whyadda';
import Explore from "@/components/home/explore";
import Faq from "@/components/home/faq";
import Advertisement from "@/components/home/Advertisement";

export default function App() {
  return (

      <main className="sm:max-w-[100vw] xl:max-w-[1920px] mx-auto">
        <Hero />
        <Advertisement />
        <SmartLibrary />
        <WhyAdda />
        <What />
        <Explore />
        <Faq />
        <Ready />
      </main>
  );
}