import Image from "next/image";

export default function EqualSizedBoxes() {
  const boxData = [
    {
      icon: "/mission.png",
      alt: "mission",
      title: "Mission",
      description: "Empowering students with smart tools, seamless library access, and a supportive learning community."
    },
    {
      icon: "/vision.png",
      alt: "vision",
      title: "Vision",
      description: "To revolutionize libraries into future-ready study hubs that fuel productivity and academic growth."
    },
    {
      icon: "/value.png",
      alt: "value",
      title: "Value",
      description: "Innovation. Accessibility. Collaboration. We believe in building meaningful tools, creating equal opportunities, and growing together as a student-first platform."
    }
  ];

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch justify-between gap-1 sm:gap-6 lg:gap-18 2xl:gap-30">
      {boxData.map((box, index) => (
        <div key={index} className="relative rounded-md p-2  sm:p-3 pl-8 flex-1 w-full">
          {/* Left Floating Icon */}
          <div className="absolute top-1/2 left-[-2px] sm:left-[-14px] -translate-y-1/2 w-14 h-14 bg-white border border-gray-400 rounded-full flex items-center justify-center shadow">
            <Image src={box.icon} width={30} height={30} alt={box.alt} />
          </div>
          
          {/* Right Text */}
          <div className="space-y-1 bg-white px-8 py-4 rounded-md h-full flex flex-col">
            <p className="text-[11px] leading-[17px]  font-semibold text-[#727272] uppercase">Our</p>
            <p className="text-[21px] leading-[22px] font-bold text-gray-900">{box.title}</p>
            <p className="text-[9.81px]  leading-[10.4px] sm:leading-[18px] text-[#727272] flex-grow">
              {box.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}