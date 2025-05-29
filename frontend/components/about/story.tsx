import Image from "next/image";
import { plusJakarta } from "@/app/fonts";

export default function Story11() {
    return (
        <div className={`bg-[#EFEAE5] w-full rounded-md shadow-md ${plusJakarta.className} p-[0.5rem] mb-[2rem]`}>
            {/* Top Section: Heading + Subheading */}
            <div className="flex flex-col md:flex-row justify-between items-start px-[0.75rem] py-[0.75rem]">
                <div>
                    <p className="font-jakarta text-custom tracking-tightest leading-tight font-medium text-gray-800 sm:text-[1.5rem]">
                        Our Story
                    </p>
                    <div className="w-[1.89rem] h-[0.17rem] bg-[#C76E4E] mt-[0.5rem]"></div>
                </div>

                <p className="mt-[1rem] md:mt-[4%] font-jakarta text-[0.4rem] leading-[0.45rem] sm:leading-[0.75rem] tracking-[0.0031rem] sm:text-[0.625rem] lg:text-[0.875rem] lg:leading-[1rem] lg:tracking-[0.0031rem] mr-[5%]">
                    How Student Adda was <br /> born out of a real need.
                </p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col sm:flex-row w-full h-auto gap-[0.25rem] md:gap-[1rem] px-[0.75rem]">
                {/* Left Section: Images */}
                <div className="relative w-full md:w-1/2 h-[7.5rem] md:h-[25rem] items-center justify-center">
                    {/* Stacked Images */}
                    <div className="relative h-full flex items-center mx-auto justify-center w-[60%]">
                        <Image
                            src="/curve.png"
                            width={3.75 * 16}
                            height={3.75 * 16}
                            alt="curve"
                            className="absolute left-[2%] top-[-2%] sm:top-[3%] md:top-[15%] z-30 mx-auto"
                        />

                        <div className="absolute top-[15%] items-center left-[0%] md:top-[20%] sm:left-[15%] lg:left-[5%] w-[6.19rem] h-[7.19rem] sm:w-[7.5rem] sm:h-[9.375rem] md:w-[9.375rem] md:h-[11.8125rem] z-10 lg:w-[14.375rem] lg:h-[18.125rem] -rotate-4">
                            <Image
                                src="/img1.png"
                                alt="image1"
                                fill
                                className="rounded-md object-cover"
                            />
                        </div>
                        <div className="absolute top-[5%] sm:top-[3%] md:top-[35%] lg:top-[12%] left-[30%] sm:left-[30%] lg:left-[50%] items-center w-[4.95rem] h-[7.09rem] sm:w-[8.125rem] sm:h-[9.375rem] md:w-[9.375rem] md:h-[11.5625rem] lg:w-[13.125rem] lg:h-[18.125rem] z-0 rotate-6">
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
                <div className="w-full md:w-1/2 h-full p-[0.5rem] md:p-[0.75rem] mt-[0.75rem] lg:mt-[5rem] text-gray-800 text-sm md:text-base leading-relaxed flex flex-col justify-center gap-[0.5rem]">
                    <Image
                        src="/quote.png"
                        width={6.25 * 16}
                        height={6.25 * 16}
                        alt="quote"
                        className="mb-[1rem] w-[2.375rem] h-[1.8125rem] md:w-[5.9375rem] md:h-[4.6875rem]"
                    />
                    <p className="text-[0.61rem] font-medium leading-[0.7rem] tracking-[0.00375rem] sm:text-[0.75rem] p-[0.5rem] lg:p-[1rem] sm:leading-[1rem]">
                        Student Adda began with a simple idea — to make studying smarter,
                        easier, and more connected. As students, we often struggled to find peaceful places to
                        study, reliable tools to stay productive, and a supportive community to ask questions.
                        That&apos;s when the vision took shape: What if libraries could become more than just physical
                        spaces? What if they could offer digital tools, seamless seat booking, and a vibrant
                        learner network — all from one platform?
                        <br /><br />
                        Built by students, for students, Student Adda is our answer to this gap.
                        Today, we&apos;re creating a space where learners can thrive — whether they&apos;re reserving a seat
                        at their favorite library, tracking their goals, or connecting with peers through our
                        forums. And this is just the beginning.
                    </p>
                </div>
            </div>
        </div>
    );
}