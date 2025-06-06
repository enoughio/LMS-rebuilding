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

        <p className="mt-4 md:mt-[4%] font-jakarta text-xs leading-normal sm:text-[10px] sm:leading-[12px] tracking-[0.05px] lg:text-[18px] lg:leading-[20px] lg:tracking-[0.05px] mr-[5%]">
          How Student Adda was <br /> born out of a real need.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row w-full h-auto gap-4 px-3">
        {/* Left Section: Images */}
        <div className="relative w-full md:w-1/2 h-[220px] sm:h-[300px] md:h-[400px]">
          {/* Stacked Images */}
          <div className="relative h-full w-full sm:w-1/2 flex items-center mx-auto justify-center">
            <Image
              src="/curve.png"
              width={60}
              height={60}
              alt="curve"
              className="absolute left-[5%] top-[10%] sm:left-[2%] sm:top-[1%] md:top-[3%] z-30 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px]"
            />

            <div className="absolute left-[5%] top-[20%] sm:top-[15%] sm:left-[0%] md:left-[15%] lg:left-[5%] w-[130px] h-[150px] sm:w-[120px] sm:h-[150px] md:w-[150px] md:h-[189px] z-10 lg:w-[230px] lg:h-[230px] -rotate-4">
              <Image
                src="/img1.png"
                alt="image1"
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div className="absolute right-[5%] top-[20%] sm:top-[5%] sm:left-[30%] md:top-[5%] lg:top-[2%] lg:left-[50%] w-[130px] h-[150px] sm:w-[130px] sm:h-[150px] md:w-[150px] md:h-[185px] lg:w-[210px] lg:h-[230px] z-0 rotate-6">
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
        <div className="w-full md:w-1/2 h-full p-2 md:p-3 text-gray-800">
          <Image
            src="/quote.png"
            width={100}
            height={100}
            alt="quote"
            className="mb-4 w-[38px] h-[29px] md:w-[95px] md:h-[75px]"
          />
          <p className="text-xs leading-5 sm:text-[9.75px] sm:leading-[10.8px] tracking-[0.06px] md:text-[15px] md:leading-[16px]">
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
