
import SmartLibrary from "@/components/home/smartLibrary";
import Hero from "@/components/home/hero";
import What from "@/components/home/what";
import Ready from "@/components/home/readyToJoin";
import Why from "@/components/home/why";
import Faq from "@/components/home/faq";
import Features from "@/components/home/features";

export default function App() {
  return (
    <>
      <main className="text-black bg-[#ECE3DA] min-h-screen max-w-[1920px] mx-auto xl:mx-0">
        
          <Hero />
           {/* adv1 */}
          <div className="min-h-[10rem] w-[80%] mx-auto flex justify-center items-center bg-white">
            adv
          </div>

          <SmartLibrary />
           <div className="min-h-[6rem] mb-3 xl:hidden w-[80%] mx-auto flex justify-center items-center bg-white">
            adv
          </div>
          <div className="min-h-[6rem] xl:hidden w-[80%] mx-auto flex justify-center items-center bg-white">
            adv
          </div>
          <Why/>

           {/* adv2 */}
          <div className="min-h-[10rem] mb-2 w-[50%] mx-auto flex justify-center items-center bg-white">
            adv
          </div>


          <What />


             {/* adv3*/}
          <div className="min-h-[10rem] w-[80%] mx-auto flex justify-center items-center bg-white">
            adv
          </div>

{/* 1 image to be update */}
          <Features/>
          <div className="min-h-[7rem] mt-4 w-[80%] mx-auto flex justify-center items-center bg-white">
            adv
          </div>


          <Faq/>
          <Ready />
      </main>

    </>
  );
}