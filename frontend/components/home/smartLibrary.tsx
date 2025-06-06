import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const SmartLibrary = () => {
  return (
    <section className="py-15 bg-[#ECE3DA] w-full">
      <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr_120px] gap-4 max-w-[1440px] mx-auto px-4">
        
        {/* Left Ad Block - Desktop */}
        <div className="hidden xl:flex justify-center items-center">
          <div className="w-20 h-96 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
            <p className="text-blue-500 text-sm rotate-90 whitespace-nowrap">Ads</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto">
          {/* Top Quote */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed font-normal">
              &ldquo;<span className="font-bold">Empowering minds</span> with seamless
              access to knowledge, <span className="italic">collaborative tools</span>, and{" "}
              <span className="font-bold">smarter learning spaces.</span>&rdquo;
            </p>
          </div>

          {/* Heading and subtext */}
          <div className="w-full text-center mt-6 flex flex-col justify-center items-center">
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-black">
              Smart Libraries. Smarter Learning
            </h1>
            <div className="bg-[#796146] h-1 w-16 my-2" />
            <p className="font-normal text-sm md:text-base max-w-2xl leading-relaxed">
              More than just a library platform — Student Adda is a space to grow,
              learn, and connect with those chasing the same goals.
            </p>
          </div>

          {/* Main content layout */}
          <div className="w-full mt-6 flex flex-col lg:flex-row justify-between items-start gap-6">
            
            {/* Left content */}
            <div className="w-full lg:w-[35%] flex flex-col items-start gap-3">
              <h2 className="text-base md:text-lg font-semibold leading-6 text-black">
                Book seats, boost focus,<br />
                and connect with your study community <br />
                <span className="text-[#805000] font-bold">— all in one place.</span>
              </h2>

              <p className="font-light text-xs md:text-sm text-gray-700 leading-relaxed">
                Student Adda brings together everything you need — book a seat at
                nearby libraries, stay productive with built-in tools, and engage in
                meaningful Q&A through our community forums. Study smarter, not
                harder.
              </p>

              <Button className="rounded-full bg-black py-2 px-4 text-white text-xs mt-2">
                <Link href="/dashboard">Start Exploring</Link>
              </Button>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="text-start">
                  <h3 className="font-semibold text-sm">13 Years</h3>
                  <p className="text-xs text-gray-600">Experience</p>
                </div>

                <div className="text-start">
                  <h3 className="font-semibold text-sm">256+</h3>
                  <p className="text-xs text-gray-600">Clients</p>
                </div>

                <div className="text-start">
                  <h3 className="font-semibold text-sm">99.8%</h3>
                  <p className="text-xs text-gray-600">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="w-full lg:w-[60%] flex justify-center items-center">
              <div className="relative w-full max-w-[600px]">
                <Image
                  src={`/home/image.png`}
                  alt="Dashboard Preview"
                  width={900}
                  height={400}
                  className="object-contain w-full h-auto rounded-lg shadow-lg shadow-black/15"
                />
              </div>
            </div>
          </div>

          {/* Mobile Ad Blocks - Below main content */}
          <div className="xl:hidden mt-8 space-y-4">
            <div className="w-full h-16 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
              <p className="text-blue-500 text-sm">Ads</p>
            </div>
            <div className="w-full h-16 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
              <p className="text-blue-500 text-sm">Ads</p>
            </div>
          </div>
        </div>

        {/* Right Ad Block - Desktop */}
        <div className="hidden xl:flex justify-center items-center">
          <div className="w-20 h-96 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
            <p className="text-blue-500 text-sm rotate-90 whitespace-nowrap">Ads</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SmartLibrary;