import { urbanist } from "@/app/fonts";

export default function AboutUs(){
    return (

                 <div className={`mb-10 md:mb-20 ${urbanist.className}`}>
                            <div className="about_us text-center">
                                <h1 className="font-semibold text-[2.8125rem] py-2 leading-[3.375rem] md:text-[3.0625rem] md:leading-[3.6375rem] tracking-[0.0231rem]">
                                About Us.
                                </h1>
                                <div className="line h-[0.428rem] hidden md:block w-[4.75rem]  lg:h-[0.428rem] bg-[#796146] mx-auto my-1"></div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-4 lg:gap-[5rem] px-[1rem] mt-[1.5rem] w-full">
                                {/* Left Side Text */}
                                <div className="md:w-1/2 lg:w-1/3 xl:w-1/4 w-full text-[1.9375rem] leading-[2.4rem] md:text-[2rem] md:leading-[2.3rem]">
                                <p className="font-extralight">
                                    <span className="font-medium text-[#824800]">We are the best library you can get into</span> — a space where knowledge meets inspiration, and curiosity turns into discovery.
                                </p>
                                </div>

                                {/* Right Side Text */}
                                <div className="md:w-[65%] w-full text-[0.8125rem] leading-[1.275rem] tracking-[0.0156rem] md:text-[0.75rem] lg::text-[0.8094rem] md:leading-[0.9rem] lg:leading-[1.25rem] font-medium md:p-[1rem]">
                                <p>
                                    Our mission goes beyond simply storing books; we are a dynamic space where ideas are born, connections are made, and learning never stops.
                                    Whether you&apos;re a student, researcher, avid reader, or simply someone curious about the world, our library is built to empower you with the tools, resources, and environment you need to thrive.

                                    Our collection spans across genres, disciplines, and formats — from classic literature to cutting-edge research, from printed volumes to digital archives, and from timeless philosophy to trending technologies.
                                    We believe that access to knowledge should be as vast as curiosity itself. That&apos;s why we constantly update and expand our resources, ensuring that our community always has access to the most relevant, diverse, and high-quality content available.
                                    <br />  <br />
                                    But we are more than our books. We are a space designed to nurture every kind of learner and thinker. Our library features modern, thoughtfully planned zones — quiet study areas for deep focus, collaborative corners for group work, digital labs for exploring new media, and cozy reading nooks that invite reflection and imagination.
                                    With free Wi-Fi, multimedia systems, and access to online journals and databases, we blend the charm of a traditional library with the power of modern technology.
                                </p>
                                </div>
                            </div>
                            </div>

    )
}