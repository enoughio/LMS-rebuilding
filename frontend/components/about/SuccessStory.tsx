import React from "react";
import Image from "next/image";

const SuccessStory = () => {
  return (
    <div className="relative">
      {/* Vector background */}
      <div className="absolute inset-0 w-full h-full z-0 flex justify-center items-center overflow-hidden">
        <Image
          src="/about/Vector.svg"
          alt="Background pattern"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      <section className="bg-[#796146] grid grid-cols-1 md:grid-cols-2 w-full md:w-[80%] rounded-md items-center justify-center font-[Plus Jakarta Sans] mx-auto mt-[-20px] relative z-10">
        <div className="left_part p-4">
          <div className="story flex items-center gap-2">
            <p className="text-white font-semibold text-[7.15px] leading-[7.2px] tracking-[0.72px] sm:text-[8.56px] sm:leading-[8.6px]">
              SUCCESS STORY
            </p>
            <Image
              src="/story2.png"
              alt="story2"
              width={16}
              height={16}
              className="text-white"
            />
          </div>

          <div className="text-white text-[25.55px] leading-[30.7px] sm:text-[30.58px] sm:leading-[36.7px] lg:text-[34px] lg:leading-[40px] mt-4">
            <p className=" bold">Experiencing</p>
            <p className=" bold">Traditions and</p>
            <p className=" bold">Customs</p>

            <p className="mt-4 text-[9.18px] leading-[15.3px] lg:text-[11px] lg:leading-[18px] ">
              Lorem Ipsum is simply dummy text the printing and typese Lorem
              Ipsum has been the industry&apos;s standardever
            </p>
          </div>
        </div>

        <div className="right_part grid grid-cols-2 sm:grid-cols-2 rounded-md gap-6 p-4">
          <div className="border border-white flex items-center p-3">
            <div className="w-10 h-10 bg-white rounded-full mr-3 flex justify-center items-center">
              <Image
                src="/member.png"
                alt="SUPER_ADMIN"
                width={24}
                height={24}
              />
            </div>
            <div className="features text-white">
              <p className="font-bold text-[17.66px] leading-[21px] mb-3 md:text-[26px] md:leading-[29px] ">
                200+
              </p>
              <p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">
                Team member
              </p>
            </div>
          </div>

          <div className="border border-white flex items-center p-3">
            <div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
              <Image
                src="/award.png"
                alt="SUPER_ADMIN"
                width={24}
                height={24}
              />
            </div>
            <div className="features text-white">
              <p className="font-bold  text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">
                20+
              </p>
              <p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">
                Winning award
              </p>
            </div>
          </div>

          <div className=" border-white flex items-center border-[0.67px] p-3 sm:p-2">
            <div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
              <Image
                src="/project.png"
                alt="SUPER_ADMIN"
                width={24}
                height={24}
              />
            </div>
            <div className="features text-white">
              <p className="font-bold  text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">
                10k+
              </p>
              <p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">
                Complete project
              </p>
            </div>
          </div>

          <div className="border border-white flex items-center p-3">
            <div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
              <Image
                src="/client.png"
                alt="SUPER_ADMIN"
                width={24}
                height={24}
              />
            </div>
            <div className="features text-white">
              <p className="font-bold   text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">
                900+
              </p>
              <p className="text-[6.85px] leading-[10.6px] md:text-[10px] md:leading-[14px]">
                Client review
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuccessStory;
