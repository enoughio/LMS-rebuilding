import { urbanist } from "@/app/fonts";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="py-8 bg-[#ECE3DA] w-full mx-auto mt-15 relative lg:max-h-[90vh] lg:flex lg:flex-col lg:justify-between">
      <div className="mx-auto px-3 max-w-[1000px] lg:flex lg:flex-col lg:h-full">
        {/* Desktop Hero - Only show on large screens */}
        <div className="hidden lg:block bg-[#EFEAE5] rounded-[20px] mb-6 overflow-visible relative">
          <div className="flex items-center p-8">
            <div className="max-w-[50%] flex flex-col gap-3 z-10">
              <div>
                <h1 className={`text-4xl font-light text-[#796146]`}>
                  <span className="font-bold">Smart</span> Library
                  <div className="mt-[-5px]">Management,</div>
                  <div className="font-bold mt-[-5px]">All in One Place</div>
                </h1>
              </div>
              <p className="text-base text-gray-700">
                Manage books, seat bookings, members, and digital libraries
              </p>
              <div className="mt-3">
                <Button className="rounded-full bg-slate-950 px-6 py-5">
                  <Link
                    href="/register"
                    className="flex items-center text-white"
                  >
                    Get started <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="absolute right-[-120px] xl:right-[-50px] top-1/3 transform -translate-y-[45%]">
              <Image
                src="/home/hero/hero.png"
                priority
                alt="hero"
                width={450}
                height={350}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Hero - Show on small and medium screens */}
        <div className="block lg:hidden bg-[#EFEAE5] rounded-[16px] p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-1 pr-2">
              <h1
                className={`${urbanist.className} text-base leading-tight mb-2`}
              >
                <span className="font-bold text-[#796146]">Smart</span> Library{" "}
                Management,{" "}
                <span className="font-bold text-[#796146]">
                  All in One Place
                </span>
              </h1>
              <p className="text-xs mb-2 text-gray-700">
                Manage books, seat bookings, members, and digital libraries
              </p>
              <Button className="rounded-full bg-black text-white px-3 py-1 text-xs flex items-center">
                <Link href="/register" className="flex items-center">
                  Get started <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </Button>
            </div>
            <div className="w-[40%]">
              <Image
                src="/home/hero/hero.png"
                priority
                alt="hero"
                width={150}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards - Desktop - Only show on large screens */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 pt-3 pb-4">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-transparent border border-[#ef8b00] rounded-lg p-6 flex flex-col"
            >
              <div className="mb-4">
                <div className="w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center">
                  <Image
                    alt={card.title}
                    src={card.icon}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <h2 className="font-semibold text-[#824800] mb-3">
                {card.title}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Cards - Mobile/Tablet - Show on small and medium screens */}
        <div className="lg:hidden grid grid-cols-1 gap-4 pt-3 pb-4">
          {/* Top row with two cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Smart Library Access */}
            <div className="bg-transparent border border-[#ef8b00] rounded-xl p-4">
              <div className="mb-2">
                <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center">
                  <Image
                    alt={featureCards[0].title}
                    src={featureCards[0].icon}
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <h2 className="font-semibold text-[#824800] text-sm mb-1">
                {featureCards[0].title}
              </h2>
              <p className="text-xs text-gray-700 leading-tight">
                {featureCards[0].desc}
              </p>
            </div>

            {/* Engaging Community Features */}
            <div className="bg-transparent border border-[#ef8b00] rounded-xl p-4">
              <div className="mb-2">
                <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center">
                  <Image
                    alt={featureCards[2].title}
                    src={featureCards[2].icon}
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <h2 className="font-semibold text-[#824800] text-sm mb-1">
                {featureCards[2].title}
              </h2>
              <p className="text-xs text-gray-700 leading-tight">
                {featureCards[2].desc}
              </p>
            </div>
          </div>

          {/* Bottom row with one wider card */}
          <div className="bg-transparent border border-[#ef8b00] rounded-xl p-4">
            <div className="mb-2">
              <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center">
                <Image
                  alt={featureCards[1].title}
                  src={featureCards[1].icon}
                  width={16}
                  height={16}
                />
              </div>
            </div>
            <h2 className="font-semibold text-[#824800] text-sm mb-1">
              {featureCards[1].title}
            </h2>
            <p className="text-xs text-gray-700 leading-tight">
              {featureCards[1].desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature card data
const featureCards = [
  {
    icon: "/home/hero/smart_lib.svg",
    title: "Smart Library Access",
    desc: "Search & book seats in libraries. Access physical and digital books. Flexible membership plans.",
  },
  {
    icon: "/home/hero/clockIcon.png",
    title: "Built-in Study Tools",
    desc: "Pomodoro timer, habit tracker, streak logs. Daily progress tracking and productivity boosters.",
  },
  {
    icon: "/home/hero/message.svg",
    title: "Engaging Community Features",
    desc: "Public forum for Q&A and discussions. Create or join study groups. Share knowledge and get support.",
  },
];

export default Hero;
