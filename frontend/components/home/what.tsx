import Image from "next/image";

export default function What() {
  return (
    <section className="bg-[#ECE3DA] text-center max-w-[1920px] lg:overflow-x-auto items-center justify-center min-h-fit overflow-x-hidden py-[0.5rem] px-[1rem] sm:px-[2.5rem] md:px-[4rem] lg:px-[7rem]">
      <div className="what px-[0.5rem] sm:px-[1rem] py-[2rem] md:py-[2.5rem] text-center">
        {/* Heading */}
        <h1 className="text-[1.25rem] sm:text-[2.25rem] md:text-[2.56rem] lg:text-[2.81rem] leading-[2.25rem] sm:leading-[2.625rem] md:leading-[3.03rem] tracking-[-0.04em] font-bold text-center text-gray-800 font-['Plus_Jakarta_Sans'] mb-[0.5rem] sm:mb-[1.25rem] md:mb-[1.5rem]">
          What is Student Adda
        </h1>

        <div className="w-[6.125rem] h-[0.3125rem] bg-[#824800] mb-[0.5rem] lg:mb-[0.75rem] mx-auto rounded"></div>

        <div className="flex flex-col-reverse lg:flex-col">

          <div>

          <p className="text-gray-600 mt-[2%] md:mt-[-1%] lg:mt-[0%] text-[0.75rem] leading-[1rem] sm:text-base tracking-[-0.04em] font-normal max-w-[20rem] sm:max-w-[40rem] md:max-w-[48rem] mx-auto mb-[0.25rem] sm:mb-[2.5rem] text-left">
            Student Adda is a smart,{" "}
            <span className="text-[#8B5716]">all-in-one platform</span> designed to transform how students engage with libraries and manage their study life. It brings together seat booking, digital library access, productivity tools, and a peer-driven forum — all under one clean and intuitive interface.
            <br />
            <p className="font-bold mt-[0.75rem]">
              Whether you&apos;re a student looking to focus better, a library owner managing operations, or someone who just wants a productive study space — Student Adda makes it effortless.
            </p>
          </p>
          </div>

          <div className="relative w-full h-[15.625rem] sm:h-[22.5rem] md:h-[27.5rem] lg:h-[29.375rem] xl:h-[43.75rem] 2xl:h-[38.75rem]">
            <Image
              src="/home/managmentDashboard.png"
              alt="Student Adda Illustration"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
