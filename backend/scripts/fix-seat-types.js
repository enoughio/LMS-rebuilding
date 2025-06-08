const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSeatTypes() {
  try {
    console.log('Checking seats with null seatTypeId...');
    
    // Find seats with null seatTypeId
    const problematicSeats = await prisma.seat.findMany({
      where: {
        seatTypeId: null
      },
      include: {
        library: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    console.log(`Found ${problematicSeats.length} seats with null seatTypeId`);
    
    if (problematicSeats.length > 0) {
      console.log('Seats with null seatTypeId:');
      problematicSeats.forEach(seat => {
        console.log(`- Seat ID: ${seat.id}, Name: ${seat.name}, Library: ${seat.library?.name || 'Unknown'}`);
      });
      
      // Find existing seat types for each library
      for (const seat of problematicSeats) {
        const libraryId = seat.libraryId;
        
        // Get the first available seat type for this library
        const defaultSeatType = await prisma.seatType.findFirst({
          where: {
            libraryId: libraryId,
            isActive: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        });
        
        if (defaultSeatType) {
          console.log(`Updating seat ${seat.name} to use seat type: ${defaultSeatType.name}`);
          
          await prisma.seat.update({
            where: {
              id: seat.id
            },
            data: {
              seatTypeId: defaultSeatType.id
            }
          });
        } else {
          console.log(`No seat type found for library ${seat.library?.name}. Creating a default one...`);
          
          // Create a default seat type for this library
          const newSeatType = await prisma.seatType.create({
            data: {
              name: 'REGULAR',
              pricePerHour: 50,
              description: 'Standard seating area',
              color: '#3B82F6',
              amenities: ['Basic seating', 'Desk space'],
              libraryId: libraryId,
              isActive: true
            }
          });
          
          console.log(`Created default seat type: ${newSeatType.name}`);
          
          // Now update the seat
          await prisma.seat.update({
            where: {
              id: seat.id
            },
            data: {
              seatTypeId: newSeatType.id
            }
          });
          
          console.log(`Updated seat ${seat.name} to use new seat type`);
        }
      }
      
      console.log('All seats have been updated with valid seatTypeId');
    } else {
      console.log('No seats with null seatTypeId found');
    }
    
    // Verify the fix
    const remainingProblematicSeats = await prisma.seat.count({
      where: {
        seatTypeId: null
      }
    });
    
    if (remainingProblematicSeats === 0) {
      console.log('✅ Database issue fixed successfully!');
    } else {
      console.log(`❌ ${remainingProblematicSeats} seats still have null seatTypeId`);
    }
    
  } catch (error) {
    console.error('Error fixing seat types:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSeatTypes();
