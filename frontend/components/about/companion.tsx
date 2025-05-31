import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { plusJakarta } from "@/app/fonts";

export default function Companion() {
    return (
        <div className="w-full bg-[#ECE3DA]">
            <div className={`section ${plusJakarta.className} p-[1rem] md:p-[1.5rem] flex flex-col md:flex-row lg:flex-row gap-[1.5rem] lg:gap-[2.5rem] max-w-7xl mx-auto`}>
                {/* Left Section */}
                <div className="w-full md:w-3/5 lg:w-2/5 flex flex-row gap-[0.75rem] justify-center">
                    <div className="relative">
                        <Image
                            src="/about/library_image1.png"
                            alt="Main visual"
                            width={160}
                            height={224}
                            className="rounded-md object-cover w-[7rem] h-[10rem] md:w-[9rem] md:h-[16rem] lg:w-[10rem] lg:h-[15rem]"
                        />
                    </div>

                    <div className="img2 flex flex-col gap-[0.75rem]">
                        <div className="box bg-[#796146] text-white p-[0.5rem] lg:p-[0.75rem] rounded-lg shadow-md flex items-center gap-[0.5rem]">
                            <h1 className="text-[2rem] md:text-[2.5rem] font-bold">5</h1>
                            <div className="text text-[0.75rem] lg:text-[0.875rem]">
                                <p>Years of</p>
                                <p>experience</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Image
                                src="/about/library_image2.png"
                                alt="Experience visual"
                                width={176}
                                height={400}
                                className="h-[14rem] wd:w-[11rem] wd:h-[40rem] lg:w-[11rem] lg:h-[22rem] object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="right w-full lg:w-3/5 flex flex-col gap-[1.5rem]">
                    <div className="why flex items-center gap-[0.5rem]">
                        <Image
                            src="/about/cards.png"
                            alt="Why choose us"
                            width={24}
                            height={24}
                        />
                        <p className="text-[0.75rem] lg:text-[0.875rem] text-[#824800] font-semibold">WHY CHOOSE US</p>
                    </div>

                    <h1 className="text-[1.4rem] leading-[1.7rem] md:text-[1.875rem] md:leading-[2rem] lg:text-[2.5rem] lg:leading-[2.8rem] font-bold text-black">
                        More than just seat <br className="hidden sm:block" />
                        booking - your complete <span className="text-[#824800]">study companion.</span>
                    </h1>

                    <div className="lower_div text-[#727272]">
                        <p className="text-[0.7rem] md:text-[0.8rem] md:leading-[1.2rem] lg:text-[1rem] lg:leading-[1.5rem]">
                            Student Adda isn&#39;t just a library booking system — it&#39;s a complete platform designed to elevate the study experience.
                            </p>


                        {/* category1 */}
                        <div className="boxes mt-[1.5rem] grid gap-[1rem] grid-cols-2 sm:grid-cols-2">
                            {/* Box 1 */}
                            <div className="box1 w-full border border-[#E3DBD8] p-[0.5rem] lg:p-[1rem] rounded-xl hover:shadow-md flex flex-col justify-between">
                                <div>
                                    <div className="upper flex items-center gap-[1rem] mb-[1rem]">
                                        <div className="circle rounded-full bg-[#796146] flex items-center justify-center w-[2rem] h-[2rem] sm:w-[3.5rem] sm:h-[3.5rem]">
                                            <Image
                                                src="/about/camera.png"
                                                alt="Icon"
                                                width={24}
                                                height={24}
                                                className="w-[1.25rem] h-[1.25rem] sm:w-[1.5rem] sm:h-[1.5rem]"
                                            />
                                        </div>
                                        <p className="font-semibold text-black text-[0.7rem] sm:text-[1rem]">All-in-One Platform</p>
                                    </div>

                                    <div className="lower space-y-[0.5rem]">
                                        <div className="detail1 flex items-start gap-[0.5rem]">
                                            <Image
                                                src="/about/tick.png"
                                                width={20}
                                                height={20}
                                                alt="tick"
                                                className="mt-[0.25rem] flex-shrink-0"
                                            />
                                            <p className="text-xs md:text-sm">Book seats, access eBook</p>
                                        </div>
                                        <div className="detail1 flex items-start gap-[0.5rem]">
                                            <Image
                                                src="/about/tick.png"
                                                width={20}
                                                height={20}
                                                alt="tick"
                                                className="mt-[0.25rem] flex-shrink-0"
                                            />
                                            <p className="text-xs md:text-sm">Use study tools</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Box 2 */}
                            <div className="box1 w-full border border-[#E3DBD8] p-[1rem] rounded-xl hover:shadow-md flex flex-col justify-between">
                                <div>
                                    <div className="upper flex items-center gap-[1rem] mb-[1rem]">
                                        <div className="circle rounded-full bg-[#796146] flex items-center justify-center w-[2rem] h-[2rem] sm:w-[3.5rem] sm:h-[3.5rem]">
                                            <Image
                                                src="/about/lib.png"
                                                alt="Icon"
                                                width={24}
                                                height={24}
                                                className="w-[1rem] h-[1rem] sm:w-[1.5rem] sm:h-[1.5rem]"
                                            />
                                        </div>
                                        <p className="font-semibold text-black text-[0.7rem] sm:text-[1rem]">Smart Library Access</p>
                                    </div>

                                    <div className="lower space-y-[0.5rem]">
                                        <div className="detail1 flex items-start gap-[0.5rem]">
                                            <Image
                                                src="/about/tick.png"
                                                width={20}
                                                height={20}
                                                alt="tick"
                                                className="mt-[0.25rem] flex-shrink-0"
                                            />
                                            <p className="text-xs md:text-sm">Search, filter</p>
                                        </div>
                                        <div className="detail1 flex items-start gap-[0.5rem]">
                                            <Image
                                                src="/about/tick.png"
                                                width={20}
                                                height={20}
                                                alt="tick"
                                                className="mt-[0.25rem] flex-shrink-0"
                                            />
                                            <p className="text-xs md:text-sm">Manage your libraries</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* category 2 */}
                        <div className="lower_info flex flex-row sm:flex-row items-start sm:items-center gap-[1rem] mt-[1.5rem] lg:mt-[2.5rem]">
                            {/* Read More Button */}
                            <button className="px-[1rem] py-[0.5rem] border border-[#796146] rounded-full text-[0.875rem] font-medium text-black hover:bg-[#f3ece8] transition flex items-center gap-[0.5rem]">
                                Read More <ArrowRight width={16} height={16} />
                            </button>

                            {/* Contact Info */}
                            <div className="flex items-start sm:items-center gap-[0.75rem]">
                                {/* Icon */}
                                <div className="w-[2.5rem] h-[2.5rem] bg-[#796146] rounded-full flex items-center justify-center">
                                    <Image src="/about/call.png" width={16} height={16} alt="call" />
                                </div>

                                {/* Text */}
                                <div className="call text-[0.875rem] text-gray-800">
                                    <p className="font-medium">Need help?</p>
                                    <p className="text-[#4B2E83] font-semibold">(808) 555 - 0111</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}