import Image from "next/image"
import { plusJakarta } from "@/app/fonts"

export default function Why() {
  return (
    <div
      className={`why py-[0.5rem] ${plusJakarta.className} min-h-[12.5rem] mt-[0.75rem] md:mt-[2.5rem] md:py-[0.5rem] px-[1rem] sm:px-[2.5rem] md:px-[4rem] lg:px-[4rem] max-w-[1920px]`}
    >
      {/* Title Section */}
      <h1 className="text-[1.25rem] sm:text-[1.875rem] lg:text-[2.5625rem] leading-[130%] tracking-[-0.02em] font-bold text-center text-gray-800 mb-[1rem] sm:mb-[1.25rem] md:mb-[1.5rem]">
        Why StudentAdda?
      </h1>

      {/* Line */}
      <div className="w-[5.625rem] sm:w-[7.0625rem] h-[0.375rem] bg-[#824800] mx-auto mb-[2rem] rounded-[0.87625rem]"></div>

      <div className="w-full px-[0.5rem] sm:px-[1rem] h-full md:px-[0.5rem] flex flex-col md:flex-row items-stretch">
        {/* Left Advertisement */}
        <div className="hidden lg:block bg-white w-1/12 py-[1rem] h-[5rem] lg:flex items-center justify-center">
          ads
        </div>

        {/* Middle Content */}
        <div className="py-[1rem] md:py-[1.25rem] px-[1rem] sm:px-[1.5rem] md:px-[3rem] lg:px-[4rem] w-full flex items-center justify-center">
          <div className="w-full max-w-7xl h-[25rem] sm:h-[28.125rem] md:h-[31.25rem] lg:h-[37.5rem] relative">
            <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-9 grid-rows-6 sm:grid-rows-7 md:grid-rows-9 gap-[0.5rem] sm:gap-[0.75rem] md:gap-[1rem] h-full w-full">
              {/* Image 1 */}
              <div className="col-span-2 sm:col-span-3 md:col-span-3 row-span-3 sm:row-span-4 md:row-span-6 relative">
                <div className="h-full w-full relative rounded-md overflow-hidden">
                  <Image
                    src="/home/whybooking.png"
                    alt="Gallery image"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Image 2 */}
              <div className="col-span-2 sm:col-span-3 md:col-span-6 col-start-1 sm:col-start-4 md:col-start-4 row-span-1 sm:row-span-2 md:row-span-3 relative">
                <div className="h-full w-full relative rounded-md overflow-hidden">
                  <Image
                    src="/home/whyhabit.png"
                    alt="Gallery image"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 66vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Image 3 */}
              <div className="col-span-1 sm:col-span-3 md:col-span-3 col-start-1 sm:col-start-4 md:col-start-4 row-span-1 sm:row-span-2 md:row-span-3 row-start-4 sm:row-start-3 md:row-start-4 relative">
                <div className="h-full w-full relative rounded-md overflow-hidden">
                  <Image
                    src="/home/whytools.png"
                    alt="Gallery image"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Image 4 */}
              <div className="col-span-1 sm:col-span-3 md:col-span-3 col-start-2 sm:col-start-4 md:col-start-7 row-span-1 sm:row-span-2 md:row-span-3 row-start-4 sm:row-start-5 md:row-start-4 relative">
                <div className="h-full w-full relative rounded-md overflow-hidden">
                  <Image
                    src="/home/whycommunity.png"
                    alt="Gallery image"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Advertisement */}
        <div className="hidden lg:block bg-white w-1/12 py-[1rem] h-[5rem] lg:flex items-center justify-center">
          ads
        </div>
      </div>
    </div>
  );
}