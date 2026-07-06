const fs = require('fs');
const path = require('path');

const adminSrc = path.join(__dirname, 'src');
const warehouseDir = path.join(adminSrc, 'pages', 'warehouse');

if (!fs.existsSync(warehouseDir)) {
  fs.mkdirSync(warehouseDir, { recursive: true });
}

// 1. WarehouseMaster.tsx
const masterCode = `import React from 'react';
import { Building2, Plus, MapPin } from 'lucide-react';

export default function WarehouseMaster() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Master Setup</h1>
          <p className="text-sm text-gray-500">Configure core warehouse properties and types</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700">
          <Plus className="w-5 h-5 mr-2" /> Add Warehouse
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Master configurations will appear here.</p>
      </div>
    </div>
  );
}
`;

// 2. SpatialManager.tsx
const spatialCode = `import React from 'react';
import { Layers, Plus } from 'lucide-react';

export default function SpatialManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spatial Hierarchy Manager</h1>
          <p className="text-sm text-gray-500">Configure Zones, Blocks, Aisles, Racks, and Bins</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" /> Add Zone
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Hierarchical layout tree will appear here.</p>
      </div>
    </div>
  );
}
`;

// 3. EquipmentManager.tsx
const equipmentCode = `import React from 'react';
import { Truck, Plus } from 'lucide-react';

export default function EquipmentManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment & Asset Manager</h1>
          <p className="text-sm text-gray-500">Manage Forklifts, Pallet Jacks, and Loading Bays</p>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700">
          <Plus className="w-5 h-5 mr-2" /> Register Equipment
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Equipment tracking table will appear here.</p>
      </div>
    </div>
  );
}
`;

// 4. WarehouseSettings.tsx
const settingsCode = `import React from 'react';
import { Settings, Save } from 'lucide-react';

export default function WarehouseSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Rules & Settings</h1>
          <p className="text-sm text-gray-500">Configure FIFO/LIFO, Barcodes, and Stock Rules</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700">
          <Save className="w-5 h-5 mr-2" /> Save Config
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Form for picking/packing rules will appear here.</p>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(warehouseDir, 'WarehouseMaster.tsx'), masterCode);
fs.writeFileSync(path.join(warehouseDir, 'SpatialManager.tsx'), spatialCode);
fs.writeFileSync(path.join(warehouseDir, 'EquipmentManager.tsx'), equipmentCode);
fs.writeFileSync(path.join(warehouseDir, 'WarehouseSettings.tsx'), settingsCode);

// Update App.tsx
let appTsx = fs.readFileSync(path.join(adminSrc, 'App.tsx'), 'utf8');
const imports = \`// WMS UI
import WarehouseMaster from './pages/warehouse/WarehouseMaster';
import SpatialManager from './pages/warehouse/SpatialManager';
import EquipmentManager from './pages/warehouse/EquipmentManager';
import WarehouseSettings from './pages/warehouse/WarehouseSettings';
\`;
appTsx = appTsx.replace('function RequireAuth', imports + '\\nfunction RequireAuth');

const routes = \`{/* WMS Routes */}
                  <Route path="/warehouse/master" element={<WarehouseMaster />} />
                  <Route path="/warehouse/spatial" element={<SpatialManager />} />
                  <Route path="/warehouse/equipment" element={<EquipmentManager />} />
                  <Route path="/warehouse/settings" element={<WarehouseSettings />} />
                  \`;
appTsx = appTsx.replace('<Route path="/billing"', routes + '\\n                  <Route path="/billing"');
fs.writeFileSync(path.join(adminSrc, 'App.tsx'), appTsx);

// Update Sidebar.tsx
let sidebarTsx = fs.readFileSync(path.join(adminSrc, 'components', 'Sidebar.tsx'), 'utf8');
const wmsSection = \`{ 
        name: 'Warehouse Operations', 
        icon: Box,
        subItems: [
          { name: 'Master Setup', path: '/warehouse/master', icon: Building2 },
          { name: 'Spatial Layout', path: '/warehouse/spatial', icon: Layers },
          { name: 'Equipment Track', path: '/warehouse/equipment', icon: Truck },
          { name: 'WMS Settings', path: '/warehouse/settings', icon: Settings }
        ]
      },
\`;
sidebarTsx = sidebarTsx.replace('{ name: \'Inventory Control\',', wmsSection + '      { name: \'Inventory Control\',');
fs.writeFileSync(path.join(adminSrc, 'components', 'Sidebar.tsx'), sidebarTsx);

console.log("WMS UIs generated and integrated!");
