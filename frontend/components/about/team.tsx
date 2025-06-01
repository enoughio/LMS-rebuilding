import Image from "next/image";
import { plusJakarta } from "@/app/fonts";
const teamMembers = [
  {
    name: "Aniket Jatav",
    role: "Full Stack Developer",
    image: "/about/member.png",
  },
  {
    name: "Aniket Jatav",
    role: "UI/UX Designer",
    image: "/about/member.png",
  },
  {
    name: "Aniket Jatav",
    role: "Backend Developer",
    image: "/about/member.png",
  },
  {
    name: "Aniket Jatav",
    role: "Frontend Developer",
    image: "/about/member.png",
  },
];

export default function Team() {
  return (
    <section className={`px-4 py-10 sm:px-8 md:px-16 lg:px-24 xl:px-32 mt-3  ${plusJakarta.className} `}>
      {/* Header */}
      <div className="text-left mb-8 lg:mb-10">
        <h2 className="text-xs sm:text-base text-[#A28A72] tracking-wider uppercase font-medium">
          PASSIONATE MINDS BUILDING SMARTER LEARNING EXPERIENCE
        </h2>
      </div>

      {/* Title */}
      <div className="text-left mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ">
          Meet the <span className="text-[#824800]">Team Behind</span>
        </h1>
        <p className="text-2xl sm:text-3xl font-bold text-black mt-2">
          Student Adda
        </p>
      </div>

      {/* Team Cards */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
  {teamMembers.map((member, index) => (
    <div
      key={index}
      className="relative w-full rounded-xl overflow-hidden  hover:shadow-lg transition-shadow duration-300 pb-6 lg:pb-16" // Added padding-bottom for space
    >
      {/* Image Container */}
      <Image
        src={member.image}
        alt={member.name}
        width={300}
        height={300}
        className="w-full h-auto object-cover"
      />

      {/* Name + Role Box (overlay under the image) */}
      <div className="absolute bottom-[-0.5rem] left-1/2 transform -translate-x-1/2 w-[90%] bg-white bg-opacity-90 px-2 py-2 sm:px-4 sm:py-3 z-10 rounded-lg shadow">
        <h3 className="text-xs sm:text-lg font-semibold text-gray-800">{member.name}</h3>
        <p className="text-xs sm:text-base text-gray-500">{member.role}</p>
      </div>
    </div>
  ))}
</div>

    </section>
  );
}