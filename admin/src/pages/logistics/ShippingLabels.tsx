import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import Barcode from 'react-barcode';

export default function ShippingLabels() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEmbedded = searchParams.get('embed') === 'true';
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem(`bookingData_${id}`);
    if (data) {
      setBookingData(JSON.parse(data));
    }
  }, [id]);

  if (!bookingData) {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Label Data Not Found</div>;
  }

  const { senderDetails, receiverDetails, cargoInformation, bookingInfo } = bookingData;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div className={`bg-gray-100 min-h-screen ${isEmbedded ? '' : 'pb-20'}`}>
      {/* Non-Printable Header */}
      {!isEmbedded && (
        <div className="print:hidden bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
          <div>
            <h2 className="font-bold">Shipping Label Preview</h2>
            <p className="text-xs text-gray-400">Ref: {id} • 6x6 Thermal Format</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Printer size={18} />
            <span>Print Thermal Label</span>
          </button>
        </div>
      )}

      {/* Printable Area (6x6 inches = approx 152.4mm x 152.4mm) */}
      <div className={`${isEmbedded ? 'pt-8' : 'pt-24'} print:pt-0 flex flex-col items-center space-y-8`}>
        
        {cargoInformation.map((item: any, idx: number) => (
          <div 
            key={idx}
            className="printable-label w-[6in] h-[6in] bg-white print:shadow-none shadow-xl border-2 print:border-none border-gray-900 overflow-hidden text-black font-sans relative page-break-after-always flex flex-col"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Top Bar */}
            <div className="border-b-4 border-black p-4 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase">{bookingInfo.serviceType.split(' ')[0]}</h1>
                <p className="font-bold text-xl uppercase mt-1">{bookingInfo.priority} PRIORITY</p>
              </div>
              <div className="bg-[#0F172A] p-2 rounded-lg inline-block print:border-none print:shadow-none">
                <img src="/admin/lizome-icon.svg" alt="LIZOME" className="h-6 object-contain" />
              </div>
            </div>

            {/* Routing Row */}
            <div className="border-b-4 border-black flex h-24">
              <div className="w-1/3 border-r-4 border-black p-3 flex flex-col justify-center items-center">
                <span className="text-xs font-bold uppercase tracking-wider mb-1">Origin</span>
                <span className="text-3xl font-black">{senderDetails.country.substring(0, 3).toUpperCase() || 'ORG'}</span>
              </div>
              <div className="w-1/3 border-r-4 border-black p-3 flex flex-col justify-center items-center bg-black text-white">
                <span className="text-xs font-bold uppercase tracking-wider mb-1">Dest</span>
                <span className="text-4xl font-black">{receiverDetails.country.substring(0, 3).toUpperCase() || 'DST'}</span>
              </div>
              <div className="w-1/3 p-3 flex flex-col justify-center items-center">
                <span className="text-xs font-bold uppercase tracking-wider mb-1">Weight (KG)</span>
                <span className="text-3xl font-black">{item.grossWeight}</span>
              </div>
            </div>

            {/* Addresses Row */}
            <div className="border-b-4 border-black flex">
              {/* Ship To */}
              <div className="w-full p-4 flex flex-col">
                <span className="font-bold text-sm uppercase mb-2 text-gray-700">Ship To:</span>
                <span className="font-black text-2xl uppercase leading-none mb-1">{receiverDetails.companyName}</span>
                <span className="font-bold text-md uppercase leading-tight">{receiverDetails.line1}</span>
                <span className="font-bold text-md uppercase leading-tight">{receiverDetails.city}, {receiverDetails.postalCode}</span>
                <span className="font-bold text-md uppercase leading-tight">{receiverDetails.country}</span>
              </div>
            </div>

            {/* Horizontal Full-Width Barcode Row */}
            <div className="border-b-4 border-black p-4 flex flex-col items-center justify-center flex-1">
              <div className="w-full flex justify-center scale-x-125 transform overflow-hidden">
                <Barcode 
                  value={(id && id.split('-')[1]) || id || 'UNKNOWN'} 
                  width={2.5} 
                  height={80} 
                  displayValue={true} 
                  background="transparent" 
                  margin={0}
                  fontSize={16}
                  fontOptions="bold"
                />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="p-4 flex flex-col">
              <span className="font-bold text-xs uppercase mb-1 border-b border-gray-300 pb-1">Cargo Description</span>
              <div className="flex justify-between items-end mt-1">
                <div>
                  <span className="font-black text-lg uppercase">{item.commodity}</span>
                  <p className="font-bold text-sm uppercase mt-1">Pkg {idx + 1} of {cargoInformation.length} ({item.packageType})</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs uppercase block">Tracking No.</span>
                  <span className="font-black font-mono text-xl">{id}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .printable-label, .printable-label * { visibility: visible; }
          .printable-label { position: relative; margin: 0; box-shadow: none; border: none; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
          @page { margin: 0; size: 6in 6in; }
          .page-break-after-always { page-break-after: always; }
        }
      `}} />
    </div>
  );
}
