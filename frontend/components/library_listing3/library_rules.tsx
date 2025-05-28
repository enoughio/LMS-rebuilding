import Image from "next/image";

export default function LibraryRules() {
  const rules = [
    {
      image: "/listings3/id.png",
      heading: "Id Required",
      paragraph: "Valid government id for entry",
    },
    {
      image: "/listings3/food.png",
      heading: "No Food",
      paragraph: "Food allowed only in cafeteria",
    },
    {
      image: "/listings3/time.png",
      heading: "Time limit",
      paragraph: "4 hour max session",
    },
    {
      image: "/listings3/queit.png",
      heading: "Quiet",
      paragraph: "Maintain silence in study area",
    },
    {
      image: "/listings3/phone.png",
      heading: "No phones",
      paragraph: "Call allowed only outside ",
    },
    {
      image: "/listings3/cancel.png",
      heading: "Cancellation",
      paragraph: "Only allowed 2 hours before",
    },
  ];

  return (
    <div className="w-full mt-1 p-0 sm:p-2">
      <h1 className="font-urbanist font-semibold text-[20px] sm:text-[29.17px] leading-[28px] sm:leading-[34.47px] tracking-[0.23px] flex items-center mb-1 sm:mb-4">
        Library Rules
      </h1>

      <div className="w-full p-1 sm:p-4 grid grid-cols-2 md:grid-cols-2 gap-1 sm:gap-4 rounded-xl">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="flex items-start gap-1 sm:gap-2 bg-white p-1 sm:p-3 rounded-lg"
          >
            <div className="w-4 h-4 sm:w-7 sm:h-7 flex items-center justify-center relative">
              <Image
                src={rule.image}
                alt={rule.heading}
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <div className="text">
              <h2 className="font-urbanist font-semibold text-[9px] xs:text-[10px] sm:text-[13px] md:text-[14px] leading-[11px] sm:leading-[15px] tracking-[0.10px] flex items-center">
                {rule.heading}
              </h2>
              <p className="font-urbanist font-normal text-[7px] xs:text-[8px] sm:text-[10px] md:text-[11px] leading-[9px] sm:leading-[13px] md:leading-[14px] tracking-[0.08px] sm:tracking-[0.10px] flex items-center text-gray-700 mt-0 sm:mt-1">
                {rule.paragraph}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
