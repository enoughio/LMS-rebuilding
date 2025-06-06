import React from 'react';
import Image from 'next/image';

const WhyAdda = () => {
  return (
    <section className="py-16 bg-gradient-to-b bg-[#ECE3DA]">
      <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr_120px] gap-4 max-w-[1440px] mx-auto px-4">
        
        {/* Left Ad Block - Desktop */}
        <div className="hidden xl:flex justify-center items-center">
          <div className="w-20 h-96 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
            <p className="text-blue-500 text-sm rotate-90 whitespace-nowrap">Ads</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why StudentAdda ?
            </h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full"></div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-row gap-8 max-w-7xl mx-auto justify-center">
            
            {/* Left Side - Large Image */}
            <div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl w-80 p-8 h-full shadow-lg flex flex-col justify-between">
                  <div className="flex">
                    <Image
                      src="/home/why/seat_booking.svg"
                      alt="Seat booking interface"
                      width={250}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Three Images */}
            <div>
              <div className="flex-1 flex flex-col gap-6">
                
                {/* Top Image */}
                <div className='bg-white rounded-2xl shadow-lg '>
                  <Image
                    src="/home/why/built_for_real.svg"
                    alt="Community interface"
                    width={400}
                    height={200}
                    className="object-contain w-full h-auto"
                  />
                </div>

                {/* Bottom Row - Two Images */}
                <div className="flex flex-row gap-8">
                  <div className="flex-1 bg-white rounded-2xl shadow-lg">
                    <Image
                      src="/home/why/tools_that_feel.svg"
                      alt="Tools interface"
                      width={300}
                      height={200}
                      className="object-contain w-full h-auto"
                    />
                  </div>
                  
                  <div className="flex-1 bg-white rounded-2xl shadow-lg">
                    <Image
                      src="/home/why/step_community.svg"
                      alt="Study habits interface"
                      width={300}
                      height={200}
                      className="object-contain w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col gap-6 max-w-7xl mx-auto">
            
            {/* First: Top Image */}
            <div className='bg-white rounded-2xl shadow-lg'>
              <Image
                src="/home/why/built_for_real.svg"
                alt="Community interface"
                width={400}
                height={200}
                className="object-contain w-full h-auto"
              />
            </div>

            {/* Second Row: Left image with two right images */}
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Left - Large Image */}
              <div className="sm:w-1/2">
                <div className="bg-white rounded-2xl p-4 shadow-lg h-full">
                  <Image
                    src="/home/why/seat_booking.svg"
                    alt="Seat booking interface"
                    width={250}
                    height={200}
                    className="object-contain w-full h-auto"
                  />
                </div>
              </div>

              {/* Right - Two stacked images */}
              <div className="sm:w-1/2 flex flex-col gap-4">
                <div className="bg-white rounded-2xl shadow-lg">
                  <Image
                    src="/home/why/tools_that_feel.svg"
                    alt="Tools interface"
                    width={300}
                    height={150}
                    className="object-contain w-full h-auto"
                  />
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg">
                  <Image
                    src="/home/why/step_community.svg"
                    alt="Study habits interface"
                    width={300}
                    height={150}
                    className="object-contain w-full h-auto"
                  />
                </div>
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
      <div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center rounded-lg">
        <p className="text-blue-500">Advertisement Space</p>
      </div>
    </section>
  );
};

export default WhyAdda;