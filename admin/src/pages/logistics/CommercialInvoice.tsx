import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Printer, MapPin, Phone, Mail, Building2, Globe } from 'lucide-react';

export default function CommercialInvoice() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEmbedded = searchParams.get('embed') === 'true';
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Fetch data from localStorage (mock backend for now)
    const data = localStorage.getItem(`bookingData_${id}`);
    if (data) {
      setBookingData(JSON.parse(data));
    }
    // Auto-trigger print dialog after small delay to let logo load
    setTimeout(() => {
      // window.print(); // Disabled auto-print for demo safety, user can click button
    }, 1000);
  }, [id]);

  if (!bookingData) {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Invoice Data Not Found</div>;
  }

  const { senderDetails, receiverDetails, cargoInformation, bookingInfo, calculation } = bookingData;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Calculate totals
  const totalPkgs = cargoInformation.reduce((acc: number, item: any) => acc + (Number(item.numberOfPackages) || 0), 0);
  const totalWeight = cargoInformation.reduce((acc: number, item: any) => acc + (Number(item.grossWeight) || 0), 0);
  const totalVolume = cargoInformation.reduce((acc: number, item: any) => acc + (Number(item.volumeCBM) || 0), 0);

  return (
    <div className={`bg-white min-h-screen ${isEmbedded ? '' : 'pb-10'}`}>
      {/* Non-Printable Header */}
      {!isEmbedded && (
        <div className="print:hidden bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
          <div>
            <h2 className="font-bold">Commercial Invoice Preview</h2>
            <p className="text-xs text-gray-400">Ref: {id}</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Printer size={18} />
            <span>Print A4 Invoice</span>
          </button>
        </div>
      )}

      {/* Printable Area (A4 dimensions: 210mm x 297mm) */}
      <div className={`${isEmbedded ? 'pt-8' : 'pt-24'} print:pt-0 pb-10`}>
        <div className="printable-invoice max-w-[210mm] min-h-[297mm] mx-auto bg-white print:shadow-none shadow-xl border print:border-none border-gray-200 p-12 text-sm text-gray-900 font-sans">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-6 mb-8">
            <div>
              <div className="bg-[#0F172A] p-3 rounded-lg inline-block mb-4 print:border-none print:shadow-none">
                <img src="/admin/lizome-icon.svg" alt="LIZOME" className="h-8 object-contain" />
              </div>
              <h1 className="text-3xl font-black text-indigo-900 tracking-tight uppercase">Commercial Invoice</h1>
              <p className="font-medium text-gray-600 mt-1">Multi-Modal Global Logistics</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-1">Invoice No.</p>
              <p className="text-xl font-bold font-mono text-gray-900">{id}</p>
              <p className="font-bold text-gray-500 uppercase tracking-wider text-xs mt-3 mb-1">Date</p>
              <p className="font-medium text-gray-900">{date}</p>
              <p className="font-bold text-gray-500 uppercase tracking-wider text-xs mt-3 mb-1">Currency</p>
              <p className="font-bold text-gray-900">{bookingInfo.currency || 'USD'}</p>
            </div>
          </div>

          {/* Addresses Matrix */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* Shipper */}
            <div>
              <h3 className="font-bold text-indigo-900 border-b border-gray-200 pb-2 mb-3 flex items-center">
                <Building2 size={16} className="mr-2 text-indigo-500" /> Shipper / Exporter
              </h3>
              <div className="space-y-1">
                <p className="font-bold text-gray-900">{senderDetails.companyName}</p>
                <p>{senderDetails.contactPerson}</p>
                <p>{senderDetails.line1}</p>
                <p>{senderDetails.city}, {senderDetails.postalCode}</p>
                <p>{senderDetails.country}</p>
                {(senderDetails.email || senderDetails.phone) && (
                  <div className="mt-2 text-gray-600 text-xs">
                    {senderDetails.phone && <p className="flex items-center"><Phone size={12} className="mr-1"/> {senderDetails.phone}</p>}
                    {senderDetails.email && <p className="flex items-center mt-0.5"><Mail size={12} className="mr-1"/> {senderDetails.email}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Consignee */}
            <div>
              <h3 className="font-bold text-indigo-900 border-b border-gray-200 pb-2 mb-3 flex items-center">
                <MapPin size={16} className="mr-2 text-indigo-500" /> Consignee / Receiver
              </h3>
              <div className="space-y-1">
                <p className="font-bold text-gray-900">{receiverDetails.companyName}</p>
                <p>{receiverDetails.contactPerson}</p>
                <p>{receiverDetails.line1}</p>
                <p>{receiverDetails.city}, {receiverDetails.postalCode}</p>
                <p>{receiverDetails.country}</p>
                {(receiverDetails.email || receiverDetails.phone) && (
                  <div className="mt-2 text-gray-600 text-xs">
                    {receiverDetails.phone && <p className="flex items-center"><Phone size={12} className="mr-1"/> {receiverDetails.phone}</p>}
                    {receiverDetails.email && <p className="flex items-center mt-0.5"><Mail size={12} className="mr-1"/> {receiverDetails.email}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipment Info */}
          <div className="bg-gray-50 border border-gray-200 p-4 mb-8 grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Service</p>
              <p className="font-medium">{bookingInfo.serviceType}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Trade</p>
              <p className="font-medium">{bookingInfo.tradeType}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Incoterms</p>
              <p className="font-medium">FOB (Default)</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
              <p className="font-medium">Confirmed</p>
            </div>
          </div>

          {/* Cargo Table */}
          <h3 className="font-bold text-indigo-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
            <Globe size={16} className="mr-2 text-indigo-500" /> Itemized Cargo Description
          </h3>
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-xs font-bold uppercase border-y border-gray-300">Item / Commodity</th>
                <th className="p-3 text-xs font-bold uppercase border-y border-gray-300">HS Code</th>
                <th className="p-3 text-xs font-bold uppercase border-y border-gray-300 text-center">Qty / Pkgs</th>
                <th className="p-3 text-xs font-bold uppercase border-y border-gray-300 text-right">Gross Wt (KG)</th>
                <th className="p-3 text-xs font-bold uppercase border-y border-gray-300 text-right">Volume (CBM)</th>
              </tr>
            </thead>
            <tbody>
              {cargoInformation.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-3">
                    <p className="font-medium text-gray-900">{item.commodity}</p>
                    <p className="text-xs text-gray-500">{item.packageType} {item.isDangerousGoods ? '• DG' : ''} {item.isTemperatureControlled ? '• REEFER' : ''}</p>
                  </td>
                  <td className="p-3 text-gray-600">{item.hsCode || '-'}</td>
                  <td className="p-3 text-center font-medium">{item.numberOfPackages}</td>
                  <td className="p-3 text-right font-medium">{item.grossWeight}</td>
                  <td className="p-3 text-right font-medium">{item.volumeCBM || '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold text-gray-900">
                <td colSpan={2} className="p-3 text-right uppercase text-xs">Totals</td>
                <td className="p-3 text-center">{totalPkgs}</td>
                <td className="p-3 text-right">{totalWeight.toFixed(2)} KG</td>
                <td className="p-3 text-right">{totalVolume > 0 ? totalVolume.toFixed(3) + ' CBM' : '-'}</td>
              </tr>
            </tfoot>
          </table>

          {/* Financial Breakdown */}
          {calculation && calculation.financials && (
            <div className="flex justify-end mb-8">
              <div className="w-1/2">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600 font-medium">Base Freight ({calculation.metrics.chargeableWeight.toFixed(2)} KG)</td>
                      <td className="py-2 text-right font-mono font-medium">${calculation.financials.baseFreight.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600 font-medium">Fuel Surcharge (FSC)</td>
                      <td className="py-2 text-right font-mono font-medium">${calculation.financials.fuelSurcharge.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600 font-medium">GST (18%)</td>
                      <td className="py-2 text-right font-mono font-medium">${calculation.financials.gst.toFixed(2)}</td>
                    </tr>
                    <tr className="text-lg">
                      <td className="py-3 font-bold text-indigo-900 uppercase">Grand Total</td>
                      <td className="py-3 text-right font-black font-mono text-indigo-900">${calculation.financials.grandTotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Legal / Notes */}
          <div className="text-xs text-gray-500 mt-16 pt-6 border-t border-gray-200 text-center">
            <p className="font-bold text-gray-900 mb-1">LIZOME Enterprise Logistics</p>
            <p>123 Global Trade Way, Logistics Hub, NY 10001, United States</p>
            <p className="mt-4">This document is a computer-generated invoice and requires no signature.</p>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .printable-invoice, .printable-invoice * { visibility: visible; }
          .printable-invoice { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
          @page { margin: 0; size: A4; }
        }
      `}} />
    </div>
  );
}
