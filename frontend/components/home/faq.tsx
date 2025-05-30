import Image from "next/image";
import { plusJakarta } from "@/app/fonts";

export default function Faq() {
  return (
    <div className={`max-w-[1920px] mt-[3rem] md:mt-[6rem] py-[2rem] px-[1rem] sm:px-[2.5rem] md:px-[4rem] lg:px-[7rem] ${plusJakarta.className}`}>
      <div className="flex flex-col lg:flex-row gap-[1.5rem] md:gap-[2.5rem]">
        {/* Left Section */}
        <div className="flex lg:flex-row flex-col gap-[0.5rem] lg:w-1/2 sm:flex">
          {/* Main Image */}
          <div className="rounded-xl flex-1 flex flex-col justify-between sm:flex hidden md:hidden lg:block">
            <Image
              src="/home/stack1.png"
              alt="Main Visual"
              width={37.5 * 16}
              height={21.25 * 16}
              className="w-full h-[12.5rem] sm:h-[15.625rem] md:h-[21.25rem] object-cover rounded-2xl shadow-md"
            />
            <div className="flex items-start gap-[1rem] mt-[1rem]">
              <div className="w-[2rem] h-[2rem] md:w-[2.5rem] md:h-[2.5rem] rounded-full bg-[#824800]"></div>
              <div>
                <h2 className="text-[0.875rem] md:text-[1rem] font-semibold text-gray-800">Student Adda</h2>
                <p className="text-[0.75rem] text-gray-600">Your all-in-one study companion</p>
              </div>
            </div>
          </div>

          {/* Two stacked images */}
          <div className="flex flex-col justify-between gap-[1rem] flex-1 mt-[1rem] lg:mt-0 sm:flex hidden md:hidden lg:block">
            <Image
              src="/home/stack2.png"
              alt="Visual 1"
              width={37.5 * 16}
              height={7.5 * 16}
              className="w-full h-[5rem] sm:h-[6.25rem] md:h-[7.5rem] object-cover rounded-2xl shadow-md mb-[0.5rem]"
            />
            <Image
              src="/home/stack3.png"
              alt="Visual 2"
              width={37.5 * 16}
              height={17.5 * 16}
              className="w-full h-[11.25rem] sm:h-[13.75rem] md:h-[17.5rem] object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 flex flex-col gap-[1rem] md:gap-[1.5rem] mt-[1.5rem] lg:mt-0">
          {/* ASK QUESTION Section */}
          <div className="flex items-center gap-[0.25rem]">
            <h2 className="text-[1rem] md:text-[1.125rem] font-semibold text-gray-800">ASK QUESTION</h2>
            <Image
              src="/home/stack3.png"
              alt="FAQ Icon"
              width={20}
              height={20}
              className="w-[1rem] h-[1rem] md:w-[1.25rem] md:h-[1.25rem]"
            />
          </div>

          {/* Main Title */}
          <h2 className="text-[1.4375rem] sm:text-[2.33625rem] leading-[2.80375rem] tracking-normal font-bold text-black mb-[0.5rem]">
            FAQ and Help Center
          </h2>

          {/* Accordion */}
          <div className="rounded-xl overflow-hidden">
            <details className="group p-[1rem] md:p-[1.5rem] rounded-lg border border-[#B5B2A1] mb-[0.25rem]">
              <summary className="cursor-pointer text-[0.75rem] md:text-[0.875rem] font-medium text-gray-800 flex justify-between items-center">
                <h3 className="text-[0.625rem] sm:text-[0.84125rem] leading-[1.30813rem] tracking-normal font-semibold text-black">
                  What is the Pomodoro Timer?
                </h3>
                <div className="w-[1.25rem] h-[1.25rem] md:w-[1.5rem] md:h-[1.5rem] rounded-full bg-[#796146] flex items-center justify-center ml-[0.5rem] group-open:rotate-180 transition-transform">
                  <span className="text-[0.5rem] sm:text-[0.75rem] md:text-[1rem] text-white leading-none">&#9650;</span>
                </div>
              </summary>
              <p className="mt-[0.5rem] text-[0.5625rem] sm:text-[0.75rem] text-gray-600 transition-all duration-300">
                A tool to help you study in focused 25-minute intervals followed by short breaks.
              </p>
            </details>

            <details className="group p-[1rem] md:p-[1.5rem] rounded-lg border border-[#B5B2A1] mb-[0.25rem]">
              <summary className="cursor-pointer text-[0.75rem] md:text-[0.875rem] font-medium text-gray-800 flex justify-between items-center">
                <h3 className="text-[0.625rem] sm:text-[0.84125rem] leading-[1.30813rem] tracking-normal font-semibold text-black">
                  How do I borrow or return a physical book?
                </h3>
                <div className="w-[1.25rem] h-[1.25rem] md:w-[1.5rem] md:h-[1.5rem] rounded-full bg-[#796146] flex items-center justify-center ml-[0.5rem] group-open:rotate-180 transition-transform">
                  <span className="text-[0.5rem] sm:text-[0.75rem] md:text-[1rem] text-white leading-none">&#9650;</span>
                </div>
              </summary>
              <p className="mt-[0.5rem] text-[0.5625rem] sm:text-[0.75rem] text-gray-600 transition-all duration-300">
                Visit the library desk with your ID. To return, drop the book in the return box or hand it to the librarian.
              </p>
            </details>

            <details className="group p-[1rem] md:p-[1.5rem] rounded-lg border border-[#B5B2A1] mb-[0.25rem]">
              <summary className="cursor-pointer text-[0.75rem] md:text-[0.875rem] font-medium text-gray-800 flex justify-between items-center">
                <h3 className="text-[0.625rem] sm:text-[0.84125rem] leading-[1.30813rem] tracking-normal font-semibold text-black">
                  How does the Pomodoro timer work?
                </h3>
                <div className="w-[1.25rem] h-[1.25rem] md:w-[1.5rem] md:h-[1.5rem] rounded-full bg-[#796146] flex items-center justify-center ml-[0.5rem] group-open:rotate-180 transition-transform">
                  <span className="text-[0.5rem] sm:text-[0.75rem] md:text-[1rem] text-white leading-none">&#9650;</span>
                </div>
              </summary>
              <p className="mt-[0.5rem] text-[0.5625rem] sm:text-[0.75rem] text-gray-600 transition-all duration-300">
                It breaks your work into intervals (25 mins) separated by short breaks (5 mins) to improve focus.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}