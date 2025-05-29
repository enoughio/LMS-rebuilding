import Image from "next/image";
import EqualSizedBoxes from "@/components/story1";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
export default function Story() {
    return (
        <div className="bg-[#ECE3DA] min-h-screen w-full py-6 px-3 md:px-[1%] lg:px-[8%] font-urbanist">
            {/* about us section */}
            <section className="mb-4">
                <div className="about_us text-center">
                    <h1 className="font-semibold text-[45px] leading-[54px] md:text-[49px] md:leading-[58.2px] tracking-[0.37px]">About Us</h1>
                    <div className="line h-[6.85px] w-[26px] lg:w-[76px] lg:h-[6.85px] bg-[#796146] mx-auto my-2"></div>
                </div>

                <div className="flex flex-col md:flex-row items-start justify-between gap-4 lg:gap-6 px-4 mt-6 w-full">
                    {/* Left Side Text */}
                    <div className="md:w-1/2 lg:w-1/3 w-full text-[31px] leading-[37px] md:text-[29px] md:leading-[28px]">
                        <p className="font-extralight">
                            <span className="font-medium text-[#824800]">We are the best library you can get into</span> — a space where knowledge meets inspiration, and curiosity turns into discovery.
                        </p>
                    </div>

                    {/* Right Side Text */}
                    <div className="md:w-full w-full text-[13px] leading-[19px] tracking-[0.25px] md:text-[12.95px] md:leading-[14px] font-medium md:mt-4">
                        <p>
                            Our mission goes beyond simply storing books; we are a dynamic space where ideas are born, connections are made, and learning never stops.
                            Whether you&apos;re a student, researcher, avid reader, or simply someone curious about the world, our library is built to empower you with the tools, resources, and environment you need to thrive.
                            
                            Our collection spans across genres, disciplines, and formats — from classic literature to cutting-edge research, from printed volumes to digital archives, and from timeless philosophy to trending technologies.
                            We believe that access to knowledge should be as vast as curiosity itself. That&apos;s why we constantly update and expand our resources, ensuring that our community always has access to the most relevant, diverse, and high-quality content available.
                            <br /> <br />
                            But we are more than our books. We are a space designed to nurture every kind of learner and thinker. Our library features modern, thoughtfully planned zones — quiet study areas for deep focus, collaborative corners for group work, digital labs for exploring new media, and cozy reading nooks that invite reflection and imagination.
                            With free Wi-Fi, multimedia systems, and access to online journals and databases, we blend the charm of a traditional library with the power of modern technology.
                        </p>
                    </div>
                </div>
            </section>

            {/* what drives student adda */}
            <section className="font-jakarta mt-8">
                <div className="bg-[#EFEAE5] w-full py-12 px-2 md:px-1 lg:px-16 xl:px-20">
                    <div className="what flex items-center justify-center gap-2 mb-6">
                        <Image src="/story1.png" width={30} height={20} alt="story1" />
                        <p className="text-[4.94px] leading-[4.9px] tracking-[0.49px]  md:text-[10.54px] md:leading-[10.5px] font-semibold md:tracking-wide text-center">WHAT DRIVES STUDENT ADDA</p>
                        <Image src="/story2.png" width={30} height={20} alt="story2" />
                    </div>

                    <div className="text-center mb-5 md:mb-12 text-[17.66px] md:text-[22.3px] md:leading-[26.8px] leading-[21px] ">
                        <p className=" md:text-4xl font-bold">Driven by purpose.</p>
                        <p className="md:text-4xl font-bold">Powered by passion.</p>
                    </div>

                    <EqualSizedBoxes />
                </div>
            </section>

            {/* Success Story Section */}
            <section className="bg-[#796146] grid grid-cols-1 md:grid-cols-2 w-[80%] rounded-md  items-center justify-center font-[Plus Jakarta Sans] mx-auto mt-[-20px]">
                <div className="left_part p-4">
                    <div className="story flex items-center gap-2">
                        <p className="text-white font-semibold text-[7.15px] leading-[7.2px] tracking-[0.72px] sm:text-[8.56px] sm:leading-[8.6px]">SUCCESS STORY</p>
                        <Image src="/story2.png" alt="story2" width={16} height={16} className="text-white"/>
                    </div>

                    <div className="text-white text-[25.55px] leading-[30.7px] sm:text-[30.58px] sm:leading-[36.7px] lg:text-[34px] lg:leading-[40px] mt-4">
                        <p className=" bold">Experiencing</p>
                        <p className=" bold">Traditions and</p>
                        <p className=" bold">Customs</p>

                        <p className="mt-4 text-[9.18px] leading-[15.3px] lg:text-[11px] lg:leading-[18px] ">Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry&apos;s standardever</p>
                    </div>
                </div>

                <div className="right_part grid grid-cols-2 sm:grid-cols-2 rounded-md gap-6 p-4">
                    <div className="border border-white flex items-center p-3">
                        <div className="w-10 h-10 bg-white rounded-full mr-3 flex justify-center items-center">
                            <Image src="/member.png" alt="member" width={24} height={24}/>
                        </div>
                        <div className="features text-white">
                            <p className="font-bold text-[17.66px] leading-[21px] mb-3 md:text-[26px] md:leading-[29px] ">200+</p>
                            <p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">Team member</p>
                        </div>
                    </div>

                    <div className="border border-white flex items-center p-3">
                        <div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
                            <Image src="/award.png" alt="member" width={24} height={24}/>
                        </div>
                        <div className="features text-white">
                            <p className="font-bold  text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">20+</p>
                            <p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">Winning award</p>
                        </div>
                    </div>

                    <div className=" border-white flex items-center border-[0.67px] p-3 sm:p-2">
                        <div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
                            <Image src="/project.png" alt="member" width={24} height={24}/>
                        </div>
                        <div className="features text-white">
                            <p className="font-bold  text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">10k+</p>
                            <p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">Complete project</p>
                        </div>
                    </div>

                    <div className="border border-white flex items-center p-3">
                        <div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
                            <Image src="/client.png" alt="member" width={24} height={24}/>
                        </div>
                        <div className="features text-white">
                            <p className="font-bold   text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">900+</p>
                            <p className="text-[6.85px] leading-[10.6px] md:text-[10px] md:leading-[14px]">Client review</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* advertisement section */}
            <div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center">
               {/* <Image src="/adv1.png" fill alt="adv"/> */}
            </div>

            {/* story section */}
            <div className="bg-[#EFEAE5] w-full rounded-lg shadow-md font-jakarta p-4 mb-8">
                {/* Top Section: Heading + Subheading */}
                <div className="flex flex-col md:flex-row justify-between items-start px-3 py-3">
                    <div>
                        <p className="font-jakarta text-custom tracking-tightest leading-tight font-medium text-gray-800 sm:text-2xl">
                            Our Story
                        </p>
                        <div className="w-[30.23px] h-[2.73px] bg-[#C76E4E] mt-2"></div>
                    </div>

                    <p className="mt-4 md:mt-[4%] font-jakarta text-[6.42px] leading-[7.2px] sm:leading-[12px] tracking-[0.05px] sm:text-[10px] lg:text-[18px] lg:leading-[20px] lg:tracking-[0.05px] mr-[5%]">
                        How Student Adda was <br /> born out of a real need.
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex flex-col sm:flex-row w-full h-auto gap-4 px-3">
                    {/* Left Section: Images */}
                    <div className="relative w-full md:w-1/2 h-[150px] md:h-[400px] items-center">
                        {/* Stacked Images */}
                        <div className="relative h-full flex items-center mx-auto justify-center w-1/2">
                            <Image
                                src="/curve.png"
                                width={60}
                                height={60}
                                alt="curve"
                                className="absolute left-[2%] top-[1%] sm:top-[3%] z-30 mx-auto"
                            />

                            <div className="absolute top-[15%] items-center left-[0%] sm:left-[15%] lg:left-[5%] w-[99px] h-[115px] sm:w-[120px] sm:h-[150px] md:w-[150px] md:h-[189px] z-10 lg:w-[230px] lg:h-[230px] -rotate-4">
                                <Image
                                    src="/img1.png"
                                    alt="image1"
                                    fill
                                    className="rounded-md object-cover"
                                />
                            </div>
                            <div className="absolute top-[5%] sm:top-[3%] md:top-[5%] lg:top-[2%] left-[30%] sm:left-[30%] lg:left-[50%] items-center w-[79.19px] h-[113.5px] sm:w-[130px] sm:h-[150px] md:w-[150px] md:h-[185px] lg:w-[210px] lg:h-[230px] z-0 rotate-6">
                                <Image
                                    src="/img2.png"
                                    alt="image2"
                                    fill
                                    className="rounded-md object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Story Text */}
                    <div className="w-full md:w-1/2 h-full p-2 md:p-3 text-gray-800 text-sm md:text-base leading-relaxed">
                        <Image
                            src="/quote.png"
                            width={100}
                            height={100}
                            alt="quote"
                            className="mb-4 w-[38px] h-[29px] md:w-[95px] md:h-[75px]"
                        />
                        <p className="text-[9.75px] leading-[10.8px] tracking-[0.06px] sm:text-[15px] sm:leading-[16px]">
                            Student Adda began with a simple idea — to make studying smarter,
                            easier, and more connected. As students, we often struggled to find peaceful places to
                            study, reliable tools to stay productive, and a supportive community to ask questions.
                            That&apos;s when the vision took shape: What if libraries could become more than just physical
                            spaces? What if they could offer digital tools, seamless seat booking, and a vibrant
                            learner network — all from one platform?
                            <br /><br />
                            Built by students, for students, Student Adda is our answer to this gap.
                            Today, we&apos;re creating a space where learners can thrive — whether they&apos;re reserving a seat
                            at their favorite library, tracking their goals, or connecting with peers through our
                            forums. And this is just the beginning.
                        </p>
                    </div>
                </div>
            </div>

            {/* advertisement section */}
            <div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center">
                <p className="text-blue-500">Advertisement Space</p>
            </div>

            {/* meet team */}
            {/* <section className="bg-red-100 p-6 mb-8 rounded-lg">
                <div className="top flex items-center justify-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white rounded-full"></div>
                    <p className="text-lg font-medium">PASSIONATE MINDS BUILDING SMARTER LEARNING EXPERIENCES.</p>
                </div>

                <div className="t1 text-center text-2xl font-bold mb-8">
                    Meet the Team Behind <span className="text-red-500">Student Adda</span>
                </div>

                <div className="about_teams grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="team-member">
                        <div className="image bg-gray-200 h-48 rounded-t-lg"></div>
                        <div className="text2 bg-white p-4 rounded-b-lg">
                            <h1 className="font-bold text-xl">Aniket Jatav</h1>
                            <p className="text-gray-500">Full Stack Developer</p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* advertisement section */}
            <div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center">
                <p className="text-blue-500">Advertisement Space</p>
            </div>


            {/* section join us today */}
            <section className="bg-[#796146] w-full flex flex-col md:flex-row rounded-lg relative p-4  overflow-hidden mb-8 font-[Plus Jakarta Sans]">
                    {/* Image Left */}
                    <div className="img_left  hidden md:block w-full md:w-1/2 h-24 sm:h-64 md:h-auto relative  ">
                        <Image src="/join.png" width={400} height={30} alt="join us today" className="w-full h-[90%]  absolute  z-100 top-0 " />
                    </div>

                            {/* Right Side Form */}
                            <div className="right_side w-full md:w-1/2 p-4 sm:p-6 md:px-10 lg:px-16 xl:px-20 text-white">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40.84px] leading-tight text-center font-bold mb-4">
                                Join us today 👋
                                </h1>

                                <p className="mb-6 text-sm sm:text-base text-left">
                                Clarity gives you the blocks and components you need to create a truly professional website.
                                </p>

                                {/* Google Sign Up */}
                                <div className="px-4 py-2 bg-black rounded-full flex items-center gap-3 mb-4 cursor-pointer justify-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full">
                                    <Image src="/google.png" width={18} height={18} alt="google" />
                                </div>
                                <p className="text-sm sm:text-base">Sign up with Google</p>
                                </div>

                                {/* Email Input */}
                                <div className="email mb-4">
                                <p className="mb-1 text-sm">Email Address</p>
                                <input
                                    type="text"
                                    placeholder="i.e. davon@gmail.com"
                                    className="w-full p-2 rounded-full text-black border border-white text-sm"
                                />
                                </div>

                                {/* Name Input */}
                                <div className="first mb-4">
                                <p className="mb-1 text-sm">First & Last Name</p>
                                <input
                                    type="text"
                                    placeholder="i.e. David Leon"
                                    className="w-full p-2 rounded-full text-black border border-white text-sm"
                                />
                                </div>

                                {/* Password Input */}
                                <div className="password mb-4">
                                <p className="mb-1 text-sm">Password</p>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full p-2 rounded-full text-black border border-white text-sm"
                                />
                                </div>

                                {/* Remember Me Checkbox */}
                                <div className="checkbox flex items-center mb-4 text-sm">
                                <input type="checkbox" className="mr-2" />
                                <p>Remember me</p>
                                </div>

                                {/* Create Account Button */}
                                <div className="px-3 py-2 w-full sm:w-[60%] md:w-[50%] bg-black rounded-full text-center cursor-pointer mb-4 text-sm sm:text-base">
                                Create Account
                                </div>

                                {/* Footer Link */}
                                <p className="text-sm">
                                Already have an account?{' '}
                                <span className="underline cursor-pointer text-black">Create free account</span>
                                </p>
                            </div>
</section>

<Footer/>

        </div>
    );
}