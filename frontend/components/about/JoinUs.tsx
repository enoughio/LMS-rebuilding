import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const JoinUs = () => {
  return (
    <section className="bg-[#ECE3DA] font-jakarta py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#796146] rounded-3xl overflow-hidden shadow-2xl">
          {/* Left side - Image (Hidden on mobile) */}
          <div className="relative h-64 lg:h-auto hidden lg:block">
            <Image
              src="/about/join_us_google.svg"
              alt="Team collaboration"
              fill
              className="object-cover"
            />
          </div>

          {/* Right side - Form */}
          <div className="bg-[#796146] p-8 lg:p-12 text-white lg:col-span-1">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Join us today 👋
                </h2>
                <p className="text-white/90 text-sm lg:text-base">
                  Clarity gives you the blocks and components you need to
                  create a truly professional website.
                </p>              </div>
              
              {/* Google Sign up button */}
              <Link href={'/auth/login'} className="w-full bg-black text-white py-3 px-4 rounded-full flex items-center justify-center gap-3 mb-6 hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl">
                <Image
                  src="/about/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span className="font-medium">Sign up with Google</span>
              </Link>
              
              {/* Lorem ipsum text to maintain length */}
              <div className="mt-8 space-y-4 text-white/80">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
