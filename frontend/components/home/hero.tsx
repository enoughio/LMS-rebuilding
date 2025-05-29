import { urbanist } from "@/app/fonts";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <>

      <div className=" max-w-[1920px] lg:overflow-x-auto  lg:min-h-[50vh] px-4 sm:px-10 md:px-16 lg:px-28 flex flex-col items-center justify-center gap-3 bg-[#ECE3DA]">
        <div
          className="md:h-[53%] w-full bg-[#EFEAE5] rounded-[32px] flex items-center justify-between md:mt-5"
          id="up"
        >
          <div
            id="up-left"
            className=" max-w-[40%] h-full flex items-start justify-center flex-col gap-4 md:px-10 "
          >
            <div className={`${urbanist.className}`}>
              <h1 className="lg:text-4xl   font-light">
                <span className="font-bold text-[#796146]">Smart</span> Library{" "}
                <br />
                Management,
                <br />
                <span className="font-bold text-[#796146]">
                  {" "}
                  All in One Place
                </span>
              </h1>
            </div>

            <div className="md:text-base">
              <h4>
                Manage books, seat bookings, members, and digital libraries
              </h4>
            </div>

            <div>
              <Button className="rounded-full bg-slate-950 " >
                <Link href={"/register"} className="flex items-center text-white">
                Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div
            id="up-right"
            className=" max-w-[60%] h-full flex items-center justify-center"
          >
            <div className="h-[320px] sm:h-[400px] md:h-[480px] w-full max-w-[600px]">
              <Image
                src={"/home/hero/hero.png"}
                priority
                alt="hero"
                width={600}
                height={500}
                className="object-fill  "
              />
            </div>
          </div>
        </div>

        <div className="max-h-[30%] w-full px-2" id="down">

          <div className="grid grid-cols-2 md:grid-cols-6 grid-rows-3 md:grid-rows-4 gap-4 h-full w-full">
            {/* Box 1 */}
            <div className="col-span-1 md:col-span-2 md:row-span-4 border-2 rounded-lg border-[#BF847EBD] p-4 flex flex-col items-start justify-start ">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-950 rounded-full">
                <Image
                  alt="an book"
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
            <div className="col-span-1 md:col-span-2 md:row-span-4 border-2 rounded-lg border-[#BF847EBD] p-4 flex flex-col items-start justify-start ">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-950 rounded-full">
                <Image
                  alt="an book"
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
            <div className="col-span-2 md:col-span-2 md:row-span-4 border-2 rounded-lg border-[#BF847EBD] p-4 flex flex-col items-start justify-start ">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-950 rounded-full">
                <Image
                  alt="an book"
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
        </div>
      </div>
    </>
  );
};

export default Hero;