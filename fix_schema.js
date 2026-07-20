const fs = require('fs');
const path = 'api/prisma/schema.prisma';
const content = fs.readFileSync(path, 'utf8');

// The file currently has duplicate CustomerBooking blocks.
// I will find the LAST instance of CustomerBooking and remove it, along with its siblings until BookingCargo.

const lines = content.split('\n');

let duplicateStart = -1;
let firstCustomerBookingFound = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('model CustomerBooking {')) {
    if (!firstCustomerBookingFound) {
      firstCustomerBookingFound = true;
    } else {
      duplicateStart = i;
      break;
    }
  }
}

if (duplicateStart !== -1) {
  // Find where the duplicate block ends. The duplicate block ends after BookingCargo.
  // BUT in the current file, BookingCargo might be followed by RateCard.
  // So let's find the first RateCard or just look for the end of BookingCargo.
  let duplicateEnd = -1;
  let inBookingCargo = false;
  for (let i = duplicateStart; i < lines.length; i++) {
    if (lines[i].includes('model BookingCargo {')) {
      inBookingCargo = true;
    }
    if (inBookingCargo && lines[i].startsWith('}')) {
      duplicateEnd = i;
      break;
    }
  }
  
  if (duplicateEnd !== -1) {
    // Also remove the "model BookingBillTo {" that is corrupted right before it
    // Wait, the easiest way is to just rebuild the file from scratch using regex to remove the duplicate block completely.
    lines.splice(duplicateStart - 4, (duplicateEnd - duplicateStart + 5));
    fs.writeFileSync(path, lines.join('\n'));
    console.log('Removed duplicate block');
  }
}
