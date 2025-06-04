// "use server"
// import { revalidatePath } from "next/cache"
// import { getCurrentUser } from "./auth-actions"

// export async function getLibraries(filters?: {
//   search?: string
//   amenities?: string[]
//   rating?: number
// }) {
//   try {
//     // In a real app, we would use Prisma to fetch libraries
//     // const libraries = await prisma.library.findMany({
//     //   where: {
//     //     ...(filters?.search && {
//     //       OR: [
//     //         { name: { contains: filters.search, mode: "insensitive" } },
//     //         { address: { contains: filters.search, mode: "insensitive" } },
//     //       ],
//     //     }),
//     //     ...(filters?.amenities?.length && {
//     //       amenities: { hasEvery: filters.amenities },
//     //     }),
//     //     ...(filters?.rating && { rating: { gte: filters.rating } }),
//     //   },
//     //   include: {
//     //     membershipPlans: true,
//     //   },
//     // })

//     // For now, we'll return mock data
//     return { success: true, data: [] }
//   } catch (error) {
//     console.error("Error fetching libraries:", error)
//     return { error: "Failed to fetch libraries" }
//   }
// }

// export async function getLibraryById(id: string) {
//   try {
//     // In a real app, we would use Prisma to fetch the library
//     // const library = await prisma.library.findUnique({
//     //   where: { id },
//     //   include: {
//     //     membershipPlans: true,
//     //   },
//     // })

//     // if (!library) {
//     //   return { error: "Library not found" }
//     // }

//     // For now, we'll return mock data
//     return { success: true, data: null }
//   } catch (error) {
//     console.error("Error fetching library:", error)
//     return { error: "Failed to fetch library" }
//   }
// }

// export async function createLibrary(formData: FormData) {
//   const user = await getCurrentUser()

//   if (!user || user.role !== "SUPER_ADMIN") {
//     return { error: "Unauthorized" }
//   }

//   const name = formData.get("name") as string
//   const description = formData.get("description") as string
//   const address = formData.get("address") as string
//   const ownerEmail = formData.get("ownerEmail") as string
//   const amenities = formData.getAll("amenities") as string[]
//   const totalSeats = Number.parseInt(formData.get("totalSeats") as string)

//   if (!name || !description || !address || !ownerEmail || amenities.length === 0 || !totalSeats) {
//     return { error: "All required fields must be provided" }
//   }

//   try {
//     // In a real app, we would use Prisma to create the library
//     // const owner = await prisma.user.findUnique({ where: { email } })

//     // if (!owner) {
//     //   return { error: "Owner not found" }
//     // }

//     // const library = await prisma.library.create({
//     //   data: {
//     //     name,
//     //     description,
//     //     address,
//     //     amenities,
//     //     totalSeats,
//     //     availableSeats: totalSeats,
//     //     ownerId: owner.id,
//     //     images: [],
//     //     openingHours: {
//     //       monday: { open: "09:00", close: "18:00" },
//     //       tuesday: { open: "09:00", close: "18:00" },
//     //       wednesday: { open: "09:00", close: "18:00" },
//     //       thursday: { open: "09:00", close: "18:00" },
//     //       friday: { open: "09:00", close: "18:00" },
//     //       saturday: { open: "10:00", close: "16:00" },
//     //       sunday: { open: "closed", close: "closed" },
//     //     },
//     //   },
//     // })

//     revalidatePath("/dashboard/SUPER_ADMIN/libraries")
//     return { success: true }
//   } catch (error) {
//     console.error("Error creating library:", error)
//     return { error: "Failed to create library" }
//   }
// }

// export async function updateLibrary(id: string, formData: FormData) {
//   const user = await getCurrentUser()

//   if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
//     return { error: "Unauthorized" }
//   }

//   try {
//     // In a real app, we would use Prisma to update the library
//     // const library = await prisma.library.findUnique({ where: { id } })

//     // if (!library) {
//     //   return { error: "Library not found" }
//     // }

//     // if (user.role === "ADMIN" && library.ownerId !== user.id) {
//     //   return { error: "You can only update your own library" }
//     // }

//     // const updatedLibrary = await prisma.library.update({
//     //   where: { id },
//     //   data: {
//     //     name: formData.get("name") as string || undefined,
//     //     description: formData.get("description") as string || undefined,
//     //     address: formData.get("address") as string || undefined,
//     //     amenities: formData.getAll("amenities") as string[] || undefined,
//     //   },
//     // })

//     revalidatePath(`/dashboard/admin/library-profile`)
//     revalidatePath(`/dashboard/SUPER_ADMIN/libraries/${id}`)
//     return { success: true }
//   } catch (error) {
//     console.error("Error updating library:", error)
//     return { error: "Failed to update library" }
//   }
// }

// export async function deleteLibrary(id: string) {
//   const user = await getCurrentUser()

//   if (!user || user.role !== "SUPER_ADMIN") {
//     return { error: "Unauthorized" }
//   }

//   try {
//     // In a real app, we would use Prisma to delete the library
//     // await prisma.library.delete({ where: { id } })

//     revalidatePath("/dashboard/SUPER_ADMIN/libraries")
//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting library:", error)
//     return { error: "Failed to delete library" }
//   }
// }
