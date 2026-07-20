import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import bwipjs from 'bwip-js/browser';

export const generateCommercialInvoice = (data: any, bookingId: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // LIZOME Blue
  doc.text('COMMERCIAL INVOICE', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice No: INV-${bookingId}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
  doc.text(`Booking Ref: ${bookingId}`, 14, 40);

  // Addresses
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  // Sender
  doc.setFont(undefined, 'bold');
  doc.text('Shipper / Exporter:', 14, 55);
  doc.setFont(undefined, 'normal');
  doc.text(data.senderDetails.companyName || 'N/A', 14, 62);
  doc.text(data.senderDetails.line1 || 'N/A', 14, 68);
  doc.text(`${data.senderDetails.city}, ${data.senderDetails.country} - ${data.senderDetails.postalCode}`, 14, 74);
  
  // Receiver
  doc.setFont(undefined, 'bold');
  doc.text('Consignee / Receiver:', 110, 55);
  doc.setFont(undefined, 'normal');
  doc.text(data.receiverDetails.companyName || 'N/A', 110, 62);
  doc.text(data.receiverDetails.line1 || 'N/A', 110, 68);
  doc.text(`${data.receiverDetails.city}, ${data.receiverDetails.country} - ${data.receiverDetails.postalCode}`, 110, 74);

  // Shipment Details
  doc.setFont(undefined, 'bold');
  doc.text('Shipment Details:', 14, 90);
  doc.setFont(undefined, 'normal');
  doc.text(`Mode: ${data.bookingInfo.serviceType}`, 14, 97);
  doc.text(`Trade Term: ${data.bookingInfo.tradeType}`, 14, 103);
  doc.text(`Currency: ${data.bookingInfo.currency}`, 14, 109);

  // Cargo Table
  const tableData = data.cargoInformation.map((item: any) => [
    item.commodity,
    item.hsCode || '-',
    item.packageType,
    item.numberOfPackages,
    `${item.grossWeight} KG`
  ]);

  autoTable(doc, {
    startY: 120,
    head: [['Commodity / Description', 'HS Code', 'Pkg Type', 'Qty', 'Weight']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] }
  });

  // Footer & Totals
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont(undefined, 'bold');
  doc.text('Total Valuation / Pricing summary generated separately via ERP.', 14, finalY);

  // Save the PDF
  doc.save(`Invoice_${bookingId}.pdf`);
};

export const generateShippingLabel = async (data: any, bookingId: string) => {
  // Create a 6x6 inch label (152.4 x 152.4 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [152.4, 152.4]
  });

  // Borders
  doc.setLineWidth(0.5);
  doc.rect(5, 5, 142.4, 142.4);
  doc.line(5, 30, 147.4, 30);
  doc.line(5, 70, 147.4, 70);
  doc.line(5, 110, 147.4, 110);
  doc.line(76.2, 70, 76.2, 110);

  // Top Section: Routing & Service
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(data.bookingInfo.serviceType.toUpperCase(), 10, 20);
  
  // Section 2: To / From
  doc.setFontSize(10);
  doc.text('SHIP TO:', 10, 40);
  doc.setFontSize(12);
  doc.text(data.receiverDetails.companyName || 'Unknown Consignee', 10, 47);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(data.receiverDetails.line1 || '', 10, 54);
  doc.text(`${data.receiverDetails.city}, ${data.receiverDetails.country} ${data.receiverDetails.postalCode}`, 10, 61);

  // Section 3: Details & Weight
  doc.setFont(undefined, 'bold');
  doc.text('SENDER:', 10, 80);
  doc.setFont(undefined, 'normal');
  doc.text(data.senderDetails.companyName || '', 10, 87);
  doc.text(data.senderDetails.city || '', 10, 94);

  // Right side of Section 3
  doc.setFont(undefined, 'bold');
  doc.text('WEIGHT:', 85, 80);
  doc.setFontSize(16);
  const totalWeight = data.cargoInformation.reduce((acc: number, val: any) => acc + (val.grossWeight || 0), 0);
  doc.text(`${totalWeight} KG`, 85, 92);

  // Barcode Section (Bottom)
  doc.setFontSize(12);
  doc.text(`TRK# ${bookingId}`, 10, 120);

  try {
    // Generate Barcode Image using bwip-js
    const canvas = document.createElement('canvas');
    bwipjs.toCanvas(canvas, {
      bcid: 'code128',
      text: bookingId,
      scale: 3,
      height: 15,
      includetext: false,
    });
    const barcodeDataUrl = canvas.toDataURL('image/png');
    doc.addImage(barcodeDataUrl, 'PNG', 10, 125, 130, 20);
  } catch (err) {
    console.error('Barcode generation failed', err);
    doc.text('[ BARCODE RENDER ERROR ]', 10, 135);
  }

  doc.save(`Label_${bookingId}.pdf`);
};
