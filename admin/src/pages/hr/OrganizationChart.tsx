import React, { useEffect, useState } from 'react';
import { Users, Building2, ChevronDown } from 'lucide-react';

const TreeNode = ({ node }: { node: any }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col items-center">
      <div 
         className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 w-64 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all relative z-10"
         onClick={() => setExpanded(!expanded)}
      >
         <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
               {node.title.charAt(0)}
            </div>
            <div>
               <p className="font-bold text-gray-900 text-sm leading-tight">{node.name}</p>
               <p className="text-xs text-indigo-600 font-medium">{node.title}</p>
            </div>
         </div>
         {node.children && node.children.length > 0 && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-500 rounded-full p-0.5 border border-white">
               <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </div>
         )}
      </div>

      {expanded && node.children && node.children.length > 0 && (
        <div className="relative flex justify-center mt-8 pt-4 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:h-4 before:bg-gray-300">
          <div className="absolute top-4 left-0 right-0 h-px bg-gray-300" style={{ width: `calc(100% - ${100 / node.children.length}%)`, left: `calc(${50 / node.children.length}%)` }}></div>
          {node.children.map((child: any, idx: number) => (
            <div key={child.id} className="relative px-4 pt-4 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:h-4 before:bg-gray-300">
              <TreeNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function OrganizationChart() {
  const [orgData, setOrgData] = useState<any>(null);

  useEffect(() => {
    // Simulating API Call to HREmployeeEngine.getOrganizationChart()
    setOrgData({
      id: "ORG-1",
      name: "Global Freight Logistics",
      title: "CEO",
      children: [
        {
           id: "ORG-2",
           name: "Operations Department",
           title: "Head of Operations",
           children: [
              { id: "ORG-4", name: "Ocean Freight", title: "Manager" },
              { id: "ORG-5", name: "Air Freight", title: "Manager" }
           ]
        },
        {
           id: "ORG-3",
           name: "Finance Department",
           title: "CFO",
           children: [
              { id: "ORG-6", name: "Accounts Payable", title: "Lead" },
              { id: "ORG-7", name: "Accounts Receivable", title: "Lead" }
           ]
        }
      ]
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Hierarchy</h1>
          <p className="text-sm text-gray-500 mt-1">Interactive map of reporting structures and departments.</p>
        </div>
        <div className="flex space-x-3 text-sm">
           <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Export PDF</button>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-3xl border border-gray-100 shadow-inner overflow-x-auto p-12 min-h-[600px] flex justify-center items-start">
         {orgData ? <TreeNode node={orgData} /> : <div className="text-gray-400">Loading hierarchy...</div>}
      </div>
    </div>
  );
}
