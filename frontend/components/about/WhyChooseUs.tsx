import React from 'react';
import Image from 'next/image';

const WhyChooseUs = () => {
  return (
    <section className="bg-[#ECE3DA] font-jakarta mt-12 mb-8 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
        {/* Left part - Images */}
        <div className="lg:w-1/2 relative flex justify-center">
          <Image
            src="/about/five_year.svg"
            alt="Five Year Experience"
            width={400}
            height={500}
            className="w-full max-w-md lg:max-w-lg"
          />
        </div>

        {/* Right part - Content */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/about/why_choose.svg"
              width={24}
              height={24}
              alt="Why choose us icon"
            />
            <p className="text-[#796146] text-xs sm:text-sm font-bold tracking-widest uppercase">
              WHY CHOOSE US
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
              More than just seat booking - your complete
            </h2>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#796146] leading-tight">
              study companion.
            </h2>
          </div>          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-8">
            Student Adda isn&apos;t just a library booking system — it&apos;s a complete
            platform designed to elevate the study experience. From reserving
            seats and accessing a rich digital library to using built-in
            productivity tools like a Pomodoro timer, habit tracker, and
            quizzes, everything you need is in one place.
          </p>

          {/* Features Grid - Stack on mobile */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#796146] rounded-full p-2 sm:p-3">
                  <Image
                    src="/about/browser.svg"
                    width={20}
                    height={20}
                    alt="Platform"
                    className="invert"
                  />
                </div>
                <h3 className="font-semibold text-base sm:text-lg">
                  All-in-One Platform
                </h3>
              </div>

              <div className="ml-8 sm:ml-12 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Image
                    src="/about/tick.svg"
                    width={14}
                    height={14}
                    alt="Check"
                    className="sm:w-4 sm:h-4"
                  />
                  <p className="text-gray-700 text-sm sm:text-base">
                    Book seats, access eBooks
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Image
                    src="/about/tick.svg"
                    width={14}
                    height={14}
                    alt="Check"
                    className="sm:w-4 sm:h-4"
                  />
                  <p className="text-gray-700 text-sm sm:text-base">
                    Use study tools
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#796146] rounded-full p-2 sm:p-3">
                  <Image
                    src="/about/library.svg"
                    width={20}
                    height={20}
                    alt="Library"
                    className="invert"
                  />
                </div>
                <h3 className="font-semibold text-base sm:text-lg">
                  Smart Library Access
                </h3>
              </div>

              <div className="ml-8 sm:ml-12 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Image
                    src="/about/tick.svg"
                    width={14}
                    height={14}
                    alt="Check"
                    className="sm:w-4 sm:h-4"
                  />
                  <p className="text-gray-700 text-sm sm:text-base">
                    Search, filter
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Image
                    src="/about/tick.svg"
                    width={14}
                    height={14}
                    alt="Check"
                    className="sm:w-4 sm:h-4"
                  />
                  <p className="text-gray-700 text-sm sm:text-base">
                    manage your libraries
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section - Stack on mobile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <button className="w-full sm:w-auto bg-transparent border-2 border-[#796146] text-[#796146] px-6 sm:px-8 py-3 rounded-full flex items-center justify-center gap-3 hover:bg-[#796146] hover:text-white transition-all duration-300 font-medium text-sm sm:text-base">
              Read More
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-5 sm:h-5"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
              <div className="bg-[#796146] rounded-full p-2">
                <Image
                  src="/about/call.svg"
                  width={16}
                  height={16}
                  alt="Call"
                  className="invert sm:w-5 sm:h-5"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-500">Need help?</p>
                <p className="font-bold text-base sm:text-lg text-[#796146]">
                  (808) 555-0111
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
