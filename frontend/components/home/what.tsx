import Image from "next/image";

export default function What() {
  return (
    <section className="bg-[#ECE3DA] text-center max-w-[1920px] lg:overflow-x-auto items-center justify-center min-h-screen overflow-x-hidden py-2 px-2 md:px-14">
      <div className="what px-2 sm:px-4 py-8 md:py-10 text-center">
        {/* Heading */}
        <h1 className="text-[20px] sm:text-[36px] md:text-[41px] lg:text-[45px] leading-[36px] sm:leading-[42px] md:leading-[48.55px] tracking-[-0.04em] font-bold text-center text-gray-800 font-['Plus_Jakarta_Sans'] mb-2 sm:mb-5 md:mb-6">
          What is Student Adda
        </h1>

        <div className="w-[98px] h-[5px] bg-[#824800] mb-2 lg:mb-3 mx-auto rounded"></div>

        <div className="flex flex-col-reverse lg:flex-col">
          <p className="text-gray-600 mt-[-10%] lg:mt-[0%] text-[12px] leading-[16px] sm:text-base tracking-[-0.04em] font-normal max-w-xs sm:max-w-lg md:max-w-3xl mx-auto mb-1 sm:mb-10 text-left">
            Student Adda is a smart,{" "}
            <span className="text-[#8B5716]">all-in-one platform</span> designed to transform how students engage with libraries and manage their study life. It brings together seat booking, digital library access, productivity tools, and a peer-driven forum — all under one clean and intuitive interface.
            <br />
            <span className="font-bold mt-3 block">
              Whether you&apos;re a student looking to focus better, a library owner managing operations, or someone who just wants a productive study space — Student Adda makes it effortless.
            </span>
          </p>

          <div className="relative w-full h-[250px] sm:h-[360px] md:h-[440px] lg:h-[470px] xl:h-[700px] 2xl:h-[620px]">
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
