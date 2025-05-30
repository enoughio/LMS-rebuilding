import { urbanist } from "@/app/fonts";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { plusJakarta } from "@/app/fonts";

const Hero = () => {
  return (
    <>
      <div className="max-w-[120rem] lg:overflow-x-auto lg:h-[90vh] px-[1rem] sm:px-[2.5rem] md:px-[4rem] lg:px-[7rem] flex flex-col items-center justify-center gap-[0.75rem] bg-[#ECE3DA]">
        <div
          className="h-[40%] md:h-[53%] w-full bg-[#EFEAE5] gap-[2.5rem] md:gap-[0.75rem] rounded-[2rem] flex items-center justify-between md:mt-[1.25rem] p-[0.5rem] px-[1rem] sm:p-[1.5rem]"
          id="up"
        >
          <div
            id="up-left"
            className="max-w-[40%] h-full flex items-start justify-center flex-col gap-[1rem] md:px-[2.5rem]"
          >
            <div className={`${urbanist.className}`}>
              <h1 className="lg:text-[2.5rem] text-[1.40625rem] leading-[1.538125rem] sm:text-[1.6875rem] sm:leading-[2.4rem] md:leading-[3rem] font-light">
                <span className="font-bold text-[#796146]">Smart</span> Library <br />
                Management,
                <br />
                <span className="font-bold text-[#796146]"> All in One Place</span>
              </h1>
            </div>

            <div className={`text-[0.5rem] sm:text-[0.75rem] md:text-[1rem] ${plusJakarta.className}`}>
              <h4>Manage books, seat bookings, members, and digital libraries</h4>
            </div>

            <div>
              <Button className={`rounded-full bg-slate-950 font-light text-[0.8125rem] ${plusJakarta.className}`}>
                <Link href="/register" className="flex items-center text-white">
                  Get Started <ArrowRight className="ml-[0.5rem]" />
                </Link>
              </Button>
            </div>
          </div>

          <div
            id="up-right"
            className="max-w-[60%] h-full flex items-center justify-center"
          >
            <div className="h-[18.75rem] sm:h-[25rem] md:h-[30rem] w-full max-w-[37.5rem]">
              <Image
                src="/home/hero/hero.png"
                priority
                alt="hero"
                width={600}
                height={500}
                className="object-fill h-[13rem] max-w-[14rem] sm:h-auto sm:max-w-full sm:object-fill"
              />
            </div>
          </div>
        </div>

        <div
          className={`w-full px-[0.5rem] sm:px-[1rem] md:px-[1.5rem] lg:px-[2rem] py-[1rem] ${plusJakarta.className}`}
          id="down"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1rem]">
            {/* Box 1 */}
            <div className="border-2 rounded-[0.5rem] border-[#BF847EBD] p-[0.5rem] sm:p-[1rem] flex flex-col items-start justify-start">
              <div className="flex items-center justify-center w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] bg-slate-950 rounded-full mb-[0.5rem]">
                <Image alt="book icon" src="/home/hero/bookIcon.png" width={20} height={20} />
              </div>
              <h1 className="text-[0.75rem] sm:text-[0.875rem] md:text-[1rem] font-semibold text-[#824800] leading-[1rem] sm:leading-[1.5rem] py-[0.25rem]">
                Smart Library Access
              </h1>
              <p className="text-[0.5rem] sm:text-[0.75rem] md:text-[0.875rem] text-gray-700">
                Search & book seats in your nearby libraries. Access both physical and digital books. Flexible membership plans with online payments.
              </p>
            </div>

            {/* Box 2 */}
            <div className="border-2 rounded-[0.5rem] border-[#BF847EBD] p-[0.5rem] sm:p-[1rem] flex flex-col items-start justify-start">
              <div className="flex items-center justify-center w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] bg-slate-950 rounded-full mb-[0.5rem]">
                <Image alt="clock icon" src="/home/hero/clockIcon.png" width={20} height={20} />
              </div>
              <h1 className="text-[0.75rem] sm:text-[0.875rem] md:text-[1rem] font-semibold text-[#824800] leading-[1rem] sm:leading-[1.5rem] py-[0.25rem]">
                Built-in Study Tools
              </h1>
              <p className="text-[0.5rem] sm:text-[0.75rem] md:text-[0.875rem] text-gray-700">
                Pomodoro timer, habit tracker, streak logs, planner. Daily progress tracking and productivity boosters. Practice quizzes by topic.
              </p>
            </div>

            {/* Box 3 */}
            <div className="border-2 w-full col-span-2 lg:col-span-1 rounded-[0.5rem] border-[#BF847EBD] p-[0.5rem] sm:p-[1rem] flex flex-col items-start justify-start">
              <div className="flex items-center justify-center w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] bg-slate-950 rounded-full mb-[0.5rem]">
                <Image alt="community icon" src="/home/hero/clockIcon.png" width={20} height={20} />
              </div>
              <h1 className="text-[0.75rem] sm:text-[0.875rem] md:text-[1rem] font-semibold text-[#824800] leading-[1rem] sm:leading-[1.5rem] py-[0.25rem]">
                Engaging Community Features
              </h1>
              <p className="text-[0.5rem] sm:text-[0.75rem] md:text-[0.875rem] text-gray-700">
                Public forum for Q&A, discussions & study help. Create or join study groups. Share knowledge, get support, stay motivated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
