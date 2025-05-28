
import SmartLibrary from "@/components/home/smartLibrary";
import Hero from "@/components/home/hero";
import What from "@/components/home/what";
import Ready from "@/components/home/readyToJoin";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function App() {
  return (
    <>
      <main className="bg-black">
        <Navbar/>
          <Hero />
          <What />
          <SmartLibrary />
          <Ready />
          <Footer/>
      </main>

    </>
  );
}