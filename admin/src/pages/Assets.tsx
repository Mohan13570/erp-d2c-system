import { useState, useEffect } from 'react';
import { Monitor, Printer, Car, TrendingDown, Plus } from 'lucide-react';

interface Asset { id: string; assetName: string; assetCategory: string; purchaseAmount: number; currentValue: number; status: string; location: string; purchaseDate: string; usefulLifeYears: number; }

const categoryIcon = (cat: string) => {
  if (cat === 'IT Equipment') return <Monitor size={20} />;
  if (cat === 'Vehicles') return <Car size={20} />;
  return <Printer size={20} />;
};
const categoryColor = (cat: string) => {
  if (cat === 'IT Equipment') return 'bg-indigo-50 text-indigo-600';
  if (cat === 'Vehicles') return 'bg-amber-50 text-amber-600';
  return 'bg-purple-50 text-purple-600';
};

export default function AssetManagement() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ assetName: '', assetCategory: 'IT Equipment', purchaseAmount: 0, location: '', purchaseDate: '', usefulLifeYears: 5 });

  const fetchData = () => {
    fetch('/api/assets/assets').then(r => r.json()).then(setAssets);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAsset = async () => {
    if(!newAsset.assetName || newAsset.purchaseAmount <= 0) return alert('Invalid asset details');
    const res = await fetch('/api/assets/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({...newAsset, currentValue: newAsset.purchaseAmount}) });
    if(res.ok) { setShowModal(false); fetchData(); } else alert('Failed to create asset');
  };

  const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalCost = assets.reduce((sum, a) => sum + a.purchaseAmount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Asset Management</h1>
          <p className="text-gray-500 mt-1">Track company assets, depreciation and values.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Add Asset
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add Asset</h2>
            <div className="space-y-4">
              <input placeholder="Asset Name" className="w-full p-3 border rounded-xl" onChange={e => setNewAsset({...newAsset, assetName: e.target.value})} />
              <select className="w-full p-3 border rounded-xl bg-white" onChange={e => setNewAsset({...newAsset, assetCategory: e.target.value})}>
                <option value="IT Equipment">IT Equipment</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Machinery">Machinery</option>
                <option value="Furniture">Furniture</option>
              </select>
              <div className="flex gap-4">
                <input type="number" placeholder="Purchase Amount ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewAsset({...newAsset, purchaseAmount: Number(e.target.value)})} />
                <input type="number" placeholder="Useful Life (Years)" className="w-full p-3 border rounded-xl" value={newAsset.usefulLifeYears} onChange={e => setNewAsset({...newAsset, usefulLifeYears: Number(e.target.value)})} />
              </div>
              <div className="flex gap-4">
                <input type="date" className="w-full p-3 border rounded-xl text-gray-500" onChange={e => setNewAsset({...newAsset, purchaseDate: e.target.value})} />
                <input placeholder="Location" className="w-full p-3 border rounded-xl" onChange={e => setNewAsset({...newAsset, location: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateAsset} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create Asset</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Assets</p>
          <p className="text-3xl font-bold text-gray-900">{assets.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Purchase Value</p>
          <p className="text-3xl font-bold text-gray-900">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Current Book Value</p>
          <p className="text-3xl font-bold text-emerald-600">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map(asset => {
          const depreciationPct = Math.round(((asset.purchaseAmount - asset.currentValue) / asset.purchaseAmount) * 100);
          return (
            <div key={asset.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-xl ${categoryColor(asset.assetCategory)}`}>
                  {categoryIcon(asset.assetCategory)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{asset.assetName}</h3>
                  <p className="text-xs text-gray-500">{asset.assetCategory}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-gray-50 pt-4">
                <div className="flex justify-between"><span className="text-gray-500">Purchase Value</span><span className="font-medium">${asset.purchaseAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Book Value</span><span className="font-bold text-gray-900">${asset.currentValue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Depreciated</span><span className="text-rose-500 font-medium flex items-center"><TrendingDown size={12} className="mr-1" />{depreciationPct}%</span></div>
                {asset.location && <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-gray-700">{asset.location}</span></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
