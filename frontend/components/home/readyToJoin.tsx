import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { plusJakarta } from "@/app/fonts";

export default function Ready() {
  return (
       <div className={`bg-[#ECE3DA] ${plusJakarta.className} max-w-[1920px]  lg:overflow-x-auto overflow-x-hidden max-h-screen px-[0.75rem] py-[2rem] sm:py-[2.5rem] sm:px-[1rem] lg:px-[4rem] xl:px-[6rem] 2xl:px-[8rem]`}>

      <div className="mx-auto text-center mb-[1rem] sm:mb-[2rem]">
        <h2 className="text-[1.02rem] sm:text-[1.75rem] md:text-[2.5rem] lg:text-[2.5rem]  font-bold leading-[1.21rem] md:leading-[3rem] tracking-[-0.04em] text-center mb-[1rem] lg:mb-[1.5rem]">
          Ready to get started?
        </h2>

      <div className="mx-auto w-[2.81rem] sm:w-[3.75rem] md:w-[5rem] lg:w-[6.25rem] xl:w-[7.5rem] h-[0.15rem] sm:h-[0.25rem] bg-[#796146] rounded-[0.35rem]"></div>

      <p className="text-center w-full mx-auto text-[0.5rem] sm:text-[0.875rem] md:text-[1rem] leading-[0.75rem] sm:leading-[1.25rem] md:leading-[1.75rem] tracking-[-0.01rem] font-normal text-gray-700 mb-[2.5rem]">
        The IPFS file storage and sharing with collaboration solution that suits any industry and business size.
      </p>

      <div className="grid grid-cols-2 gap-[1rem] sm:gap-[1.5rem] lg:gap-[2.5rem] max-w-4xl mx-auto">
        {/* Individual Card */}
        <div className="bg-[#E8D5C6] rounded-xl p-[0.75rem] sm:p-[1.5rem] lg:p-[2rem] shadow-md">
          <Image
            src="/indi1.png"
            alt="Individual"
            width={50}
            height={50}
           className="w-[1.5rem] sm:w-[2rem] md:w-[2.5rem] lg:w-[3rem] xl:w-[3.5rem] h-auto"
          />
          <p className="mt-[1rem] text-[0.6rem] sm:text-[0.875rem] md:text-[1.4rem] font-normal leading-[0.625rem] sm:leading-[1rem] tracking-[-0.04em]">
            Are you an individual?
          </p>
         <p className="mt-[0.5rem] sm:mt-[0.75rem] text-gray-600 text-[0.5rem] sm:text-[0.625rem] md:text-[0.875rem]  font-normal leading-[0.7rem] sm:leading-[0.625rem] md:leading-[1.25rem] tracking-[-0.02em]">
            Keep everything that’s important to you and your family shareable and safe in one place.
          </p>

           <div className="mt-[1rem] text-[#796146] font-semibold cursor-pointer hover:underline">
            <div className="flex gap-[0.5rem] items-center">
              <p className="text-[0.4rem] sm:text-[0.625rem] md:text-[0.875rem]  font-normal leading-[0.44rem] sm:leading-[0.625rem] tracking-[-0.02em]">
                Create an account
              </p>
               <ArrowRight className="w-[0.75rem] h-[0.75rem] sm:w-[1rem] sm:h-[1rem] md:w-[1.25rem] md:h-[1.25rem]" />
            </div>
          </div>
        </div>

        {/* Business Card */}
        <div className="bg-[#FBF5E9] rounded-xl p-[0.75rem] sm:p-[1.5rem] lg:p-[2rem] shadow-md">
          <Image
            src="/business1.png"
            alt="Business"
            width={65}
            height={65}
           className="w-[1.5rem] sm:w-[2rem] md:w-[2.5rem] lg:w-[3rem] xl:w-[3.5rem] h-auto"
          />
           <p className="mt-[1rem] text-[0.6rem] sm:text-[0.875rem]  md:text-[1.4rem]  font-normal leading-[0.625rem] sm:leading-[1rem] tracking-[-0.04em]">
            Are you a business?
          </p>
           <p className="mt-[0.5rem] sm:mt-[0.75rem] text-gray-600 text-[0.5rem] sm:text-[0.625rem] md:text-[0.875rem]  font-normal leading-[0.7rem] sm:leading-[0.625rem] md:leading-[1.25rem] tracking-[-0.02em]">
            Keep everything that’s important to you and your family shareable and safe in one place.
          </p>

            <div className="mt-[1rem] text-[#796146] font-semibold cursor-pointer hover:underline">
            <div className="flex gap-[0.5rem] items-center">
              <p className="text-[0.4rem] sm:text-[0.625rem] md:text-[0.875rem]  font-normal leading-[0.44rem] sm:leading-[0.625rem] tracking-[-0.02em]">
               Join Us
              </p>

               <ArrowRight className="w-[0.75rem] h-[0.75rem] sm:w-[1rem] sm:h-[1rem] md:w-[1.25rem] md:h-[1.25rem]" />
            </div>
          </div>
        </div>
      </div>
    </div>



        
    
    </div>
  );
}