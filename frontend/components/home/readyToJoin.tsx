"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "../ui/button";

export default function Ready() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleStudentClick = () => {
    if (isLoading) return; // Prevent action while loading

    if (user) {
      router.push("/dashboard/member");
    } else {
      router.push("/auth/login"); 
    }
  };

  const handleLibraryClick = () => {
    if (isLoading) return; // Prevent action while loading

    if (user) {
      router.push("/libraries/register");
    } else {
      router.push("/auth/login"); 
    }
  };

  return (
    <div className="bg-[#ECE3DA] min-h-[30vh]  max-w-[1920px] lg:overflow-x-auto overflow-x-hidden max-h-screen px-3 py-8 sm:py-10 sm:px-4 lg:px-16 xl:px-24 2xl:px-32">
      <div className="mx-auto text-center mb-4 sm:mb-8">
        <h2 className="text-[16.34px] sm:text-[28px] md:text-[40px] lg:text-[48px] xl:text-[54px] 2xl:text-[60px] font-bold leading-[19.35px] md:leading-[48px] tracking-[-0.04em] text-center mb-2">
          Ready to get started?
        </h2>

        
      </div>

      <p className="text-center w-full mx-auto text-[8.05px] sm:text-[14px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[12px] sm:leading-[20px] md:leading-[28px] tracking-[-0.02em] font-normal text-gray-700 mb-10">
        The IPFS file storage and sharing with collaboration solution that suits
        any industry and business size.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-10 max-w-4xl mx-auto">
        {/* Individual Card */}
        <Button
          onClick={handleStudentClick}
          className="bg-[#fbf5e9] rounded-xl p-3 sm:p-6 lg:p-8 shadow-md cursor-pointer hover:shadow-lg hover:bg-[#dcc5b3] transition-all duration-300"
        >
          <Image
            src="/indi1.png"
            alt="Individual"
            width={50}
            height={50}
            className="w-[24px] sm:w-[32px] md:w-[40px] lg:w-[48px] xl:w-[56px] h-auto"
          />
          <p className="mt-4 text-[9.68px] sm:text-[14px] md:text-[20px] lg:text-[24px] font-normal leading-[10px] sm:leading-[16px] tracking-[-0.04em]">
            Are you an Student?
          </p>
          <p className="mt-2 sm:mt-3  text-gray-600 text-[4.84px] sm:text-[10px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-normal leading-[7px] sm:leading-[10px] md:leading-[20px] tracking-[-0.02em]">
            Keep everything that&apos;s important to you and your family shareable
            and safe in one place.
          </p>

          <div className="mt-4 text-[#796146] font-semibold cursor-pointer hover:underline">
            <div className="flex gap-2 items-center">
              <p className="text-[4.84px] sm:text-[10px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-normal leading-[7px] sm:leading-[10px] tracking-[-0.02em]">
                {user ? "Go to Dashboard" : "Create an account"}
              </p>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
          </div>
        </Button>

        {/* Business Card */}
        <Button
          onClick={handleLibraryClick}
          className="bg-[#fbf5e9] rounded-xl p-3 sm:p-6 lg:p-8 shadow-md cursor-pointer hover:shadow-lg hover:bg-[#dcc5b3] transition-all duration-300"
        >
          <Image
            src="/business1.png"
            alt="Business"
            width={65}
            height={65}
            className="w-[24px] sm:w-[32px] md:w-[40px] lg:w-[48px] xl:w-[56px] h-auto"
          />
          <p className="mt-4 text-[9.68px] sm:text-[14px] md:text-[20px] lg:text-[24px] font-normal leading-[10px] sm:leading-[16px] tracking-[-0.04em]">
            Are you a Library?
          </p>
          <p className="mt-2 sm:mt-3  text-gray-600 text-[4.84px] sm:text-[10px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-normal leading-[7px] sm:leading-[10px] md:leading-[20px] tracking-[-0.02em]">
            Keep everything that&apos;s important to you and your family shareable
            and safe in one place.
          </p>

          <div className="mt-4 text-[#796146] font-semibold cursor-pointer hover:underline">
            <div className="flex gap-2 items-center">
              <p className="text-[4.84px] sm:text-[10px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-normal leading-[7px] sm:leading-[10px] tracking-[-0.02em]">
                {user ? "Register Library" : "Create an account"}
              </p>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}