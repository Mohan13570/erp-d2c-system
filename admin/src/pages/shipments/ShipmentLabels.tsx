import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { QrCode, Printer, Download, Package } from 'lucide-react';

export default function ShipmentLabels() {
  const { id } = useParams();
  const trackingNumber = id || 'TRK-90218-444';
  const trackingUrl = \`http://localhost:5173/tracking?ref=\${trackingNumber}\`;
  
  const labelRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <QrCode className="w-8 h-8 text-blue-600" /> Auto-Generated Labels
          </h1>
          <p className="text-slate-500 mt-1">Print or download tracking codes for physical cargo attachment.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Printer className="w-4 h-4" /> Print Label
          </button>
        </div>
      </div>

      {/* The Printable Label Card */}
      <div 
        ref={labelRef}
        className="bg-white w-full max-w-2xl border-2 border-slate-300 rounded-3xl p-10 shadow-sm print:border-black print:shadow-none print:w-[4in] print:h-[6in]"
      >
        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-6 print:border-black">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">LIZOME ERP</h2>
            <p className="text-slate-500 font-bold tracking-widest text-sm mt-1 uppercase">Logistics & Supply</p>
          </div>
          <Package className="w-10 h-10 text-slate-300" />
        </div>

        <div className="flex flex-col items-center justify-center space-y-12">
          
          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Customer Scan Portal</p>
            <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
              <QRCodeSVG 
                value={trackingUrl} 
                size={220} 
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="Q"
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3 text-center max-w-xs">
              Scan with any mobile device to view live tracking portal for this shipment.
            </p>
          </div>

          {/* Barcode Section */}
          <div className="flex flex-col items-center w-full border-t-2 border-slate-100 pt-8 print:border-black">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Warehouse Scanner Barcode</p>
            <Barcode 
              value={trackingNumber} 
              width={2.5}
              height={80}
              fontSize={18}
              fontOptions="bold"
              background="transparent"
              lineColor="#0f172a"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
