import React from "react";
import Image from "next/image";
import EqualSizedBoxes from "@/components/story1";

const StudentAddaDrives = () => {
  return (
    <section className="font-jakarta mt-8">
      <div className="bg-[#EFEAE5] mx-auto px-4 max-w-[1000px] py-12">
        <div className="container mx-auto px-4 max-w-[1030px]">
          <div className="what flex items-center justify-center gap-2 mb-6">
            <Image src="/story1.png" width={30} height={20} alt="story1" />
            <p className="text-[4.94px] leading-[4.9px] tracking-[0.49px]  md:text-[10.54px] md:leading-[10.5px] font-semibold md:tracking-wide text-center">
              WHAT DRIVES STUDENT ADDA
            </p>
            <Image src="/story2.png" width={30} height={20} alt="story2" />
          </div>

          <div className="text-center mb-5 md:mb-12 text-[17.66px] md:text-[22.3px] md:leading-[26.8px] leading-[21px] ">
            <p className=" md:text-4xl font-bold">Driven by purpose.</p>
            <p className="md:text-4xl font-bold">Powered by passion.</p>
          </div>

          <EqualSizedBoxes />
        </div>
      </div>
    </section>
  );
};

export default StudentAddaDrives;
