const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/model Vendor \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  quotations VendorQuotation[]\n  catalogs VendorProductCatalog[]\n  priceLists VendorPriceList[]\n  poInteractions VendorPOInteraction[]\n  contractAcknowledgments VendorContractAcknowledge[]\n}');
});

schema = schema.replace(/model ProcurementRFQ \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  vendorQuotations VendorQuotation[]\n}');
});

schema = schema.replace(/model ProcurementRFQItem \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  vendorQuotationItems VendorQuotationItem[]\n}');
});

schema = schema.replace(/model PurchaseOrder \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  vendorInteractions VendorPOInteraction[]\n}');
});

schema = schema.replace(/model VendorContract \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  acknowledgments VendorContractAcknowledge[]\n}');
});

fs.writeFileSync('prisma/schema.prisma', schema);
