import React from "react";

import Image from "next/image";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { plusJakarta } from "@/app/fonts";

export default function SmartLibrary(){
  return (
   <div className={`max-w-[1920px] px-[0.34rem] sm:px-[1rem] md:px-[3rem] flex mt-[0.75rem] py-[2.5rem] ${plusJakarta.className}`}>

      <div className="bg-white hidden xl:block w-[10%] min-h-screen">
        Ads
      </div>

      <div className="middle w-full  xl:w-[80%]">

          {/* Top Quote */}
        <div className="text-center max-w-4xl mx-auto mb-[1.5rem] px-[1rem]">
          <p className="text-lg md:text-2xl font-extralight text-black">
            <span className="font-medium">"Empowering minds </span> with seamless access to knowledge,
            <span className="font-medium">collaborative tools, and smarter learning spaces.</span> "
          </p>


      </div>


    

      {/* Heading and subtext */}
        <div className="text-center max-w-4xl mx-auto mb-[3rem] px-[0.5rem] sm:px-[1rem]">
          <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-[1rem]">
            Smart Libraries. Smarter Learning
          </h2>
          <div className="bg-[#796146] h-[0.5rem] w-[7rem] text-center mx-auto mb-[1rem]"></div>
          <p className="text-xs sm:text-base lg:text-lg text-[#7E7E7E]">
            More than just a library platform — <span className="font-semibold">Student Adda</span> is a space to grow,
            learn, and connect with those chasing the same goals.
          </p>
        </div>


     {/* Main content layout */}
        <div className="flex  flex-col-reverse lg:flex-row items-center gap-[2.5rem] lg:gap-[5rem] max-w-7xl mx-auto ">

          {/* Left content */}
          <div className=" w-full px-2 xl:px-6 xl:w-[40%] "> {/* Overall padding here only */}
            <h3 className="text-[1.2rem] sm:text-[1.5rem] font-semibold text-gray-900 mb-[1rem]">
              Book seats, boost focus, and connect with your study community — all in one place.
            </h3>
            <p className="text-gray-600 text-xs sm:text-base mb-0 sm:mb-[1.5rem]">
              Student Adda brings together everything you need — book a seat at nearby libraries, stay productive with built-in tools,
              and engage in meaningful Q&A through our community forums. Study smarter, not harder.
            </p>

               <div className="flex justify-between items-center  gap-[0.025rem] sm:gap-[2rem]">
              <Link href="/explore">
                <Button className="bg-black text-xs text-white hover:bg-gray-900 transition">
                  Start Exploring
                </Button>
              </Link>



         {/* Stats - always in one row, stack in xl only */}
              <div className="flex flex-row justify-between  gap-[1rem] sm:gap-[1.5rem] mt-[2.5rem] w-full">
                <div className="text-center flex-1">
                  <h4 className="text-[1rem] md:text-[1.50rem] font-bold text-black">13</h4>
                  <p className="text-gray-700 text-xs">Years Experience</p>
                </div>

                <div className="text-center flex-1">
                  <h4 className="text-[1rem] md:text-[1.50rem] font-bold text-black">256+</h4>
                  <p className="text-gray-700 text-xs">Clients</p>
                </div>

                 <div className="text-center flex-1">
                  <h4 className="text-[1rem] md:text-[1.50rem] font-bold text-black">99.8%</h4>
                  <p className="text-gray-700 text-xs">Satisfaction</p>
                </div>
              </div>

              </div>

          
        </div>
  {/* Right image */}
          <div className="flex-1">
            <Image
              src="/home/Dashboard.png"
              alt="Smart Library"
              width={600}
              height={400}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>

     <div className="bg-white hidden xl:block w-[10%] min-h-screen">
        Ads
      </div>

    </div>
  );
};
