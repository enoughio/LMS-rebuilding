
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import LibraryFeatures from "@/components/library_listing3/library_features";
import LibraryGallery from "@/components/library_listing3/library_gallery";
import LibraryRules from "@/components/library_listing3/library_rules";
import Link from "next/link";
import toast from "react-hot-toast";

// Define the Seat type based on the updated API response
type Seat = {
  category: string;
  price: number;
  availableSeats: number;
};

// Define the Library type based on the API response
type Library = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
  website: string;
  images: string[];
  rating: number;
  reviewCount: number;
  amenities: string[];
  totalSeats: number;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  adminId: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
  membershipPlans: any[];
  seats: Seat[];
  openingHours: any[];
};

// Define PageProps
type PageProps = {
  params: {
    id: string;
    name: string;
  };
};

async function FetchLibraryInfo(params: string): Promise<Library> {
  
  const libraryData = await fetch(
    `${process.env.NODE_BACKEND_URL || "http://localhost:5000"}/api/library/${params}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!libraryData.ok) {
    throw new Error("Failed to fetch library data");
  }

  const data = await libraryData.json();
  return data.library;
}

// SeatSelection component to display seat categories
function SeatSelection({ seats, libraryId, libraryName }: { seats: Seat[]; libraryId: string; libraryName: string }) {
  return (
    <div className="seat-selection mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Select a Seat</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seats.map((seat) => (
          <Link
            key={seat.category}
            href={`/libraries/${libraryId}/seat/booking?category=${encodeURIComponent(seat.category)}`}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col">
              <h3 className="text-lg font-medium">{seat.category}</h3>
              <p className="text-sm text-gray-600">Price: ${seat.price}</p>
              <p className="text-sm text-gray-600">Available Seats: {seat.availableSeats}</p>
              <div className="mt-2 flex items-center text-[#099C6F] hover:underline">
                Book Now <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function Page({ params }: PageProps) {
  const { id, name } = params;

  const fetchData = async (id: string): Promise<Library | null> => {
    try {
      const libraryInfo = await FetchLibraryInfo(id);
      return libraryInfo;
    } catch (error) {
      console.error("Error fetching library data:", error);
      toast.error("Failed to fetch library data", {
        position: "top-right",
      });
      return null;
    }
  };

  const Library = await fetchData(id);

  if (!Library) {
    return <div className="p-4">No library found.</div>;
  }

  // Calculate distance (placeholder logic, replace with actual calculation if available)
  const distance = "2 km away";

  // Determine open status and closing time (placeholder logic based on openingHours)
  const isOpen = true; // Assume open for now; update with openingHours logic
  const closingTime = "Closes in 5 hours"; // Placeholder

  // Determine entry status
  const hasMembership = Library.membershipPlans.length > 0;
  const entryStatus = hasMembership ? "Membership available" : "Free Entry";

  return (
    <div className="bg-[#ECE3DA] max-w-[1920px] lg:overflow-x-auto">
      <div className="main_section relative px-3 sm:px-5 md:px-8 lg:px-[10%] bg-[#ECE3DA] min-h-screen w-full">
        {/* library_information */}
        <div className="w-full mt-8 sm:mt-10 md:mt-12 lg:mt-14 p-2 sm:p-3 md:p-4 relative rounded-md bg-white mb-10 sm:mb-14 md:mb-16 lg:mb-20">
          {/* about study hub */}
          <div className="about_image relative">
            {/* Image */}
            <div className="w-full h-[200px] sm:h-[230px] relative rounded-md overflow-hidden">
              <Image
                src={"/what.png"}
                alt={Library.name}
                fill
                className="object-fit object-center"
                sizes="(max-width: 640px) 100vw, 1000px"
                priority
              />
            </div>

            {/* Responsive Info Box */}
            <div className="w-[80%] p-2 sm:w-[75%] md:w-[90%] lg:w-[75%] mx-auto absolute left-0 right-0 top-[75%] sm:top-[90%] z-10 shadow-md rounded-lg text-black bg-white flex">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-[1px] p-1 rounded-md">
                {/* Location */}
                <div className="flex gap-1 bg-white rounded-md">
                  <Image
                    src="/listings3/location.png"
                    alt="Location"
                    width={16}
                    height={20}
                    className="mt-0.5 flex-shrink-0 w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-[10px] lg:text-xs font-semibold truncate">
                      {`${Library.city}, ${Library.state}`}
                    </p>
                    <p className="text-[8px] md:text-[8px] lg:text-[10px] text-gray-400">{distance}</p>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-start gap-1 bg-white rounded-md">
                  <Image
                    src="/listings3/clock.png"
                    alt="Time"
                    width={16}
                    height={16}
                    className="mt-0.5 flex-shrink-0 w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-[10px] lg:text-xs font-semibold truncate">
                      {Library.openingHours.length > 0 ? Library.openingHours[0] : "8:00 am to 9:00 pm"}
                    </p>
                    <p className="text-[8px] md:text-[8px] lg:text-[10px] text-gray-400">{closingTime}</p>
                  </div>
                </div>

                {/* Entry Info */}
                <div className="flex items-start gap-1 bg-white rounded-md">
                  <Image
                    src="/listings3/tag.png"
                    alt="Entry"
                    width={16}
                    height={16}
                    className="mt-0.5 flex-shrink-0 w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-[10px] lg:text-xs font-semibold truncate">
                      {hasMembership ? "Membership Required" : "Free Entry"}
                    </p>
                    <p className="text-[8px] md:text-[8px] lg:text-[10px] text-gray-400">{entryStatus}</p>
                  </div>
                </div>

                {/* Booking & Seats */}
                <div className="flex flex-start items-center p-1 gap-2 rounded-md">
                  <div className="flex items-center gap-1">
                    <Image
                      src="/listings3/seats.png"
                      alt="Seats"
                      width={16}
                      height={16}
                      className="flex-shrink-0 w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4"
                    />
                    <p className="text-[10px] md:text-[10px] lg:text-xs font-light text-[#099C6F] whitespace-nowrap">
                      {Library.seats.reduce((sum, seat) => sum + seat.availableSeats, 0)} Seats Available
                    </p>
                  </div>

                  <Link href={`/libraries/${params.id}/seats`} className="w-full sm:w-auto md:w-full lg:w-auto">
                    <div className="flex items-center justify-center gap-1 px-2 py-1 rounded-full text-white bg-gray-800 hover:bg-gray-700 hover:underline cursor-pointer text-nowrap transition-colors text-[10px] md:text-[11px] lg:text-[12px] font-medium">
                      Book Now
                      <ArrowRight className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Info Part */}
            <div className="info2 absolute w-full top-[15%] sm:top-[10px] md:top-[10%] lg:top-[15%] p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="left_part w-full">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-1 sm:px-2 md:px-4">
                  <div className="flex items-center gap-1 bg-white px-2 py-1 sm:px-4 sm:py-1 md:px-6 md:py-2 rounded-full text-xs sm:text-sm font-medium text-green-700">
                    <Image src="/listings3/open.png" alt="Open Icon" width={12} height={12} />
                    {isOpen ? "Open Now" : "Closed"}
                  </div>

                  <div className="bg-[#9DCFF3] px-2 py-1 sm:px-4 sm:py-1 md:px-6 md:py-2 rounded-full text-xs sm:text-sm font-medium text-gray-800">
                    Public Library
                  </div>
                </div>

                {/* Title */}
                <div className="heading mt-1 sm:mt-2">
                  <h1 className="font-urbanist font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-[56.19px] leading-tight text-white">
                    {Library.name}
                  </h1>
                </div>

                {/* Rating and Like */}
                <div className="flex flex-col sm:flex-row w-full justify-between items-start relative sm:items-center mt-1 sm:mt-0">
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-800">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex text-yellow-400 text-base sm:text-lg">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i}>{i < Math.round(Library.rating) ? "★" : "☆"}</span>
                          ))}
                      </div>
                      <p className="text-white text-xs sm:text-sm">({Library.reviewCount} reviews)</p>
                    </div>

                    <div>
                      <p className="text-white text-xs sm:text-sm">{Library.totalSeats}+ Daily Visitors</p>
                    </div>
                  </div>

                  <div className="bg-white absolute p-1 top-[-3%] right-2 sm:p-2 md:p-3 lg:p-4 rounded-md mt-2 sm:mt-0">
                    <Image src="/listings3/like.png" alt="like image" width={18} height={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* library features and all */}
          <div className="flex flex-col sm:flex-row mt-24 sm:mt-32 md:mt-28 lg:mt-16 mb-5 justify-between gap-4 sm:gap-6">
            <div className="left_features w-full sm:w-[68%] md:w-[70%]">
              <div className="library_features">
                <LibraryFeatures />
                <LibraryGallery />
                <LibraryRules />
                <SeatSelection seats={Library.seats} libraryId={Library.id} libraryName={Library.name} />
                {hasMembership && (
                  <div className="membership mt-8">
                    <Link
                      href={`/libraries/${Library.id}/membership`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Become a Member
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="location_right w-full sm:w-[30%] flex flex-col gap-4 sm:gap-6">
              {/* <LocationCard /> */}
              <div className="adv border border-gray-200 rounded-lg flex items-center justify-center h-[200px] sm:h-[300px] md:h-[500px] lg:h-[700px]">
                Ads
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
