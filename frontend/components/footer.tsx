import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#796047] w-full max-w-[1920px] pt-16 mt-8 text-white">
      {/* Top Section */}
      <div className="mx-9 flex flex-col md:flex-row justify-between gap-16 md:gap-28 mb-1 sm:mb-6 items-center md:items-start text-center md:text-left">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start w-full md:w-2/5">
          <Image
            src="/logo.svg" width={158}
              height={28} 
            alt="Footer Visual"
            className="rounded-xl w-48 h-8 object-cover filter brightness-0 invert"
          
          />
          <p className="text-sm tracking-wide font-light mt-2 sm:mt-5 md:text-[16px] text-white">
            Smart Libraries. Smarter Learning.
          </p>
        </div>

        {/* Quick Links, Resources, Company */}
        <div className="w-full md:w-5/5 lg:2/5 grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Quick Links */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-white">
              Quick Links
            </h2>
            <ul className="space-y-1 text-[12px] sm:text-sm md:text-[14px] lg:text-sm text-white/90">
              <li>Home</li>
              <li>About Us</li>
              <li>Features</li>
              <li>Library Listings</li>
              <li>Community Forum</li>
              <li>Blog</li>
              <li>FAQ & Help Center</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-white">
              Resources
            </h2>
            <ul className="space-y-1 text-[12px] sm:text-sm md:text-[14px] lg:text-sm text-white/90">
              <li>Seat Booking</li>
              <li>E-Library</li>
              <li>Book Inventory</li>
              <li>Productivity Tools</li>
              <li>Quizzes</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-white">Company</h2>
            <ul className="space-y-1 text-[12px] sm:text-sm md:text-[14px] lg:text-sm text-white/90">
              <li>Our Story</li>
              <li>Mission & Vision</li>
              <li>The Team</li>
              <li>Careers</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t my-4 border-white/20"></div>

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center md:items-start text-center md:text-left">
        {/* Email Input */}
        <div className="w-full flex justify-center md:justify-start">
          <div className="flex max-w-md w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm placeholder-white/60 outline-none rounded-l-md focus:bg-white/20 transition-colors"
            />
            <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-700 transition font-semibold text-sm">
              Subscribe
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 justify-center text-white">
{/*      facebook  svg     */}
           <div className="flex items-center justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="w-6 h-6 md:w-8 md:h-8"
              fill="currentColor"
            >
              <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
            </svg>
          </div>
{/* instagram Svg */}
          <div className="flex items-center justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-6 h-6 md:w-8 md:h-8"
              fill="currentColor"
            >
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
          </div>
{/* Twitter svg */}
   
   <div className="flex items-center justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-6 h-6 md:w-8 md:h-8"
              fill="currentColor"
            >
              <path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
            </svg>
          </div>

        </div>
      </div>

      {/* Bottom Links */}
      <div className="mt-6 flex flex-wrap justify-center items-center text-center text-[12px] sm:text-sm tracking-wide font-light gap-4 text-white/80 pb-10">
        <a href="">Privacy Policy</a>
        <a href="">Terms Of Use</a>
        <a href="">Sales and Refunds</a>
        <a href="">Legal</a>
      </div>
    </footer>
  );
}