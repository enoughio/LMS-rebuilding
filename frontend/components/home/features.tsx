import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { urbanist } from "@/app/fonts";
import { plusJakarta } from "@/app/fonts";

const features = [
    {
        icon: "/home/feature1.png",
        heading: "Pomodoro Timer",
        description: "There are many variati of passages of engineer's available. have suffered"
    },
    {
        icon: "/home/feature2.png",
        heading: "Daily Planner",
        description: "Create daily tasks & goals Drag-and-drop reordering"
    },
    {
        icon: "/home/feature3.png",
        heading: "Time Tracker",
        description: "Session logging by subject/task Analytics for weekly/monthly study time Visual stats to stay accountable"
    },
    {
        icon: "/home/feature4.png",
        heading: "Streak Overview",
        description: "Visual streak charts (weekly/monthly) rewards-based motivation Don't break the chain"
    },
    {
        icon: "/home/feature5.png",
        heading: "Focus Music",
        description: "Lo-fi beats, nature sounds, café ambience Playlists optimized for focus Timer-based playback"
    },
];

const gridPositions = [
    "col-span-2 row-span-2 col-start-3",
    "col-span-2 row-span-2 col-start-5",
    "col-span-2 row-span-2 col-start-1 row-start-3",
    "col-span-2 row-span-2 col-start-3 row-start-3",
    "col-span-2 row-span-2 col-start-5 row-start-3",
];

interface FeatureCardProps {
    icon: string;
    heading: string;
    description: string;
}

const FeatureCard = ({ icon, heading, description }: FeatureCardProps) => {
    return (
    <div className={`bg-white p-[0.75rem] sm:p-[1rem] md:p-[1.5rem] rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100 hover:-translate-y-1 transform min-h-[4.5rem] ${plusJakarta.className}`}>
  <div className="flex flex-row xl:flex-col items-center lg:items-start">
    {/* Icon and Heading */}
    <div className="flex items-center xl:flex-col lg:items-start w-1/3 lg:w-full mb-0 lg:mb-[0.5rem] gap-1 sm:gap-3">
      <div className="w-[2rem] h-[2rem] md:w-[2.5rem] md:h-[2.5rem] border-2 border-[#E3DBD8] rounded-full flex items-center justify-center mb-0 lg:mb-[1rem]">
        <Image
          src={icon}
          width={100}
          height={100}
          alt={`${heading} Icon`}
          className="w-[0.5rem] h-[0.5rem] sm:w-[0.75rem] sm:h-[0.75rem] md:w-[1rem] md:h-[1rem] object-contain"
        />
      </div>
      <h1 className="text-[0.6rem] sm:text-[0.875rem] md:text-[1rem] lg:text-[1.25rem] font-semibold text-[#3D3D3D] ml-[0.75rem] lg:ml-0 lg:mt-[0.5rem] lg:mb-[0.5rem]">
        {heading}
      </h1>
    </div>

    {/* Description and Learn More */}
    <div className="flex flex-col justify-between lg:justify-start items-center lg:items-start w-2/3 lg:w-full">
      <p className="text-[0.5rem] sm:text-[0.75rem] md:text-[0.875rem] leading-tight tracking-normal font-normal text-[#727272] lg:mb-[0.75rem] mx-[0.5rem] lg:mx-0 max-w-[90%] lg:max-w-full text-left lg:text-left">
        {description}
      </p>

      {/* Learn More Button */}
      <div className="hidden lg:flex flex-row items-center gap-1 mt-auto cursor-pointer text-[#3D3D3D] text-[0.75rem] md:text-[0.875rem] font-medium">
        Learn More
        <ArrowRight size={12} className="text-black" />
      </div>
    </div>
  </div>
</div>

  );
};

export default function Features() {
  return (
    <div className={`max-w-[1920px] ${urbanist.className} md:w-[90%] lg:w-[90%] xl:w-[80%] mx-auto flex flex-col justify-center items-center px-[1rem] sm:px-[2.5rem] md:px-[4rem]  lg:px-[1rem] xl:px-[1rem]`}>
      <div className="py-[2rem] md:py-[3rem] lg:py-[4rem] px-[1rem] md:px-[1.5rem] mb-[3rem] bg-[#EFEAE5] mt-[1.5rem] text-black rounded-xl w-full">
        <div className={`lg:w-[40%] lg:text-left ${urbanist.className}`}>
          <h2 className="text-[1.5rem] md:text-[1.875rem] lg:text-[2.25rem] font-bold text-gray-800 leading-snug mb-[1rem] font-urbanist">
            Explore Our <br />
            <span className="text-[#824800] text-left">Standout Features</span>
          </h2>
          <div className="w-[8rem] h-[0.5rem] bg-[#824800] mb-[1.5rem] rounded"></div>
        </div>

        {/* Mobile & Tablet layout (flex-col) */}
        <div className="flex flex-col   gap-[1rem] xl:hidden">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              heading={feature.heading}
              description={feature.description}
            />
          ))}
        </div>

        {/* Desktop layout (grid) */}
        <div className="hidden xl:grid grid-cols-6 grid-rows-4 gap-[1rem]">
          {features.map((feature, index) => (
            <div key={index} className={gridPositions[index]}>
              <FeatureCard
                icon={feature.icon}
                heading={feature.heading}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>

    {/* ready to start */}

<div
  className={`w-[95%] ${plusJakarta.className} mx-auto mt-[-3rem] sm:mt-[-2rem] md:mt-[-4rem] lg:mt-[-5rem] bg-[#796146] py-[1rem] md:py-[1.25rem] lg:py-0 flex flex-col lg:flex-row items-center justify-between text-white px-[1rem] sm:px-[1.25rem] rounded-2xl lg:h-[15rem]`}
>
  {/* Image Section */}
  <div className="w-[60%] sm:w-[35%] lg:w-[30%] flex justify-center mb-[0.75rem] lg:mb-0">
    <Image
      src="/home/book.png"
      width={200}
      height={200}
      className="object-contain h-auto max-h-[6rem] sm:max-h-[7rem] md:max-h-[8rem] mt-[-3rem] lg:mt-0 lg:max-h-[13rem]"
      alt="Banner"
    />
  </div>

  {/* Content Section */}
  <div className="w-full lg:w-[65%] text-center lg:text-left mb-[0.75rem] lg:mb-0">
    <h1 className="font-bold text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] lg:text-[2.25rem] leading-snug">
      Are you ready to start?
    </h1>

    <div className="mt-[0.25rem] space-y-[0.2rem]">
      <p className="text-[0.7rem] sm:text-[0.75rem] md:text-[0.8rem] lg:text-[0.75rem] text-center lg:text-left">
        Custom Software Development Tailored Solutions for Your Business
      </p>
      <p className="text-[0.7rem] sm:text-[0.75rem] md:text-[0.8rem] lg:text-[0.75rem] leading-relaxed text-center lg:text-left">
        Custom Software Development Tailored Solutions
      </p>
    </div>

    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start mt-[0.75rem] gap-[0.5rem] font-['Plus_Jakarta_Sans']">
      <input
        type="text"
        placeholder="Enter Email"
        className="w-full sm:w-auto px-[0.75rem] py-[0.4rem] rounded-md border border-gray-300 text-[0.8rem] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button className="w-full sm:w-auto px-[1rem] py-[0.4rem] text-[0.8rem] rounded-md bg-white text-green-900 border border-green-900 hover:bg-green-100 transition duration-200">
        Contact Us
      </button>
    </div>
  </div>
</div>

    </div>
  );
}