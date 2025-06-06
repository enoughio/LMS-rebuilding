"use client";
import AboutHeader from "@/components/about/AboutHeader";
import StudentAddaDrives from "@/components/about/StudentAddaDrives";
import SuccessStory from "@/components/about/SuccessStory";
import OurStory from "@/components/about/OurStory";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import Advertisement from "@/components/about/Advertisement";
import JoinUs from "@/components/about/JoinUs";

export default function Story() {
	return (
		<div className="bg-[#ECE3DA] min-h-screen w-full py-6 px-3 md:px-[1%] lg:px-[8%] font-urbanist">
			{/* about us section */}
			<AboutHeader />

			{/* what drives student adda */}
			<StudentAddaDrives />

			{/* Success Story Section */}
			<SuccessStory />

			{/* advertisement section */}
			<Advertisement />

			{/* story section */}
			<OurStory />

			{/*why choose us section*/}
			<WhyChooseUs />

			{/* advertisement section */}
			<Advertisement />
			
			{/* Join us today section */}
			<JoinUs />
		</div>
	);
}
