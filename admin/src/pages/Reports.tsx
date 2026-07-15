import { useState, useEffect } from 'react';
import { FileText, Download, Printer, Calendar, TrendingUp, DollarSign, ShoppingCart, Layers, AlertCircle, CalendarRange } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { token, user } = useAuth();
  
  // Permission checks
  const isAdmin = user?.role === 'System Admin' || user?.role === 'Admin';
  const hasFinance = isAdmin || user?.permissions?.includes('Finance') || user?.permissions?.includes('All Modules');
  const hasSalesOrders = isAdmin || user?.permissions?.includes('Sales Orders') || user?.permissions?.includes('All Modules');
  const hasInventory = isAdmin || user?.permissions?.includes('Inventory') || user?.permissions?.includes('All Modules');

  // Determine initial tab based on permissions
  const initialTab = hasFinance ? 'sales' : hasSalesOrders ? 'orders' : hasInventory ? 'inventory' : '';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Date filters
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Data states
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const headers = { 'Authorization': `Bearer ${token}` };

  const fetchReport = () => {
    if (!activeTab) return;
    setLoading(true);
    let url = `/api/reports/${activeTab}`;
    if (activeTab === 'sales' || activeTab === 'orders') {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    fetch(url, { headers })
      .then(r => r.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setData(null);
    fetchReport();
  }, [activeTab, startDate, endDate]);

  if (!activeTab) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-slate-800">Access Denied</h2>
        <p className="text-slate-500 font-semibold mt-2">You do not have permission to view any reports.</p>
      </div>
    );
  }

  // Export to Excel (CSV)
  const handleExportCSV = () => {
    if (!data || !data.data || data.data.length === 0) return;
    
    let csvHeaders: string[] = [];
    let rows: any[] = [];
    let filename = `${activeTab}_report_${Date.now()}.csv`;

    if (activeTab === 'sales') {
      csvHeaders = ['Order_ID', 'Customer', 'Channel', 'Date', 'Status', 'Total_Amount'];
      rows = data.data.map((o: any) => ({
        Order_ID: o.id.toUpperCase(),
        Customer: o.customer?.customerName || (o.d2cCustomer ? `${o.d2cCustomer.firstName} ${o.d2cCustomer.lastName}` : 'Guest'),
        Channel: o.channel,
        Date: new Date(o.transactionDate).toLocaleDateString(),
        Status: o.status,
        Total_Amount: o.grandTotal.toFixed(2)
      }));
    } else if (activeTab === 'orders') {
      csvHeaders = ['Order_ID', 'Customer', 'Channel', 'Date', 'Status', 'Total_Amount'];
      rows = data.data.map((o: any) => ({
        Order_ID: o.id.toUpperCase(),
        Customer: o.customer?.customerName || (o.d2cCustomer ? `${o.d2cCustomer.firstName} ${o.d2cCustomer.lastName}` : 'Guest'),
        Channel: o.channel,
        Date: new Date(o.transactionDate).toLocaleDateString(),
        Status: o.status,
        Total_Amount: o.grandTotal.toFixed(2)
      }));
    } else if (activeTab === 'inventory') {
      csvHeaders = ['Item_Code', 'Item_Name', 'Group', 'Warehouse', 'Qty_On_Hand', 'Qty_Reserved', 'Qty_Available', 'Valuation_Rate', 'Total_Valuation'];
      rows = data.data.map((i: any) => ({
        Item_Code: i.itemCode,
        Item_Name: i.itemName,
        Group: i.itemGroup,
        Warehouse: i.warehouse,
        Qty_On_Hand: i.qtyOnHand,
        Qty_Reserved: i.qtyReserved,
        Qty_Available: i.qtyAvailable,
        Valuation_Rate: i.valuationRate.toFixed(2),
        Total_Valuation: i.totalValuation.toFixed(2)
      }));
    }

    const csvRows = [];
    csvRows.push(csvHeaders.join(','));

    for (const row of rows) {
      const values = csvHeaders.map(h => {
        const val = row[h] !== undefined ? row[h] : '';
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusStyle = (s: string) => {
    if (s === 'Completed' || s === 'Delivered') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Cancelled' || s === 'Returned') return 'bg-red-100 text-red-700';
    if (s === 'Pending' || s === 'Draft') return 'bg-gray-100 text-gray-600';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Dynamic print-override styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm no-print">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Enterprise Reporting</h1>
          <p className="text-gray-500 font-medium mt-1">Export clean financial, sales, and catalog audits.</p>
        </div>
        <div className="flex space-x-3 items-center">
          <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 flex items-center transition-all">
            <Download size={16} className="mr-2" /> Export to Excel
          </button>
          <button onClick={handlePrint} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 flex items-center transition-all">
            <Printer size={16} className="mr-2" /> Print PDF
          </button>
        </div>
      </div>

      {/* Filters and Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        {/* Tabs */}
        <div className="bg-gray-100/80 backdrop-blur-md p-1 rounded-2xl w-fit flex space-x-1 border border-white/50 shadow-inner">
          {hasFinance && (
            <button onClick={() => setActiveTab('sales')}
              className={`flex items-center px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === 'sales' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
              <TrendingUp size={14} className="mr-1.5" /> Sales Report
            </button>
          )}
          {hasSalesOrders && (
            <button onClick={() => setActiveTab('orders')}
              className={`flex items-center px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === 'orders' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
              <ShoppingCart size={14} className="mr-1.5" /> Orders Report
            </button>
          )}
          {hasInventory && (
            <button onClick={() => setActiveTab('inventory')}
              className={`flex items-center px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === 'inventory' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
              <Layers size={14} className="mr-1.5" /> Inventory Valuation
            </button>
          )}
        </div>

        {/* Date Filters (Only for Sales and Orders) */}
        {(activeTab === 'sales' || activeTab === 'orders') && (
          <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
            <CalendarRange size={14} className="text-gray-400 mr-2" />
            <input type="date" className="text-xs font-bold text-gray-700 outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className="text-gray-400 font-bold text-xs">to</span>
            <input type="date" className="text-xs font-bold text-gray-700 outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        )}
      </div>

      {/* Main Report Container */}
      <div id="printable-report" className="space-y-6">
        {loading && (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 text-xs font-bold mt-4 uppercase tracking-widest">Generating Audit Report...</p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* Report Header (Print only) */}
            <div className="hidden print:block mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Aura ERP & D2C System Report</h2>
              <p className="text-slate-500 font-semibold text-xs mt-1">
                Report Type: {activeTab.toUpperCase()} | Generated on {new Date().toLocaleString()}
                {(activeTab === 'sales' || activeTab === 'orders') && ` | Range: ${startDate} to ${endDate}`}
              </p>
              <hr className="mt-4 border-slate-200" />
            </div>

            {/* Stats Overview */}
            {activeTab === 'sales' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center"><DollarSign size={14} className="mr-1"/> Total Revenue</p>
                  <p className="text-3xl font-black text-emerald-600">${data.summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center"><ShoppingCart size={14} className="mr-1"/> Volume of Orders</p>
                  <p className="text-3xl font-black text-indigo-600">{data.summary.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center"><TrendingUp size={14} className="mr-1"/> Avg Order Value</p>
                  <p className="text-3xl font-black text-gray-900">${data.summary.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center"><ShoppingCart size={14} className="mr-1"/> Total Orders Volume</p>
                  <p className="text-3xl font-black text-gray-900">{data.summary.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">D2C Sales Channel</p>
                  <p className="text-3xl font-black text-indigo-600">{data.summary.channelCounts?.D2C || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">B2B Sales Channel</p>
                  <p className="text-3xl font-black text-purple-600">{data.summary.channelCounts?.B2B || 0}</p>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center"><Layers size={14} className="mr-1"/> Total Catalog Value</p>
                  <p className="text-3xl font-black text-emerald-600">${data.summary.totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center"><FileText size={14} className="mr-1"/> Total Tracked Warehousing Slots</p>
                  <p className="text-3xl font-black text-gray-900">{data.summary.totalItems}</p>
                </div>
              </div>
            )}

            {/* Report Data Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-6">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  {activeTab === 'sales' && (
                    <tr>
                      {['Order ID', 'Customer', 'Channel', 'Date', 'Status', 'Total'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  )}
                  {activeTab === 'orders' && (
                    <tr>
                      {['Order ID', 'Customer', 'Channel', 'Date', 'Status', 'Total'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  )}
                  {activeTab === 'inventory' && (
                    <tr>
                      {['SKU/Code', 'Item Name', 'Warehouse', 'Qty On Hand', 'Qty Reserved', 'Qty Available', 'Rate', 'Valuation'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {data.data.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'inventory' ? 8 : 6} className="px-6 py-8 text-center text-gray-400 font-semibold text-sm">No report records found for the selected configuration.</td>
                    </tr>
                  ) : (
                    data.data.map((row: any, idx: number) => {
                      if (activeTab === 'sales' || activeTab === 'orders') {
                        const custName = row.customer?.customerName || (row.d2cCustomer ? `${row.d2cCustomer.firstName} ${row.d2cCustomer.lastName}` : 'Guest');
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-mono font-bold text-indigo-600">{row.id.substring(0, 8).toUpperCase()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{custName}</td>
                            <td className="px-6 py-4"><span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${row.channel === 'D2C' ? 'bg-indigo-55 text-indigo-600' : 'bg-purple-55 text-purple-600'}`}>{row.channel}</span></td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-500">{new Date(row.transactionDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4"><span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${getStatusStyle(row.status)}`}>{row.status}</span></td>
                            <td className="px-6 py-4 text-sm font-black text-gray-900">${row.grandTotal.toFixed(2)}</td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-mono font-bold text-indigo-600">{row.itemCode}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.itemName}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-500">{row.warehouse}</td>
                            <td className="px-6 py-4 text-sm font-black text-gray-900 text-center">{row.qtyOnHand}</td>
                            <td className="px-6 py-4 text-sm font-bold text-amber-600 text-center">{row.qtyReserved}</td>
                            <td className="px-6 py-4 text-sm font-black text-indigo-700 text-center">{row.qtyAvailable}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">${row.valuationRate.toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm font-black text-emerald-600">${row.totalValuation.toFixed(2)}</td>
                          </tr>
                        );
                      }
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
