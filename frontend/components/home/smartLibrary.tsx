import React from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const SmartLibrary = () => {
  return (
    <section className=" max-w-[1920px] lg:overflow-x-auto  bg-[#ECE3DA] lg:min-h-[50vh] flex flex-col justify-center items-center px-6 md:px-10 lg:px-20 py-12">
      {/* Top Quote */}
      <div className="text-center max-w-3xl">
       <p className="text-base md:text-lg lg:text-2xl leading-relaxed">
            &ldquo;<span className="font-bold">Empowering minds</span> with seamless
            access to knowledge, <span className="italic">collaborative tools</span>, and{" "}
            <span className="font-bold">smarter learning spaces.</span>&rdquo;
        </p>

      </div>

      {/* Heading and subtext */}
      <div className="w-full text-center mt-10 flex flex-col justify-center items-center">
        <h1 className="font-semibold text-xl md:text-2xl">
          Smart Libraries. Smarter Learning
        </h1>
        <div className="bg-black h-1 w-10 my-2" />
        <p className="font-light text-sm max-w-md">
          More than just a library platform — Student Adda is a space to grow,
          learn, and connect with those chasing the same goals.
        </p>
      </div>

      {/* Main content layout */}
      <div className="w-full mt-10 flex flex-col lg:flex-row justify-center items-center gap-10">
        
        {/* Left content */}
        <div className="w-full lg:w-[40%] flex flex-col items-start gap-6">
          <p className="text-lg font-semibold leading-6">
            Book seats, boost focus,<br />
            and connect with your study community <br />
            <span className="text-[#805000] font-bold">— all in one place.</span>
          </p>

          <p className="font-light text-sm">
            Student Adda brings together everything you need — book a seat at
            nearby libraries, stay productive with built-in tools, and engage in
            meaningful Q&A through our community forums. Study smarter, not
            harder.
          </p>

          <Button className="rounded-full bg-slate-950 py-4 px-6 text-white">
            <Link href="/dashboard">Start Exploring</Link>
          </Button>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="text-start">
              <h1 className="font-semibold text-lg">13 Years</h1>
              <p className="text-xs">Experience</p>
            </div>

            <div className="text-start">
              <h1 className="font-semibold text-lg">256+</h1>
              <p className="text-xs">Clients</p>
            </div>

            <div className="text-start">
              <h1 className="font-semibold text-lg">99.8%</h1>
              <p className="text-xs">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="w-full lg:w-[50%] flex justify-center items-center">
          <Image
            src={`/home/image.png`}
            alt="Dashboard Preview"
            width={1020}
            height={400}
            className="object-contain w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default SmartLibrary;