import Image from "next/image";

export default function What() {
  return (
    <section className="bg-[#ede3db] text-center max-w-[1140px] lg:overflow-x-auto items-center justify-center overflow-x-hidden py-4 px-4 md:px-14 mx-auto">
      <div className="px-2 sm:px-4 py-6 md:py-10 text-center">
        {/* Heading */}
        <div>
          <h1 className="text-[24px] sm:text-[36px] md:text-[41px] lg:text-[45px] leading-[28px] sm:leading-[42px] md:leading-[48.55px] tracking-[-0.04em] font-bold text-center text-gray-800 font-['Plus_Jakarta_Sans'] mb-4 sm:mb-5 md:mb-6">
          What is Student Adda ?
        </h1>

        <div className="w-[98px] h-[5px] bg-[#824800] mb-6 lg:mb-3 mx-auto rounded"></div>

        <div className="flex flex-col lg:flex-col gap-6">
          <div className="relative w-full h-[200px] sm:h-[360px] md:h-[440px] lg:h-[470px] xl:h-[700px] 2xl:h-[620px] order-1 lg:order-2">
            <Image
              src="/home/managmentDashboard.png"
              alt="Student Adda Illustration"
              fill
              className="object-cover rounded-t-xl"
            />
            {/* Fade out overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#ede3db] to-transparent pointer-events-none"></div>
          </div>

          <p className="text-gray-600 text-[14px] leading-[20px] sm:text-base tracking-[-0.04em] font-normal max-w-xs sm:max-w-lg md:max-w-3xl mx-auto text-left order-2 lg:order-1">
            Student Adda is a smart,{" "}
            <span className="text-[#8B5716]">all-in-one platform</span> designed to transform how students engage with libraries and manage their study life. It brings together seat booking, digital library access, productivity tools, and a peer-driven forum — all under one clean and intuitive interface.
            <br />
            <span className="font-bold mt-3 block">
              Whether you&apos;re a student looking to focus better, a library owner managing operations, or someone who just wants a productive study space — Student Adda makes it effortless.
            </span>
            
            
          </p>
        </div>
        
          
        </div>
        <div className="w-full bg-blue-100 h-20  mt-18 flex items-center justify-center rounded-lg">
          <p className="text-blue-500">Advertisement Space</p>
        </div>
      </div>

    </section>
  );
}
