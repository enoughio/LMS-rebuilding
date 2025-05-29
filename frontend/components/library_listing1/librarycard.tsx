  import Image from 'next/image';
  import { ArrowRight, Star } from 'lucide-react';
  import Link from 'next/link';

  // Server component - no 'use client' directive


  const renderStars = (rating: number) => {
    const stars = [];
    // const fullStars = Math.floor(rating);
    const fullStars = 4;
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star size={16} className="text-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }

    return stars;
  };

  const getOpeningHoursDisplay = (openingHours: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[]) => {
    // Get current day (0 = Sunday, 1 = Monday, etc.)
    const today = new Date().getDay();
    const todayHours = openingHours.find((oh) => oh.dayOfWeek === today);
    if (!todayHours || todayHours.isClosed) {
      return 'Open';
    }
    return `${todayHours.openTime} - ${todayHours.closeTime}`;
  };

  export default function LibraryCard({libraries}: { libraries: any[] }) {

    if (!libraries || libraries.length === 0) {
      return <div className="p-4">No libraries found.</div>;
    }

    return (
      <div className="flex flex-col gap-4">
        {libraries.map((lib: any) => (
          <div
            key={lib.id}
            className="w-full p-1 bg-white md:p-3 lg:p-5 rounded-lg shadow-md transition-transform duration-300 hover:shadow-2xl hover:shadow-amber-200/40 hover:scale-[1.01]"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Image Section */}
              <div className="relative w-full md:w-[140px] h-[180px] md:h-[160px] flex-shrink-0">
                <Image
                  src={lib.images && lib.images.length > 0 ? lib.images[0] : '/placeholder-library.jpg'}
                  alt={lib.name}
                  fill
                  className="rounded-md object-cover"
                />

                {/* Name & Location on image (Mobile only) */}
                <div className="absolute bottom-2 left-2 md:hidden text-white drop-shadow-md">
                  <h1 className="text-lg font-semibold">{lib.name}</h1>
                  <div className="flex items-center gap-1 text-sm">
                    <Image src="/listings3/location.png" alt="location" width={14} height={14} />
                    <p>{lib.city}, {lib.state}</p>
                  </div>
                </div>

                {/* Open/Closed Badge */}
                <div className="absolute top-2 left-2 bg-white blue-black px-2 py-1 text-xs rounded-md">
                  {lib.isActive ? getOpeningHoursDisplay(lib.openingHours) : "Open"}
                </div>

                {/* Like Icon */}
                <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                  <Image src="/listings3/like.png" alt="like" width={20} height={20} />
                </div>
              </div>

              {/* Right Content */}
              <div className="flex flex-col sm:flex-row justify-between w-full">
                {/* Top Section */}
                <div className="space-y-2">
                  {/* Desktop Name + Location */}
                  <div className="hidden md:block">
                    <h1 className="text-lg font-semibold">{lib.name}</h1>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <Image src="/placeholder.jpg" alt="location" width={14} height={14} />
                      <p>{lib.city}, {lib.state}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(lib.rating || 0)}</div>
                    <p className="text-sm text-gray-500">({lib.reviewCount || 0} reviews)</p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {lib.amenities &&
                      lib.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1">
                          <Image src="/listings3/wifi.png" alt={amenity} width={14} height={14} />
                          <p>{amenity}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-end md:mt-1 mt-2 w-full">
                  {/* Left section: Hours, Seats, Membership - for mobile only */}
                  <div className="flex flex-wrap gap-2 md:hidden">
                    <div className="rounded-md bg-gray-100 px-3 py-1">{getOpeningHoursDisplay(lib.openingHours)}</div>
                    <div className="rounded-md bg-green-100 text-green-700 px-3 py-1">
                      {lib.availableSeats} seats
                    </div>
                    <div className="rounded-md px-3 py-1 bg-blue-100 text-blue-700">
                      {lib.membershipPlans && lib.membershipPlans.length > 0 ? 'Paid' : 'Free'}
                    </div>
                    <Link href={`/libraries/${lib.id}`} className="w-full">
                      <button className="flex w-full items-center justify-center gap-1 bg-black text-white px-4 py-2 rounded-md transform transition-transform duration-200 hover:scale-95 active:scale-90">
                        Book Now
                        <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>

                  {/* Right section: Hours, Seats, Membership - for md and up */}
                  <div className="hidden md:flex flex-col items-end gap-2">
                    <div className="rounded-md bg-gray-100 px-3 py-1">{getOpeningHoursDisplay(lib.openingHours)}</div>
                    <div className="rounded-md bg-green-100 text-green-700 px-3 py-1">
                      {lib.availableSeats} seats
                    </div>
                    <div className="rounded-md px-3 py-1 bg-blue-100 text-blue-700">
                      {lib.membershipPlans && lib.membershipPlans.length > 0 ? 'Paid' : 'Free'}
                    </div>
                    <Link href={`/libraries/${lib.id}`}>
                      <button className="flex items-center justify-center gap-1 bg-black text-white px-4 py-2 rounded-md transform transition-transform duration-200 hover:scale-95 active:scale-90">
                        Book Now
                        <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
