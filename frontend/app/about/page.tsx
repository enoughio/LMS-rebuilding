"use client";
import Image from "next/image";
import EqualSizedBoxes from "@/components/story1";
import { useState } from "react";

const teamMembers = [
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

export default function Story() {
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
		<div className="bg-[#ECE3DA] min-h-screen w-full py-6 px-3 md:px-[1%] lg:px-[8%] font-urbanist">
			{/* about us section */}
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

			{/* what drives student adda */}
			<section className="font-jakarta mt-8">
				<div className="bg-[#EFEAE5] w-full py-12 px-2 md:px-1 lg:px-16 xl:px-20">
					<div className="what flex items-center justify-center gap-2 mb-6">
						<Image src="/story1.png" width={30} height={20} alt="story1" />
						<p className="text-[4.94px] leading-[4.9px] tracking-[0.49px]  md:text-[10.54px] md:leading-[10.5px] font-semibold md:tracking-wide text-center">
							WHAT DRIVES STUDENT ADDA
						</p>
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
						<p className="text-white font-semibold text-[7.15px] leading-[7.2px] tracking-[0.72px] sm:text-[8.56px] sm:leading-[8.6px]">
							SUCCESS STORY
						</p>
						<Image
							src="/story2.png"
							alt="story2"
							width={16}
							height={16}
							className="text-white"
						/>
					</div>

					<div className="text-white text-[25.55px] leading-[30.7px] sm:text-[30.58px] sm:leading-[36.7px] lg:text-[34px] lg:leading-[40px] mt-4">
						<p className=" bold">Experiencing</p>
						<p className=" bold">Traditions and</p>
						<p className=" bold">Customs</p>

						<p className="mt-4 text-[9.18px] leading-[15.3px] lg:text-[11px] lg:leading-[18px] ">
							Lorem Ipsum is simply dummy text the printing and typese Lorem
							Ipsum has been the industry&apos;s standardever
						</p>
					</div>
				</div>

				<div className="right_part grid grid-cols-2 sm:grid-cols-2 rounded-md gap-6 p-4">
					<div className="border border-white flex items-center p-3">
						<div className="w-10 h-10 bg-white rounded-full mr-3 flex justify-center items-center">
							<Image
								src="/member.png"
								alt="SUPER_ADMIN"
								width={24}
								height={24}
							/>
						</div>
						<div className="features text-white">
							<p className="font-bold text-[17.66px] leading-[21px] mb-3 md:text-[26px] md:leading-[29px] ">
								200+
							</p>
							<p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">
								Team member
							</p>
						</div>
					</div>

					<div className="border border-white flex items-center p-3">
						<div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
							<Image
								src="/award.png"
								alt="SUPER_ADMIN"
								width={24}
								height={24}
							/>
						</div>
						<div className="features text-white">
							<p className="font-bold  text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">
								20+
							</p>
							<p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">
								Winning award
							</p>
						</div>
					</div>

					<div className=" border-white flex items-center border-[0.67px] p-3 sm:p-2">
						<div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
							<Image
								src="/project.png"
								alt="SUPER_ADMIN"
								width={24}
								height={24}
							/>
						</div>
						<div className="features text-white">
							<p className="font-bold  text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">
								10k+
							</p>
							<p className="text-[6.85px] leading-[10.6px]  md:text-[10px] md:leading-[14px]">
								Complete project
							</p>
						</div>
					</div>

					<div className="border border-white flex items-center p-3">
						<div className="w-10 h-10 bg-white rounded-full mr-3  flex justify-center items-center">
							<Image
								src="/client.png"
								alt="SUPER_ADMIN"
								width={24}
								height={24}
							/>
						</div>
						<div className="features text-white">
							<p className="font-bold   text-[17.66px] leading-[21px] md:text-[26px] md:leading-[29px] mb-3">
								900+
							</p>
							<p className="text-[6.85px] leading-[10.6px] md:text-[10px] md:leading-[14px]">
								Client review
							</p>
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
							easier, and more connected. As students, we often struggled to
							find peaceful places to study, reliable tools to stay productive,
							and a supportive community to ask questions. That&apos;s when the
							vision took shape: What if libraries could become more than just
							physical spaces? What if they could offer digital tools, seamless
							seat booking, and a vibrant learner network — all from one
							platform?
							<br />
							<br />
							Built by students, for students, Student Adda is our answer to
							this gap. Today, we&apos;re creating a space where learners can
							thrive — whether they&apos;re reserving a seat at their favorite
							library, tracking their goals, or connecting with peers through
							our forums. And this is just the beginning.
						</p>
					</div>
				</div>
			</div>

			{/*why choose us section*/}
			<section className="bg-[#ECE3DA] font-jakarta mt-12 mb-8 px-4 lg:px-8">
				<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
					{/* Left part - Images */}
					<div className="lg:w-1/2 relative flex justify-center">
						<Image
							src="/about/five_year.svg"
							alt="Five Year Experience"
							width={400}
							height={500}
							className="w-full max-w-md lg:max-w-lg"
						/>
					</div>

					{/* Right part - Content */}
					<div className="w-full lg:w-1/2 order-1 lg:order-2">
						<div className="flex items-center gap-3 mb-6">
							<Image
								src="/about/why_choose.svg"
								width={24}
								height={24}
								alt="Why choose us icon"
							/>
							<p className="text-[#796146] text-xs sm:text-sm font-bold tracking-widest uppercase">
								WHY CHOOSE US
							</p>
						</div>

						<div className="mb-6">
							<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
								More than just seat booking - your complete
							</h2>
							<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#796146] leading-tight">
								study companion.
							</h2>
						</div>

						<p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-8">
							Student Adda isn't just a library booking system — it's a complete
							platform designed to elevate the study experience. From reserving
							seats and accessing a rich digital library to using built-in
							productivity tools like a Pomodoro timer, habit tracker, and
							quizzes, everything you need is in one place.
						</p>

						{/* Features Grid - Stack on mobile */}
						<div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 mb-8">
							<div className="flex flex-col">
								<div className="flex items-center gap-3 mb-4">
									<div className="bg-[#796146] rounded-full p-2 sm:p-3">
										<Image
											src="/about/browser.svg"
											width={20}
											height={20}
											alt="Platform"
											className="invert"
										/>
									</div>
									<h3 className="font-semibold text-base sm:text-lg">
										All-in-One Platform
									</h3>
								</div>

								<div className="ml-8 sm:ml-12 space-y-2 sm:space-y-3">
									<div className="flex items-center gap-2 sm:gap-3">
										<Image
											src="/about/tick.svg"
											width={14}
											height={14}
											alt="Check"
											className="sm:w-4 sm:h-4"
										/>
										<p className="text-gray-700 text-sm sm:text-base">
											Book seats, access eBooks
										</p>
									</div>
									<div className="flex items-center gap-2 sm:gap-3">
										<Image
											src="/about/tick.svg"
											width={14}
											height={14}
											alt="Check"
											className="sm:w-4 sm:h-4"
										/>
										<p className="text-gray-700 text-sm sm:text-base">
											Use study tools
										</p>
									</div>
								</div>
							</div>

							<div className="flex flex-col">
								<div className="flex items-center gap-3 mb-4">
									<div className="bg-[#796146] rounded-full p-2 sm:p-3">
										<Image
											src="/about/library.svg"
											width={20}
											height={20}
											alt="Library"
											className="invert"
										/>
									</div>
									<h3 className="font-semibold text-base sm:text-lg">
										Smart Library Access
									</h3>
								</div>

								<div className="ml-8 sm:ml-12 space-y-2 sm:space-y-3">
									<div className="flex items-center gap-2 sm:gap-3">
										<Image
											src="/about/tick.svg"
											width={14}
											height={14}
											alt="Check"
											className="sm:w-4 sm:h-4"
										/>
										<p className="text-gray-700 text-sm sm:text-base">
											Search, filter
										</p>
									</div>
									<div className="flex items-center gap-2 sm:gap-3">
										<Image
											src="/about/tick.svg"
											width={14}
											height={14}
											alt="Check"
											className="sm:w-4 sm:h-4"
										/>
										<p className="text-gray-700 text-sm sm:text-base">
											manage your libraries
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* CTA Section - Stack on mobile */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
							<button className="w-full sm:w-auto bg-transparent border-2 border-[#796146] text-[#796146] px-6 sm:px-8 py-3 rounded-full flex items-center justify-center gap-3 hover:bg-[#796146] hover:text-white transition-all duration-300 font-medium text-sm sm:text-base">
								Read More
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="sm:w-5 sm:h-5"
								>
									<path
										d="M5 12H19M19 12L12 5M19 12L12 19"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							<div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
								<div className="bg-[#796146] rounded-full p-2">
									<Image
										src="/about/call.svg"
										width={16}
										height={16}
										alt="Call"
										className="invert sm:w-5 sm:h-5"
									/>
								</div>
								<div className="text-center sm:text-left">
									<p className="text-xs sm:text-sm text-gray-500">Need help?</p>
									<p className="font-bold text-base sm:text-lg text-[#796146]">
										(808) 555-0111
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* advertisement section */}
			<div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center">
				<p className="text-blue-500">Advertisement Space</p>
			</div>

			{/* meet team */}
			<section className="bg-[#ECE3DA] font-jakarta mt-12 mb-8 px-4 lg:px-8">
				<div className="max-w-7xl mx-auto py-12">
					{/* Header */}
					<div className="flex items-center gap-3 mb-6">
						<div className="w-6 h-6 bg-[#796146] rounded-full flex items-center justify-center">
							<Image
								src="/about/team-icon.svg"
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

			{/* advertisement section */}
			<div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center">
				<p className="text-blue-500">Advertisement Space</p>
			</div>
			{/* Join us today section */}
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
									</p>
								</div>

								{/* Google Sign up button */}
								<button className="w-full bg-black text-white py-3 px-4 rounded-full flex items-center justify-center gap-3 mb-6 hover:bg-gray-800 transition-colors duration-300">
									<Image
										src="/google-icon.svg"
										alt="Google"
										width={20}
										height={20}
									/>
									<span className="font-medium">Sign up with Google</span>
								</button>

								{/* Form */}
								<form className="space-y-4">
									{/* First & Last Name */}
									<div>
										<label className="block text-sm font-medium mb-2">
											First & Last Name
										</label>
										<input
											type="text"
											placeholder="i.e. Devon Lane"
											className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent shadow-lg"
										/>
									</div>

									{/* Email Address */}
									<div>
										<label className="block text-sm font-medium mb-2">
											Email Address
										</label>
										<input
											type="email"
											placeholder="i.e. devon@email.com"
											className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent shadow-lg"
										/>
									</div>

									{/* Password */}
									<div>
										<label className="block text-sm font-medium mb-2">
											Password
										</label>
										<input
											type="password"
											placeholder="••••••••"
											className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent shadow-lg"
										/>
									</div>

									{/* Remember me checkbox */}
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id="remember"
											className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-white/50 shadow-sm"
										/>
										<label htmlFor="remember" className="text-sm">
											Remember me
										</label>
									</div>

									{/* Create Account button */}
									<button
										type="submit"
										className="w-full bg-black text-white py-3 px-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300 mt-6 shadow-lg hover:shadow-xl"
									>
										Create Account
									</button>

									{/* Sign in link */}
									<p className="text-center text-sm mt-4">
										Don't have an account?{" "}
										<a href="#" className="underline hover:no-underline">
											Create free account
										</a>
									</p>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
