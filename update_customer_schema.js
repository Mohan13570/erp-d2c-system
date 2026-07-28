const fs = require('fs');
const path = 'api/prisma/schema.prisma';
let content = fs.readFileSync(path, 'utf8');

// Inject into CustomerBooking
content = content.replace(
  `  // Additional Info
  bookingNotes    String?
  specialInstructions String?

  // Timestamps`,
  `  // Additional Info
  bookingNotes    String?
  specialInstructions String?
  incoterms       String?
  shipmentValue   Float?
  insurance       Boolean  @default(false)

  // Timestamps`
);

// Inject into BookingCargo
content = content.replace(
  `  length          Float?
  width           Float?
  height          Float?
}`,
  `  length          Float?
  width           Float?
  height          Float?
  
  isStackable     Boolean @default(false)
  temperatureControl Boolean @default(false)
  isDangerousGoods Boolean @default(false)
  insuranceValue  Float?
  remarks         String?
}`
);

fs.writeFileSync(path, content);
console.log('Schema updated successfully');
