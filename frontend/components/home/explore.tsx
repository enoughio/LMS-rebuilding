import React from "react";
import Link from "next/link";
import { Clock, Calendar, BarChart2, Headphones } from "lucide-react";
import Image from "next/image";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  descriptions: string[];
  learnMoreLink: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  descriptions,
  learnMoreLink,
}) => {
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden bg-white rounded-lg p-5 shadow-sm mb-4">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-4 flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">{title}</h3>
            {descriptions.map((desc, index) => (
              <p key={index} className="text-gray-600 text-sm mb-0.5">
                {desc}
              </p>
            ))}
            <Link
              href={learnMoreLink}
              className="text-sm font-medium text-primary flex items-center mt-2"
            >
              Learn More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block bg-white rounded-lg p-6 shadow-sm">
        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        {descriptions.map((desc, index) => (
          <p key={index} className="text-gray-600 text-sm mb-2">
            {desc}
          </p>
        ))}
        <Link
          href={learnMoreLink}
          className="text-sm font-medium text-primary flex items-center mt-4"
        >
          Learn More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </>
  );
};

const Explore: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Pomodoro Timer",
      descriptions: [
        "There are many variant of passages of",
        "enginner's available, have suffered",
      ],
      learnMoreLink: "/features/pomodoro",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Daily Planner",
      descriptions: ["Create daily tasks & goals", "Drag-and-drop reordering"],
      learnMoreLink: "/features/planner",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Tracker",
      descriptions: [
        "Session logging by subject/task",
        "Analytics for weekly/monthly study time",
        "Visual stats to stay accountable",
      ],
      learnMoreLink: "/features/tracker",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Streak Overview",
      descriptions: [
        "Visual streak charts (weekly/monthly)",
        "XP or rewards-based motivation",
        '"Don\'t break the chain" gamification',
      ],
      learnMoreLink: "/features/streaks",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Focus Music",
      descriptions: [
        "Lo-fi beats, nature sounds, café ambience",
        "Playlists optimized for focus",
        "Timer-based playback",
      ],
      learnMoreLink: "/features/music",
    },
  ];

  return (
    <section className="py-16 bg-[#ECE3DA] w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-col md:flex-row flex items-center justify-between mb-8 md:mb-0 bg-[#f4f1ea] rounded-lg w-full">
            <div className="p-4 md:p-10 w-full">
              {/* Mobile Header */}
              <div className="md:hidden mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Explore Our
                </h2>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Standout Features
                </h2>
                <div className="w-20 h-1 bg-amber-800 rounded-full"></div>
              </div>

              {/* Desktop Grid Layout */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Explore Our
                  </h2>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Standout Features
                  </h2>
                  <div className="w-24 h-1 bg-amber-800 rounded-full"></div>
                </div>

                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    descriptions={feature.descriptions}
                    learnMoreLink={feature.learnMoreLink}
                  />
                ))}
              </div>

              {/* Mobile Stack Layout */}
              <div className="md:hidden space-y-4">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    descriptions={feature.descriptions}
                    learnMoreLink={feature.learnMoreLink}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* "Are you ready to start?" Section */}
        <div className="mt-12 relative">
          {/* Book image positioned to overlap */}
          <div className="absolute -top-36 left-1/2 transform -translate-x-1/2 md:left-auto md:-top-32 md:right-12 z-10">
            <Image
              src="/home/explore/book.svg"
              alt="Books illustration"
              width={380}
              height={260}
              className="object-contain"
            />
          </div>

          <div className="bg-[#796146] rounded-lg overflow-hidden pt-12 pb-6 px-4 md:pt-8 md:px-12">
            <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start md:justify-between">
              <div className="text-white w-full md:max-w-[50%] ">
                <h2 className="text-2xl md:text-4xl font-bold mb-4 pt-8 md:pt-0">
                  Are you ready to start?
                </h2>
                <p className="mb-2 text-xs md:text-base">
                  Custom Software Development Tailored Solutions for Your Business
                </p>
                <p className="mb-6 text-xs md:text-base">
                  Custom Software Development Tailored Solutions
                </p>

                <div className="flex flex-col w-full gap-4 items-center md:items-start">
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="bg-transparent border border-[#a59680] rounded-full px-4 py-2 text-white placeholder-[#d4c9bb] w-full max-w-xs text-sm"
                  />
                  <button className="bg-white text-gray-800 rounded-full px-6 py-2 font-medium text-sm whitespace-nowrap">
                    Contact us
                  </button>
                </div>
              </div>

              {/* Empty div to balance the layout on mobile */}
              <div className="h-0 md:h-0 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explore;
