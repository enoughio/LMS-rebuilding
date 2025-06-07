import { urbanist } from "@/app/fonts";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="py-16 bg-[#ECE3DA] w-full max-w-[1000px] mx-auto">
      <div className="mx-auto px-4 max-w-7xl">
        {/* Desktop Hero */}
        <div className="hidden md:block bg-[#EFEAE5] rounded-[32px] mb-8">
          <div className="flex items-center justify-between p-4 md:p-10">
            <div
              id="up-left"
              className="max-w-[40%] h-full flex items-start justify-center flex-col gap-4"
            >
              <div className={`${urbanist.className}`}>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light">
                  <span className="font-bold text-[#796146]">Smart</span> Library{" "}
                  <br />
                  Management,
                  <br />
                  <span className="font-bold text-[#796146]">
                    All in One Place
                  </span>
                </h1>
              </div>

              <div className="text-sm md:text-base">
                <h4>
                  Manage books, seat bookings, members, and digital libraries
                </h4>
              </div>

              <div>
                <Button className="rounded-full bg-slate-950">
                  <Link href={"/register"} className="flex items-center text-white">
                    Get Started <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div
              id="up-right"
              className="max-w-[60%] h-full flex items-center justify-center"
            >
              <div className="h-[320px] sm:h-[400px] md:h-[480px] w-full max-w-[600px]">
                <Image
                  src={"/home/hero/hero.png"}
                  priority
                  alt="hero"
                  width={600}
                  height={500}
                  className="object-fill"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="block md:hidden bg-[#EFEAE5] rounded-[20px] p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-1 pr-4">
              <div className={`${urbanist.className} mb-3`}>
                <h1 className="text-lg sm:text-xl font-light leading-tight">
                  <span className="font-bold text-[#796146]">Smart</span> Library{" "}
                  <br />
                  Management,
                  <br />
                  <span className="font-bold text-[#796146]" style={{color: "#B8956B"}}>
                    All in One Place
                  </span>
                </h1>
              </div>

              <div className="text-xs sm:text-sm mb-4 text-gray-700">
                <p>
                  Manage books, seat bookings, members, and digital libraries
                </p>
              </div>

              <div>
                <Button className="rounded-full bg-black text-white px-4 py-2 text-xs sm:text-sm flex items-center gap-2">
                  <Link href={"/register"} className="flex items-center text-white">
                    Get started <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex-shrink-0 w-[50%]">
              <div className="h-[150px] sm:h-[180px] w-full">
                <Image
                  src={"/home/hero/hero.png"}
                  priority
                  alt="hero"
                  width={250}
                  height={180}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-6 grid-rows-3 md:grid-rows-4 gap-4 pt-7">
          {/* Box 1 */}
          <div className="col-span-1 md:col-span-2 md:row-span-4 border-2 rounded-lg border-[#BF847EBD] p-4 flex flex-col items-start justify-start">
            <div className="flex items-center justify-center w-8 h-8 bg-slate-950 rounded-full">
              <Image
                alt="book icon"
                src={`/home/hero/bookIcon.png`}
                width={20}
                height={20}
              />
            </div>
            <h1 className="text-sm font-semibold text-[#824800] leading-6 py-1">Smart Library Access</h1>
            <p className="text-[14px]">
              Search & book seats in your nearby libraries Access both
              physical and digital books Flexible membership plans with online
              payments
            </p>
          </div>

          {/* Box 2 */}
          <div className="col-span-1 md:col-span-2 md:row-span-4 border-2 rounded-lg border-[#BF847EBD] p-4 flex flex-col items-start justify-start">
            <div className="flex items-center justify-center w-8 h-8 bg-slate-950 rounded-full">
              <Image
                alt="clock icon"
                src={`/home/hero/clockIcon.png`}
                width={20}
                height={20}
              />
            </div>
            <h1 className="text-sm font-semibold leading-6 text-[#824800] py-1">Built-in Study Tools</h1>
            <p className="text-[14px]">
              Pomodoro timer, habit tracker, streak logs, planner Daily
              progress tracking and productivity boosters Practice quizzes by
              topic
            </p>
          </div>

          {/* Box 3 */}
          <div className="col-span-2 md:col-span-2 md:row-span-4 border-2 rounded-lg border-[#BF847EBD] p-4 flex flex-col items-start justify-start">
            <div className="flex items-center justify-center w-8 h-8 bg-slate-950 rounded-full">
              <Image
                alt="community icon"
                src={`/home/hero/clockIcon.png`}
                width={20}
                height={20}
              />
            </div>
            <h1 className="text-sm font-semibold leading-5 py-1 text-[#824800]">
              Engaging Community Features
            </h1>
            <p className="text-[14px]">
              Public forum for Q&A, discussions & study help Create or join
              study groups Share knowledge, get support, stay motivated
            </p>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden grid grid-cols-1 gap-3 pt-4">
          <div className="border-2 rounded-lg border-[#BF847EBD] p-3 flex flex-col items-start justify-start">
            <div className="flex items-center justify-center w-6 h-6 bg-slate-950 rounded-full mb-2">
              <Image
                alt="book icon"
                src={`/home/hero/bookIcon.png`}
                width={12}
                height={12}
              />
            </div>
            <h1 className="text-xs font-semibold text-[#824800] leading-4 mb-1">Smart Library Access</h1>
            <p className="text-xs leading-relaxed">
              Search & book seats in your nearby libraries. Access both physical and digital books.
            </p>
          </div>

          <div className="border-2 rounded-lg border-[#BF847EBD] p-3 flex flex-col items-start justify-start">
            <div className="flex items-center justify-center w-6 h-6 bg-slate-950 rounded-full mb-2">
              <Image
                alt="clock icon"
                src={`/home/hero/clockIcon.png`}
                width={12}
                height={12}
              />
            </div>
            <h1 className="text-xs font-semibold text-[#824800] leading-4 mb-1">Built-in Study Tools</h1>
            <p className="text-xs leading-relaxed">
              Pomodoro timer, habit tracker, streak logs, planner. Daily progress tracking and productivity boosters.
            </p>
          </div>

          <div className="border-2 rounded-lg border-[#BF847EBD] p-3 flex flex-col items-start justify-start">
            <div className="flex items-center justify-center w-6 h-6 bg-slate-950 rounded-full mb-2">
              <Image
                alt="community icon"
                src={`/home/hero/clockIcon.png`}
                width={12}
                height={12}
              />
            </div>
            <h1 className="text-xs font-semibold text-[#824800] leading-4 mb-1">
              Engaging Community Features
            </h1>
            <p className="text-xs leading-relaxed">
              Public forum for Q&A, discussions & study help. Create or join study groups.
            </p>
          </div>
        </div>

        <div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center rounded-lg">
          <p className="text-blue-500">Advertisement Space</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;