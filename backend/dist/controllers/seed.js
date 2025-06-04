// import { PrismaClient } from '../../generated/prisma/index.js';
// import { Request, Response } from 'express';
export {};
// const prisma = new PrismaClient();
// // Express route controller for seeding the database
// export const seedDatabase = async (req: Request, res: Response) => {
//   try {
//     // Create Users
//     const users = await prisma.user.createMany({
//       data: [
//         {
//           name: 'Super Admin',
//           email: 'superadmin@example.com',
//           role: 'SUPER_ADMIN',
//           emailVerified: true,
//           varifiedBySuperAdmin: true,
//           avatar: 'placeholder-user.jpg',
//           bio: 'System super administrator',
//           phone: '9999999999',
//           address: 'HQ, Metropolis',
//           lastLogin: new Date(),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'Library Admin',
//           email: 'admin@library.com',
//           role: 'ADMIN',
//           emailVerified: true,
//           varifiedBySuperAdmin: true,
//           avatar: 'admin-photo.jpg',
//           bio: 'Admin of Central Library',
//           phone: '8888888888',
//           address: '123 Main St, Metropolis',
//           lastLogin: new Date(),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'John Doe',
//           email: 'john@example.com',
//           role: 'MEMBER',
//           emailVerified: true,
//           varifiedBySuperAdmin: false,
//           avatar: 'john.jpg',
//           bio: 'Avid reader and student',
//           phone: '7777777777',
//           address: '456 Side St, Metropolis',
//           lastLogin: new Date(),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'Jane Smith',
//           email: 'jane@example.com',
//           role: 'MEMBER',
//           emailVerified: false,
//           varifiedBySuperAdmin: false,
//           avatar: 'jane.jpg',
//           bio: 'Book lover and forum contributor',
//           phone: '6666666666',
//           address: '789 North Ave, Metropolis',
//           lastLogin: new Date(),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'Emily Clark',
//           email: 'emily@example.com',
//           role: 'MEMBER',
//           emailVerified: true,
//           varifiedBySuperAdmin: false,
//           avatar: 'emily.jpg',
//           bio: 'Library regular and event organizer',
//           phone: '5555555555',
//           address: '321 South Rd, Metropolis',
//           lastLogin: new Date(),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     // Fetch created users for relations
//     const [ admin, john, jane, emily] = await prisma.user.findMany({
//       take: 5,
//       orderBy: { createdAt: 'asc' },
//     });
//     // Create Libraries
//     const libraries = await prisma.library.createMany({
//       data: [
//         {
//           name: 'Central Library',
//           description: 'A public library in the city center.',
//           address: '123 Main St',
//           city: 'Metropolis',
//           state: 'State',
//           country: 'Country',
//           postalCode: '123456',
//           email: 'info@library.com',
//           phone: '1234567890',
//           images: ['library1.jpg'],
//           amenities: ['wifi', 'ac', 'cafe'],
//           totalSeats: 100,
//           adminId: admin.id,
//           status: 'APPROVED',
//           isActive: true,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'Westside Library',
//           description: 'A modern library in the west district.',
//           address: '456 West St',
//           city: 'Metropolis',
//           state: 'State',
//           country: 'Country',
//           postalCode: '654321',
//           email: 'west@library.com',
//           phone: '2222222222',
//           images: ['library2.jpg'],
//           amenities: ['wifi', 'printer'],
//           totalSeats: 60,
//           adminId: admin.id,
//           status: 'APPROVED',
//           isActive: true,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'Eastside Library',
//           description: 'A cozy library in the east district.',
//           address: '789 East St',
//           city: 'Metropolis',
//           state: 'State',
//           country: 'Country',
//           postalCode: '789123',
//           email: 'east@library.com',
//           phone: '3333333333',
//           images: ['library3.jpg'],
//           amenities: ['ac', 'cafe'],
//           totalSeats: 40,
//           adminId: admin.id,
//           status: 'APPROVED',
//           isActive: true,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     const [centralLibrary, westLibrary, eastLibrary] = await prisma.library.findMany({
//       take: 3,
//       orderBy: { createdAt: 'asc' },
//     });
//     // Create Membership Plans
//      await prisma.membershipPlan.createMany({
//       data: [
//         {
//           name: 'Monthly Plan',
//           description: 'Access for one month',
//           price: 500,
//           duration: 30,
//           features: ['Borrow up to 2 books', 'Access to e-library'],
//           allowedBookingsPerMonth: 10,
//           eLibraryAccess: true,
//           maxBorrowedBooks: 2,
//           maxBorrowDuration: 15,
//           isActive: true,
//           libraryId: centralLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'Quarterly Plan',
//           description: 'Access for three months',
//           price: 1200,
//           duration: 90,
//           features: ['Borrow up to 5 books', 'Priority event access'],
//           allowedBookingsPerMonth: 20,
//           eLibraryAccess: true,
//           maxBorrowedBooks: 5,
//           maxBorrowDuration: 30,
//           isActive: true,
//           libraryId: westLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           name: 'Annual Plan',
//           description: 'Access for one year',
//           price: 4000,
//           duration: 365,
//           features: ['Unlimited book borrowing', 'VIP lounge access'],
//           allowedBookingsPerMonth: 50,
//           eLibraryAccess: true,
//           maxBorrowedBooks: 10,
//           maxBorrowDuration: 60,
//           isActive: true,
//           libraryId: eastLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     const [monthlyPlan, quarterlyPlan, annualPlan] = await prisma.membershipPlan.findMany({
//       take: 3,
//       orderBy: { createdAt: 'asc' },
//     });
//     // Create Memberships
//     await prisma.membership.createMany({
//       data: [
//         {
//           startDate: new Date(),
//           endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//           status: 'ACTIVE',
//           autoRenew: true,
//           userId: john.id,
//           libraryId: centralLibrary.id,
//           membershipPlanId: monthlyPlan.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           startDate: new Date(),
//           endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//           status: 'ACTIVE',
//           autoRenew: false,
//           userId: jane.id,
//           libraryId: westLibrary.id,
//           membershipPlanId: quarterlyPlan.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           startDate: new Date(),
//           endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
//           status: 'ACTIVE',
//           autoRenew: true,
//           userId: emily.id,
//           libraryId: eastLibrary.id,
//           membershipPlanId: annualPlan.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     // Create Book Categories
//     await prisma.bookCategory.createMany({
//       data: [
//         { name: 'Fiction', description: 'Fictional books', createdAt: new Date(), updatedAt: new Date() },
//         { name: 'Science', description: 'Science and research', createdAt: new Date(), updatedAt: new Date() },
//         { name: 'History', description: 'Historical books', createdAt: new Date(), updatedAt: new Date() },
//       ],
//     });
//     const [fiction, science, history] = await prisma.bookCategory.findMany({ take: 3, orderBy: { createdAt: 'asc' } });
//     // Create Physical Books
//     await prisma.physicalBook.createMany({
//       data: [
//         {
//           title: 'The Great Gatsby',
//           author: 'F. Scott Fitzgerald',
//           isbn: '9780743273565',
//           coverImage: 'gatsby.jpg',
//           description: 'A classic novel.',
//           publishedYear: 1925,
//           publisher: 'Scribner',
//           pageCount: 180,
//           language: 'English',
//           genre: ['Classic', 'Novel'],
//           tags: ['1920s', 'American'],
//           price: 300,
//           libraryId: centralLibrary.id,
//           categoryId: fiction.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'A Brief History of Time',
//           author: 'Stephen Hawking',
//           isbn: '9780553380163',
//           coverImage: 'hawking.jpg',
//           description: 'Science classic.',
//           publishedYear: 1988,
//           publisher: 'Bantam',
//           pageCount: 256,
//           language: 'English',
//           genre: ['Science'],
//           tags: ['physics', 'cosmology'],
//           price: 400,
//           libraryId: westLibrary.id,
//           categoryId: science.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'Sapiens',
//           author: 'Yuval Noah Harari',
//           isbn: '9780062316097',
//           coverImage: 'sapiens.jpg',
//           description: 'A brief history of humankind.',
//           publishedYear: 2011,
//           publisher: 'Harper',
//           pageCount: 498,
//           language: 'English',
//           genre: ['History'],
//           tags: ['evolution', 'humanity'],
//           price: 500,
//           libraryId: eastLibrary.id,
//           categoryId: history.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     // Create EBooks
//     await prisma.eBook.createMany({
//       data: [
//         {
//           title: 'Digital Fortress',
//           author: 'Dan Brown',
//           isbn: '9780312944926',
//           coverImage: 'fortress.jpg',
//           description: 'A techno-thriller novel.',
//           publishedYear: 1998,
//           publisher: 'St. Martin’s Press',
//           pageCount: 384,
//           language: 'English',
//           genre: ['Thriller', 'Tech'],
//           tags: ['encryption', 'mystery'],
//           fileUrl: 'ebooks/fortress.pdf',
//           fileFormat: 'pdf',
//           fileSize: 2048,
//           price: 200,
//           isPremium: false,
//           isActive: true,
//           status: 'AVAILABLE',
//           categoryId: fiction.id,
//           libraryId: centralLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'The Selfish Gene',
//           author: 'Richard Dawkins',
//           isbn: '9780199291151',
//           coverImage: 'selfishgene.jpg',
//           description: 'Evolutionary biology classic.',
//           publishedYear: 1976,
//           publisher: 'Oxford',
//           pageCount: 360,
//           language: 'English',
//           genre: ['Science'],
//           tags: ['evolution', 'biology'],
//           fileUrl: 'ebooks/selfishgene.pdf',
//           fileFormat: 'pdf',
//           fileSize: 1500,
//           price: 250,
//           isPremium: true,
//           isActive: true,
//           status: 'AVAILABLE',
//           categoryId: science.id,
//           libraryId: westLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'Guns, Germs, and Steel',
//           author: 'Jared Diamond',
//           isbn: '9780393317558',
//           coverImage: 'ggs.jpg',
//           description: 'A history of societies.',
//           publishedYear: 1997,
//           publisher: 'W. W. Norton',
//           pageCount: 480,
//           language: 'English',
//           genre: ['History'],
//           tags: ['civilization', 'geography'],
//           fileUrl: 'ebooks/ggs.pdf',
//           fileFormat: 'pdf',
//           fileSize: 1800,
//           price: 300,
//           isPremium: false,
//           isActive: true,
//           status: 'AVAILABLE',
//           categoryId: history.id,
//           libraryId: eastLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     // Create Forum Categories
//     await prisma.forumCategory.createMany({
//       data: [
//         { name: 'General Discussion', description: 'General topics and chat', icon: 'chat', order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
//         { name: 'Book Reviews', description: 'Share your book reviews', icon: 'star', order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
//         { name: 'Events', description: 'Discuss library events', icon: 'event', order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
//       ],
//     });
//     const [generalCat, reviewCat, eventCat] = await prisma.forumCategory.findMany({ take: 3, orderBy: { createdAt: 'asc' } });
//     // Create Forum Posts
//      await prisma.forumPost.createMany({
//       data: [
//         {
//           title: 'Welcome to the forum!',
//           content: 'Introduce yourself here.',
//           tags: ['welcome', 'intro'],
//           authorId: john.id,
//           categoryId: generalCat.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'Best Book of 2024?',
//           content: 'What is your favorite book this year?',
//           tags: ['books', '2024'],
//           authorId: jane.id,
//           categoryId: reviewCat.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'Upcoming Events',
//           content: 'Share info about library events.',
//           tags: ['events', 'library'],
//           authorId: emily.id,
//           categoryId: eventCat.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     // Fetch created forum posts for comment relations
//     const forumPostsList = await prisma.forumPost.findMany({ take: 3, orderBy: { createdAt: 'asc' } });
//     // Create Forum Comments (with correct string IDs)
//     await prisma.forumComment.createMany({
//       data: [
//         { content: 'Glad to be here!', authorId: john.id, postId: forumPostsList[0].id, createdAt: new Date(), updatedAt: new Date() },
//         { content: 'I loved "Sapiens"!', authorId: jane.id, postId: forumPostsList[1].id, createdAt: new Date(), updatedAt: new Date() },
//         { content: 'Looking forward to the next event.', authorId: emily.id, postId: forumPostsList[2].id, createdAt: new Date(), updatedAt: new Date() },
//       ],
//     });
//     // Create Seat Prices
//     await prisma.seatPrice.createMany({
//       data: [
//         { seatType: 'REGULAR', price: 50, currency: 'INR', isHourly: true, libraryId: centralLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//         { seatType: 'QUIET_ZONE', price: 70, currency: 'INR', isHourly: true, libraryId: westLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//         { seatType: 'COMPUTER', price: 100, currency: 'INR', isHourly: true, libraryId: eastLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//       ],
//     });
//     // Create Seats
//     await prisma.seat.createMany({
//       data: [
//         { name: 'A-001', seatType: 'REGULAR', floor: 1, section: 'A', isAvailable: true, isActive: true, libraryId: centralLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//         { name: 'B-101', seatType: 'QUIET_ZONE', floor: 2, section: 'B', isAvailable: true, isActive: true, libraryId: westLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//         { name: 'C-201', seatType: 'COMPUTER', floor: 3, section: 'C', isAvailable: true, isActive: true, libraryId: eastLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//       ],
//     });
//     const [seat1, seat2, seat3] = await prisma.seat.findMany({ take: 3, orderBy: { createdAt: 'asc' } });
//     // Create Seat Bookings
//     await prisma.seatBooking.createMany({
//       data: [
//         { date: new Date(), startTime: '10:00', endTime: '12:00', duration: 2, bookingPrice: 100, currency: 'INR', status: 'CONFIRMED', userId: john.id, seatId: seat1.id, libraryId: centralLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//         { date: new Date(), startTime: '13:00', endTime: '15:00', duration: 2, bookingPrice: 140, currency: 'INR', status: 'CONFIRMED', userId: jane.id, seatId: seat2.id, libraryId: westLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//         { date: new Date(), startTime: '16:00', endTime: '18:00', duration: 2, bookingPrice: 200, currency: 'INR', status: 'CONFIRMED', userId: emily.id, seatId: seat3.id, libraryId: eastLibrary.id, createdAt: new Date(), updatedAt: new Date() },
//       ],
//     });
//     // Create Notification for John
//     await prisma.notification.create({
//       data: {
//         title: 'Welcome!',
//         message: 'Thanks for joining the library.',
//         type: 'INFO',
//         isRead: false,
//         userId: john.id,
//         createdAt: new Date(),
//       },
//     });
//     // Create Events
//     await prisma.event.createMany({
//       data: [
//         {
//           title: 'Book Reading',
//           description: 'Join us for a book reading event.',
//           startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//           endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
//           location: 'Main Hall',
//           isPublic: true,
//           libraryId: centralLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'Science Fair',
//           description: 'Annual science fair for all ages.',
//           startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
//           endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
//           location: 'Westside Hall',
//           isPublic: true,
//           libraryId: westLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'History Seminar',
//           description: 'Seminar on world history.',
//           startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
//           endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
//           location: 'Eastside Conference Room',
//           isPublic: true,
//           libraryId: eastLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     // Create Announcements
//     await prisma.announcement.createMany({
//       data: [
//         {
//           title: 'Library Renovation',
//           content: 'The library will be renovated next month.',
//           isPublic: true,
//           isPinned: true,
//           libraryId: centralLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'New Books Arrival',
//           content: 'Check out the latest arrivals in our collection.',
//           isPublic: true,
//           isPinned: false,
//           libraryId: westLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           title: 'Holiday Notice',
//           content: 'Library will be closed for holidays.',
//           isPublic: true,
//           isPinned: false,
//           libraryId: eastLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     // Create Reviews
//     await prisma.review.createMany({
//       data: [
//         {
//           rating: 5,
//           comment: 'Excellent library!',
//           userId: john.id,
//           libraryId: centralLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           rating: 4,
//           comment: 'Great selection of science books.',
//           userId: jane.id,
//           libraryId: westLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           rating: 5,
//           comment: 'Cozy and quiet place to study.',
//           userId: emily.id,
//           libraryId: eastLibrary.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ],
//     });
//     res.status(200).json({ message: 'Database seeded successfully.' });
//   } catch (error) {
//     console.error("Error during seeding:", error);
//     res.status(500).json({ error: 'Error during seeding', details: error instanceof Error ? error : error });
//   }
// };
//# sourceMappingURL=seed.js.map