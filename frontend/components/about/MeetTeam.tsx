import React, { useState } from 'react';
import Image from 'next/image';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Aniket Jatav",
    role: "Full Stack Developer",
    image: "/about/man1.svg",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "UI/UX Designer",
    image: "/about/man1.svg",
  },
  {
    id: 3,
    name: "Rahul Kumar",
    role: "Backend Developer",
    image: "/about/man1.svg",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    image: "/about/man1.svg",
  },
  {
    id: 5,
    name: "Michael Chen",
    role: "DevOps Engineer",
    image: "/about/man1.svg",
  },
  {
    id: 6,
    name: "Emma Wilson",
    role: "Product Manager",
    image: "/about/man1.svg",
  },
];

const MeetTeam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= teamMembers.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(0, teamMembers.length - 3) : prevIndex - 3
    );
  };

  const nextSlideMobile = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 4 >= teamMembers.length ? 0 : prevIndex + 4
    );
  };

  const prevSlideMobile = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 4 < 0 ? Math.max(0, teamMembers.length - 4) : prevIndex - 4
    );
  };

  return (
    <section className="bg-[#ECE3DA] font-jakarta mt-12 mb-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-[#796146] rounded-full flex items-center justify-center">
            <Image
              src="/about/meet_team.png"
              width={12}
              height={12}
              alt="Team icon"
              className="invert"
            />
          </div>
          <p className="text-[#796146] text-xs font-bold tracking-widest uppercase">
            PASSIONATE MINDS BUILDING SMARTER LEARNING EXPERIENCES.
          </p>
        </div>

        {/* Title and Navigation */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              Meet the{" "}
              <span className="text-[#796146]">Team Behind</span>
            </h2>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Student Adda
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  prevSlideMobile();
                } else {
                  prevSlide();
                }
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#796146"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  nextSlideMobile();
                } else {
                  nextSlide();
                }
              }}
              className="w-10 h-10 bg-[#796146] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Team Grid - Mobile: 2x2 grid (4 members), Desktop: 1x3 grid (3 members) */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {/* Mobile view - Show 4 members in 2x2 grid */}
          {teamMembers.slice(currentIndex, currentIndex + 4).map((member) => (
            <div
              key={member.id}
              className="relative rounded-2xl overflow-visible shadow-sm hover:shadow-lg transition-shadow duration-300 mb-12"
            >
              <div className="aspect-[4/3] relative bg-white rounded-2xl overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Name card overlay - positioned at right border */}
              <div className="absolute -bottom-6 -right-1 left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <h3 className="font-bold text-sm mb-1 text-center">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view - Show 3 members in 1x3 grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {teamMembers.slice(currentIndex, currentIndex + 3).map((member) => (
            <div
              key={member.id}
              className="relative rounded-2xl overflow-visible shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] relative bg-white rounded-2xl overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Name card overlay - positioned at right border */}
              <div className="absolute -bottom-8 -right-1 left-6 bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-1 text-center">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots (Optional) */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(teamMembers.length / 3) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 3) === index
                    ? "bg-[#796146] w-6"
                    : "bg-gray-300"
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default MeetTeam;
