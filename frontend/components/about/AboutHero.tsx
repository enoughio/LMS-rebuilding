import React from "react";

const AboutHero = () => {
  return (
    <section className="mb-4">
      <div className="about_us text-center">
        <h1 className="font-semibold text-[45px] leading-[54px] md:text-[49px] md:leading-[58.2px] tracking-[0.37px]">
          About Us
        </h1>
        <div className="line h-[6.85px] w-[26px] lg:w-[76px] lg:h-[6.85px] bg-[#796146] mx-auto my-2"></div>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between gap-4 lg:gap-6 px-4 mt-6 w-full">
        {/* Left Side Text */}
        <div className="md:w-1/2 lg:w-1/3 w-full text-[31px] leading-[37px] md:text-[29px] md:leading-[28px]">
          <p className="font-extralight">
            <span className="font-medium text-[#824800]">
              We are the best library you can get into
            </span>{" "}
            — a space where knowledge meets inspiration, and curiosity turns
            into discovery.
          </p>
        </div>

        {/* Right Side Text */}
        <div className="md:w-full w-full text-[13px] leading-[19px] tracking-[0.25px] md:text-[12.95px] md:leading-[14px] font-medium md:mt-4">
          <p>
            Our mission goes beyond simply storing books; we are a dynamic
            space where ideas are born, connections are made, and learning
            never stops. Whether you&apos;re a student, researcher, avid
            reader, or simply someone curious about the world, our library is
            built to empower you with the tools, resources, and environment
            you need to thrive. Our collection spans across genres,
            disciplines, and formats — from classic literature to cutting-edge
            research, from printed volumes to digital archives, and from
            timeless philosophy to trending technologies. We believe that
            access to knowledge should be as vast as curiosity itself.
            That&apos;s why we constantly update and expand our resources,
            ensuring that our community always has access to the most
            relevant, diverse, and high-quality content available.
            <br /> <br />
            But we are more than our books. We are a space designed to nurture
            every kind of learner and thinker. Our library features modern,
            thoughtfully planned zones — quiet study areas for deep focus,
            collaborative corners for group work, digital labs for exploring
            new media, and cozy reading nooks that invite reflection and
            imagination. With free Wi-Fi, multimedia systems, and access to
            online journals and databases, we blend the charm of a traditional
            library with the power of modern technology.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
