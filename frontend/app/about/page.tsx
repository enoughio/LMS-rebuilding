
import AboutUs from "@/components/about/aboutus";
import Story11 from "@/components/about/story";
import ContactUs from "@/components/about/contactus";
import Drives from "@/components/about/drivesstudent";
import Team from "@/components/about/team";
import Companion from "@/components/about/companion";

export default function Story() {
    return (
        <div className="bg-[#ECE3DA] min-h-screen max-w-[1920px] lg:overflow-x-auto py-6 px-3 md:px-[1%] lg:px-[8%] font-urbanist">

           <AboutUs/>

           {/* what drives student adda */}

           <Drives/>

            {/* advertisement section */}
            <div className="w-full bg-white h-40 my-8 flex items-center justify-center">
              Advertisement 
            </div>

            <Story11/>



            {/* advertisement section */}
            <div className="w-full bg-white h-40 my-8 flex items-center justify-center">
                <p className="text-blue-500">Advertisement Space</p>
            </div>

            {/* meet team */}

            <Companion/>
            <Team/>



            {/* advertisement section */}
            <div className="w-full bg-white h-40 my-8 flex items-center justify-center">
                <p className="text-blue-500">Advertisement Space</p>
            </div>


            {/* section join us today */}

            <ContactUs/>


        </div>
    );
}