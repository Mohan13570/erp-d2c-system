import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Filter, Search, ShieldAlert, CheckCircle2,
  Clock, Package, ChevronDown, ChevronUp, Lock, AlertCircle, FileCheck,
  Building2, Ship, Plane, Truck, ExternalLink, X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import PortalNavbar from '../components/PortalNavbar';
import {
  generateCommercialInvoice,
  generateBillOfLading,
  generatePackingList,
  generateProofOfDelivery,
  generateCustomsDeclaration
} from '../lib/DocumentGenerator';

interface DocumentRecord {
  id: string;
  customerId: string;
  shipmentId: string;
  origin: string;
  destination: string;
  serviceType: string;
  tradeType: string;
  shipmentStatus: string;
  docType: 'Commercial Invoice' | 'Bill of Lading' | 'Packing List' | 'Proof of Delivery' | 'Customs Declaration';
  dateGenerated: string;
  fileSize: string;
  status: 'AVAILABLE' | 'NOT_YET_AVAILABLE';
  availabilityReason?: string;
  cargoDetails: any;
}

interface GroupedShipment {
  shipmentId: string;
  origin: string;
  destination: string;
  status: string;
  serviceType: string;
  documents: DocumentRecord[];
}

export default function PortalDocuments() {
  const { user } = useCustomerAuth();
  const navigate = useNavigate();

  const customerId = user?.customerId || 'cust_901';

  const [loading, setLoading] = useState(true);
  const [groupedShipments, setGroupedShipments] = useState<GroupedShipment[]>([]);
  const [expandedShipments, setExpandedShipments] = useState<Record<string, boolean>>({});

  // Filter States
  const [selectedDocType, setSelectedDocType] = useState('ALL');
  const [selectedShipmentId, setSelectedShipmentId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Security Test Feedback Banner State
  const [securityTestResult, setSecurityTestResult] = useState<{ status: number; message: string; success: boolean } | null>(null);

  // Default initial mock documents for cust_901 fallback
  const defaultMockGroupedShipments: GroupedShipment[] = [
    {
      shipmentId: 'SHP-8902',
      origin: 'Mumbai (MMR), India',
      destination: 'Hamburg, Germany',
      status: 'IN_TRANSIT',
      serviceType: 'Ocean FCL (40ft High Cube)',
      documents: [
        {
          id: 'DOC-INV-SHP-8902',
          customerId: 'cust_901',
          shipmentId: 'SHP-8902',
          origin: 'Mumbai (MMR), India',
          destination: 'Hamburg, Germany',
          serviceType: 'Ocean FCL (40ft High Cube)',
          tradeType: 'Export',
          shipmentStatus: 'IN_TRANSIT',
          docType: 'Commercial Invoice',
          dateGenerated: '2026-07-20T10:30:00.000Z',
          fileSize: '245 KB',
          status: 'AVAILABLE',
          cargoDetails: {
            senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
            receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
            bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
            cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
          }
        },
        {
          id: 'DOC-BOL-SHP-8902',
          customerId: 'cust_901',
          shipmentId: 'SHP-8902',
          origin: 'Mumbai (MMR), India',
          destination: 'Hamburg, Germany',
          serviceType: 'Ocean FCL (40ft High Cube)',
          tradeType: 'Export',
          shipmentStatus: 'IN_TRANSIT',
          docType: 'Bill of Lading',
          dateGenerated: '2026-07-21T08:15:00.000Z',
          fileSize: '380 KB',
          status: 'AVAILABLE',
          cargoDetails: {
            senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
            receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
            bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
            cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
          }
        },
        {
          id: 'DOC-PKG-SHP-8902',
          customerId: 'cust_901',
          shipmentId: 'SHP-8902',
          origin: 'Mumbai (MMR), India',
          destination: 'Hamburg, Germany',
          serviceType: 'Ocean FCL (40ft High Cube)',
          tradeType: 'Export',
          shipmentStatus: 'IN_TRANSIT',
          docType: 'Packing List',
          dateGenerated: '2026-07-20T11:00:00.000Z',
          fileSize: '190 KB',
          status: 'AVAILABLE',
          cargoDetails: {
            senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
            receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
            bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
            cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
          }
        },
        {
          id: 'DOC-POD-SHP-8902',
          customerId: 'cust_901',
          shipmentId: 'SHP-8902',
          origin: 'Mumbai (MMR), India',
          destination: 'Hamburg, Germany',
          serviceType: 'Ocean FCL (40ft High Cube)',
          tradeType: 'Export',
          shipmentStatus: 'IN_TRANSIT',
          docType: 'Proof of Delivery',
          dateGenerated: '-',
          fileSize: '-',
          status: 'NOT_YET_AVAILABLE',
          availabilityReason: 'Proof of Delivery (POD) becomes available once shipment is marked Delivered.',
          cargoDetails: null
        },
        {
          id: 'DOC-CUST-SHP-8902',
          customerId: 'cust_901',
          shipmentId: 'SHP-8902',
          origin: 'Mumbai (MMR), India',
          destination: 'Hamburg, Germany',
          serviceType: 'Ocean FCL (40ft High Cube)',
          tradeType: 'Export',
          shipmentStatus: 'IN_TRANSIT',
          docType: 'Customs Declaration',
          dateGenerated: '2026-07-21T14:20:00.000Z',
          fileSize: '410 KB',
          status: 'AVAILABLE',
          cargoDetails: {
            senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
            receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
            bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
            cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
          }
        }
      ]
    },
    {
      shipmentId: 'SHP-4401',
      origin: 'Bangalore, India',
      destination: 'Singapore Port',
      status: 'DELIVERED',
      serviceType: 'Air Freight Priority',
      documents: [
        {
          id: 'DOC-INV-SHP-4401',
          customerId: 'cust_901',
          shipmentId: 'SHP-4401',
          origin: 'Bangalore, India',
          destination: 'Singapore Port',
          serviceType: 'Air Freight Priority',
          tradeType: 'Export',
          shipmentStatus: 'DELIVERED',
          docType: 'Commercial Invoice',
          dateGenerated: '2026-07-15T09:00:00.000Z',
          fileSize: '210 KB',
          status: 'AVAILABLE',
          cargoDetails: {
            senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Electronic City Phase 1', city: 'Bangalore', country: 'India', postalCode: '560100' },
            receiverDetails: { companyName: 'SGP Semiconductor Logistics', line1: 'Changi Business Park', city: 'Singapore', country: 'Singapore', postalCode: '486048' },
            bookingInfo: { serviceType: 'Air Freight', tradeType: 'Export', currency: 'USD' },
            cargoInformation: [{ commodity: 'Semiconductor Chips', hsCode: '8542.31', packageType: 'Carton', numberOfPackages: 10, grossWeight: 320 }]
          }
        },
        {
          id: 'DOC-POD-SHP-4401',
          customerId: 'cust_901',
          shipmentId: 'SHP-4401',
          origin: 'Bangalore, India',
          destination: 'Singapore Port',
          serviceType: 'Air Freight Priority',
          tradeType: 'Export',
          shipmentStatus: 'DELIVERED',
          docType: 'Proof of Delivery',
          dateGenerated: '2026-07-18T16:45:00.000Z',
          fileSize: '315 KB',
          status: 'AVAILABLE',
          cargoDetails: {
            senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Electronic City Phase 1', city: 'Bangalore', country: 'India', postalCode: '560100' },
            receiverDetails: { companyName: 'SGP Semiconductor Logistics', line1: 'Changi Business Park', city: 'Singapore', country: 'Singapore', postalCode: '486048' },
            bookingInfo: { serviceType: 'Air Freight', tradeType: 'Export', currency: 'USD' },
            cargoInformation: [{ commodity: 'Semiconductor Chips', hsCode: '8542.31', packageType: 'Carton', numberOfPackages: 10, grossWeight: 320 }]
          }
        }
      ]
    }
  ];

  // Fetch Documents on Mount / Filter Update
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        customerId,
        docType: selectedDocType,
        shipmentId: selectedShipmentId,
        search: searchQuery
      });

      const res = await fetch(`/api/customer-portal/documents?${params.toString()}`, {
        headers: { 'x-customer-id': customerId }
      });
      
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.groupedShipments) {
          setGroupedShipments(json.groupedShipments);
          const initExpand: Record<string, boolean> = {};
          json.groupedShipments.forEach((s: GroupedShipment) => {
            initExpand[s.shipmentId] = true;
          });
          setExpandedShipments(initExpand);
          return;
        }
      }
      
      // Fallback filtering on mock data if API is loading or proxying
      filterFallbackData();
    } catch (err) {
      console.error('Failed to load documents from API, using fallback data:', err);
      filterFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const filterFallbackData = () => {
    let filtered = defaultMockGroupedShipments.map(group => {
      let docs = group.documents;
      if (selectedDocType && selectedDocType !== 'ALL') {
        docs = docs.filter(d => d.docType === selectedDocType);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        docs = docs.filter(d =>
          d.id.toLowerCase().includes(q) ||
          d.shipmentId.toLowerCase().includes(q) ||
          d.docType.toLowerCase().includes(q) ||
          d.origin.toLowerCase().includes(q) ||
          d.destination.toLowerCase().includes(q)
        );
      }
      return { ...group, documents: docs };
    }).filter(group => {
      if (selectedShipmentId && selectedShipmentId !== 'ALL') {
        if (group.shipmentId !== selectedShipmentId) return false;
      }
      return group.documents.length > 0;
    });

    setGroupedShipments(filtered);
    const initExpand: Record<string, boolean> = {};
    filtered.forEach(s => { initExpand[s.shipmentId] = true; });
    setExpandedShipments(initExpand);
  };

  useEffect(() => {
    fetchDocuments();
  }, [customerId, selectedDocType, selectedShipmentId, searchQuery]);

  const toggleExpand = (shpId: string) => {
    setExpandedShipments(prev => ({ ...prev, [shpId]: !prev[shpId] }));
  };

  // Document Download Handler (Reuses DocumentGenerator.ts)
  const handleDownload = async (docRecord: DocumentRecord) => {
    if (docRecord.status === 'NOT_YET_AVAILABLE') {
      alert(docRecord.availabilityReason || 'Document is not yet available.');
      return;
    }

    try {
      const res = await fetch(`/api/customer-portal/documents/${docRecord.id}/download?customerId=${customerId}`, {
        headers: { 'x-customer-id': customerId }
      });
      const json = await res.json();

      if (!json.success) {
        alert(json.error || 'Failed to authorize document download.');
        return;
      }

      const data = json.data.cargoDetails || {
        senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
        receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
        bookingInfo: { serviceType: docRecord.serviceType, tradeType: docRecord.tradeType, currency: 'USD' },
        cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
      };

      let pdfDoc: any;
      switch (docRecord.docType) {
        case 'Commercial Invoice':
          pdfDoc = generateCommercialInvoice(data, docRecord.shipmentId);
          pdfDoc.save(`Commercial_Invoice_${docRecord.shipmentId}.pdf`);
          break;
        case 'Bill of Lading':
          pdfDoc = generateBillOfLading(data, docRecord.shipmentId);
          pdfDoc.save(`Bill_of_Lading_${docRecord.shipmentId}.pdf`);
          break;
        case 'Packing List':
          pdfDoc = generatePackingList(data, docRecord.shipmentId);
          pdfDoc.save(`Packing_List_${docRecord.shipmentId}.pdf`);
          break;
        case 'Proof of Delivery':
          pdfDoc = generateProofOfDelivery(data, docRecord.shipmentId);
          pdfDoc.save(`Proof_of_Delivery_${docRecord.shipmentId}.pdf`);
          break;
        case 'Customs Declaration':
          pdfDoc = generateCustomsDeclaration(data, docRecord.shipmentId);
          pdfDoc.save(`Customs_Declaration_${docRecord.shipmentId}.pdf`);
          break;
        default:
          alert('Downloading document...');
      }
    } catch (err: any) {
      alert(err.message || 'Error generating PDF document');
    }
  };

  // Backend Scoping Security Test (Requirement #4)
  const handleTestUnauthorizedAccess = async () => {
    try {
      // Attempt to access document DOC-INV-SHP-9999 belonging to customer cust_999 while logged in as cust_901
      const res = await fetch(`/api/customer-portal/documents/DOC-INV-SHP-9999/download?customerId=${customerId}`, {
        headers: { 'x-customer-id': customerId }
      });
      const json = await res.json();
      setSecurityTestResult({
        status: res.status,
        message: json.error || 'Request completed',
        success: res.status === 403
      });
    } catch (err: any) {
      setSecurityTestResult({
        status: 500,
        message: err.message,
        success: false
      });
    }
  };

  const allDocTypes = ['Commercial Invoice', 'Bill of Lading', 'Packing List', 'Proof of Delivery', 'Customs Declaration'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      <PortalNavbar />

      {/* ── Main Container ────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        
        {/* Page Title & Scoping Security Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium mb-1">
              <span>Customer Portal</span>
              <span>&gt;</span>
              <span className="text-blue-600 font-semibold">Document Center</span>
            </nav>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="text-blue-600 w-7 h-7" /> Document Repository &amp; Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Access and download official Invoices, Bills of Lading, Packing Lists, PODs, and Customs docs for your shipments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <Lock size={14} /> Read-Only Customer View ({customerId})
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleTestUnauthorizedAccess}
              className="text-xs border-amber-300 bg-amber-50 dark:bg-slate-900 text-amber-800 dark:text-amber-400 hover:bg-amber-100 font-bold"
              title="Test attempting to fetch another customer's document"
            >
              <ShieldAlert size={14} className="mr-1.5 text-amber-600" /> Run 403 Scoping Test
            </Button>
          </div>
        </div>

        {/* Security Test Feedback Banner */}
        {securityTestResult && (
          <div className={`p-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
            securityTestResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-slate-900 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-slate-900 dark:border-rose-800 dark:text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {securityTestResult.success ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
              <span>
                Backend Security Test Result (HTTP {securityTestResult.status}): {securityTestResult.message}
              </span>
            </div>
            <button onClick={() => setSecurityTestResult(null)} className="opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Filters Bar ──────────────────────────────────────────────────── */}
        <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Search Query */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Search Documents</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, HS Code, City..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Document Type Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Document Type</label>
                <select
                  value={selectedDocType}
                  onChange={e => setSelectedDocType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Document Types</option>
                  {allDocTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Shipment ID Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Filter by Shipment</label>
                <select
                  value={selectedShipmentId}
                  onChange={e => setSelectedShipmentId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Shipments</option>
                  <option value="SHP-8902">SHP-8902 (Mumbai ➔ Hamburg)</option>
                  <option value="SHP-4401">SHP-4401 (Bangalore ➔ Singapore)</option>
                </select>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* ── Grouped Shipment Accordion View ───────────────────────────────── */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold text-xs">
            Loading customer documents...
          </div>
        ) : groupedShipments.length === 0 ? (
          /* Empty State (Requirement #5) */
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
            <CardContent className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <FileText size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Documents Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No documents available for the selected filters. Clear filters or check back once your shipment generates documentation.
              </p>
              <Button size="sm" variant="outline" onClick={() => { setSelectedDocType('ALL'); setSelectedShipmentId('ALL'); setSearchQuery(''); }}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {groupedShipments.map(group => {
              const isExpanded = expandedShipments[group.shipmentId];
              return (
                <Card key={group.shipmentId} className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                  {/* Shipment Group Header */}
                  <div
                    onClick={() => toggleExpand(group.shipmentId)}
                    className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-850 border-b border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold">
                        <Package size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{group.shipmentId}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            group.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-slate-800 dark:text-emerald-400'
                              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-slate-800 dark:text-blue-400'
                          }`}>
                            {group.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {group.origin} ➔ {group.destination} • <span className="text-slate-700 dark:text-slate-300 font-semibold">{group.serviceType}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-bold text-slate-500">
                        {group.documents.length} Document{group.documents.length === 1 ? '' : 's'}
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Documents Table View */}
                  {isExpanded && (
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                          <thead className="bg-slate-100/50 dark:bg-slate-950 text-slate-400 font-extrabold uppercase border-b border-slate-100 dark:border-slate-800">
                            <tr>
                              <th className="py-3 px-6">DOCUMENT TYPE</th>
                              <th className="py-3 px-6">REF ID</th>
                              <th className="py-3 px-6">DATE GENERATED</th>
                              <th className="py-3 px-6">FILE SIZE</th>
                              <th className="py-3 px-6">AVAILABILITY STATUS</th>
                              <th className="py-3 px-6 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {group.documents.map((docRecord) => {
                              const isAvailable = docRecord.status === 'AVAILABLE';
                              return (
                                <tr key={docRecord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                  <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText size={15} className="text-blue-600" />
                                    <span>{docRecord.docType}</span>
                                  </td>
                                  <td className="py-3.5 px-6 font-mono text-slate-500">{docRecord.id}</td>
                                  <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400">
                                    {docRecord.dateGenerated !== '-' ? new Date(docRecord.dateGenerated).toLocaleDateString() : '-'}
                                  </td>
                                  <td className="py-3.5 px-6 font-mono text-slate-500">{docRecord.fileSize}</td>
                                  <td className="py-3.5 px-6">
                                    {isAvailable ? (
                                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                                        <FileCheck size={12} /> Available
                                      </span>
                                    ) : (
                                      <span
                                        className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 w-fit cursor-help"
                                        title={docRecord.availabilityReason}
                                      >
                                        <Clock size={12} /> Not Yet Available
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-6 text-right">
                                    {isAvailable ? (
                                      <Button
                                        size="sm"
                                        onClick={() => handleDownload(docRecord)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                                      >
                                        <Download size={13} className="mr-1" /> Download PDF
                                      </Button>
                                    ) : (
                                      <Button size="sm" variant="ghost" disabled className="text-slate-400 cursor-not-allowed">
                                        Pending Delivery
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
