const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/model Vendor \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  financeInvoices VendorFinanceInvoice[]\n  financePayments VendorFinancePayment[]\n  financeLedgerEntries VendorFinanceLedger[]\n  taxDocuments VendorTaxDocument[]\n}');
});

schema = schema.replace(/model PurchaseOrder \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  vendorFinanceInvoices VendorFinanceInvoice[]\n}');
});

fs.writeFileSync('prisma/schema.prisma', schema);
