import React from 'react';
import Image from 'next/image';

const WhyAdda = () => {
  return (
    <section className="py-16 bg-gradient-to-b bg-[#ECE3DA]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why StudentAdda ?
          </h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full"></div>
        </div>

        {/* Images Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto justify-center">
          
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
          <div >
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
            <div className="flex flex-col sm:flex-row gap-8">
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
      </div>
    </section>
  );
};

export default WhyAdda;