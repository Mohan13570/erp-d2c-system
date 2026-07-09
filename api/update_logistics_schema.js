const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/model Vendor \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  asnInteractions VendorASNInteraction[]\n  deliveryAppointments VendorDeliveryAppointment[]\n  shipmentTrackings VendorShipmentTracking[]\n  grnVisibilities VendorGRNVisibility[]\n}');
});

schema = schema.replace(/model AdvanceShipmentNotice \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  vendorInteractions VendorASNInteraction[]\n  vendorAppointments VendorDeliveryAppointment[]\n  vendorTrackings VendorShipmentTracking[]\n}');
});

schema = schema.replace(/model DockSchedule \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  vendorAppointments VendorDeliveryAppointment[]\n}');
});

schema = schema.replace(/model GoodsReceiptNote \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  vendorVisibilities VendorGRNVisibility[]\n}');
});

fs.writeFileSync('prisma/schema.prisma', schema);
