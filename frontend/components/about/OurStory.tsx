import React from "react";
import Image from "next/image";

const OurStory = () => {
  return (
    <div className="bg-[#EFEAE5] w-full rounded-lg shadow-md font-jakarta p-4 mb-8">
      {/* Top Section: Heading + Subheading */}
      <div className="flex flex-col md:flex-row justify-between items-start px-3 py-3">
        <div>
          <p className="font-jakarta text-custom tracking-tightest leading-tight font-medium text-gray-800 sm:text-2xl">
            Our Story
          </p>
          <div className="w-[30.23px] h-[2.73px] bg-[#C76E4E] mt-2"></div>
        </div>

        <p className="mt-4 md:mt-[4%] font-jakarta text-[6.42px] leading-[7.2px] sm:leading-[12px] tracking-[0.05px] sm:text-[10px] lg:text-[18px] lg:leading-[20px] lg:tracking-[0.05px] mr-[5%]">
          How Student Adda was <br /> born out of a real need.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row w-full h-auto gap-4 px-3">
        {/* Left Section: Images */}
        <div className="relative w-full md:w-1/2 h-[150px] md:h-[400px] items-center">
          {/* Stacked Images */}
          <div className="relative h-full flex items-center mx-auto justify-center w-1/2">
            <Image
              src="/curve.png"
              width={60}
              height={60}
              alt="curve"
              className="absolute left-[2%] top-[1%] sm:top-[3%] z-30 mx-auto"
            />

            <div className="absolute top-[15%] items-center left-[0%] sm:left-[15%] lg:left-[5%] w-[99px] h-[115px] sm:w-[120px] sm:h-[150px] md:w-[150px] md:h-[189px] z-10 lg:w-[230px] lg:h-[230px] -rotate-4">
              <Image
                src="/img1.png"
                alt="image1"
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div className="absolute top-[5%] sm:top-[3%] md:top-[5%] lg:top-[2%] left-[30%] sm:left-[30%] lg:left-[50%] items-center w-[79.19px] h-[113.5px] sm:w-[130px] sm:h-[150px] md:w-[150px] md:h-[185px] lg:w-[210px] lg:h-[230px] z-0 rotate-6">
              <Image
                src="/img2.png"
                alt="image2"
                fill
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Story Text */}
        <div className="w-full md:w-1/2 h-full p-2 md:p-3 text-gray-800 text-sm md:text-base leading-relaxed">
          <Image
            src="/quote.png"
            width={100}
            height={100}
            alt="quote"
            className="mb-4 w-[38px] h-[29px] md:w-[95px] md:h-[75px]"
          />
          <p className="text-[9.75px] leading-[10.8px] tracking-[0.06px] sm:text-[15px] sm:leading-[16px]">
            Student Adda began with a simple idea — to make studying smarter,
            easier, and more connected. As students, we often struggled to
            find peaceful places to study, reliable tools to stay productive,
            and a supportive community to ask questions. That&apos;s when the
            vision took shape: What if libraries could become more than just
            physical spaces? What if they could offer digital tools, seamless
            seat booking, and a vibrant learner network — all from one
            platform?
            <br />
            <br />
            Built by students, for students, Student Adda is our answer to
            this gap. Today, we&apos;re creating a space where learners can
            thrive — whether they&apos;re reserving a seat at their favorite
            library, tracking their goals, or connecting with peers through
            our forums. And this is just the beginning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
