import Image from "next/image"
import EqualSizedBoxes from "../story1"
import { plusJakarta } from "@/app/fonts"
export default function Drives(){
    return (
        <>


      <section className={`mt-8 ${plusJakarta.className}`}>
        <div className="bg-[#EFEAE5] rounded-2xl  w-full py-[3rem] px-[0.5rem] md:px-[0.25rem] lg:px-[4rem] xl:px-[8rem]">
            <div className="what flex items-center justify-center gap-[0.5rem] mb-[1.5rem]">
            <Image src="/story1.png" width={30} height={20} alt="story1" />
            <p className="text-[0.409rem] leading-[0.306rem] tracking-[0.03rem] md:text-[0.659rem] md:leading-[0.656rem] font-semibold md:tracking-wide text-center">
                WHAT DRIVES STUDENT ADDA
            </p>
            <Image src="/story2.png" width={30} height={20} alt="story2" />
            </div>

            <div className="text-center mb-[1.25rem] md:mb-[3rem] text-[1.104rem] md:text-[1.39rem] md:leading-[1.675rem] leading-[1.3125rem]">
            <p className="md:text-4xl font-bold">Driven by purpose.</p>
            <p className="md:text-4xl font-bold">Powered by passion.</p>
            </div>

            <EqualSizedBoxes />
        </div>
        </section>



    <section className={`bg-[#796146] grid grid-cols-1 md:grid-cols-2 w-[90%] md:w-[85%] rounded-md items-center justify-center ${plusJakarta.className} mx-auto mt-[-2.2rem] md:mt-[-2rem]`}>
  {/* LEFT SIDE */}
  <div className="left_part p-[1rem] md:p-[1.5rem]">
    <div className="story flex items-center gap-[0.5rem] text-white text-sm md:text-base font-medium">
      <p>SUCCESS STORY</p>
      <Image src="/story2.png" alt="story2" width={16} height={16} />
    </div>

    <div className="text-white mt-[0.7rem] md:mt-[1rem]">
      <p className="bold text-[1.5rem] md:text-[1.9rem] leading-tight">Experiencing</p>
      <p className="bold text-[1.5rem] md:text-[1.9rem] leading-tight">Traditions and</p>
      <p className="bold text-[1.5rem] md:text-[1.9rem] leading-tight">Customs</p>

      <p className="mt-[1rem] text-[0.675rem] md:text-[0.8rem] leading-[1.25rem] text-gray-200">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard ever.
      </p>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="right_part grid grid-cols-2 gap-[1rem] md:gap-[1.25rem] p-[0.75rem] md:p-[1.25rem]">

    {[
      { img: "member", count: "200+", label: "Team member" },
      { img: "award", count: "20+", label: "Winning award" },
      { img: "project", count: "10k+", label: "Complete project" },
      { img: "client", count: "900+", label: "Client review" },
    ].map((item, idx) => (
      <div key={idx} className="border border-white flex items-center p-[1rem] md:p-[1.25rem] rounded-md">
        <div className="w-[2rem] h-[2rem] md:w-[2.2rem] md:h-[2.2rem] lg:w-[2.5rem] lg:h-[2.5rem] bg-white rounded-full mr-[0.75rem] flex justify-center items-center">
          <Image src={`/${item.img}.png`} alt={item.img} width={24} height={24} className="w-[1rem] h-[1rem] md:w-[1rem] lg:w-[1rem] md:h-[1.5rem] lg:h-[1.5rem]" />
        </div>
        <div className="text-white">
          <p className="font-bold text-[1.25rem] leading-[1.5rem] mb-[0.25rem]">{item.count}</p>
          <p className="text-[0.675rem] leading-[1rem]">{item.label}</p>
        </div>
      </div>
    ))}
  </div>
</section>



        </>

    )
} 