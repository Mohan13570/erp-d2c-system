import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Building2, MapPin, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// A highly simplified visual tree renderer for phase 1
const OrgNode = ({ node }: { node: any }) => {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-64 border-2 border-indigo-100 shadow-sm relative z-10 bg-white dark:bg-slate-950">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-full mb-3">
            {node.nodeType === 'Corporate' ? <Building2 className="h-5 w-5 text-indigo-600" /> : 
             node.nodeType === 'Region' ? <MapPin className="h-5 w-5 text-indigo-600" /> :
             <Users className="h-5 w-5 text-indigo-600" />}
          </div>
          <h3 className="font-semibold text-sm">{node.nodeName}</h3>
          <p className="text-xs text-muted-foreground mt-1">{node.nodeType}</p>
        </CardContent>
      </Card>
      
      {node.children && node.children.length > 0 && (
        <div className="relative pt-6 w-full flex justify-center">
          {/* Vertical connecting line from parent */}
          <div className="absolute top-0 left-1/2 w-px h-6 bg-indigo-200 dark:bg-indigo-800 -translate-x-1/2"></div>
          
          {/* Horizontal connecting line across children */}
          {node.children.length > 1 && (
             <div className="absolute top-6 left-[15%] right-[15%] h-px bg-indigo-200 dark:bg-indigo-800"></div>
          )}

          <div className="flex justify-center gap-8 w-full pt-6 relative z-10">
            {node.children.map((child: any) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical line dropping down to child */}
                <div className="absolute -top-6 left-1/2 w-px h-6 bg-indigo-200 dark:bg-indigo-800 -translate-x-1/2"></div>
                <OrgNode node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrganizationChart() {
  const { data: treeData, isLoading } = useQuery({
    queryKey: ['org-tree'],
    queryFn: async () => {
      const { data } = await axios.get('/api/organization/tree');
      return data;
    }
  });

  return (
    <div className="p-8 space-y-6 h-full flex flex-col bg-slate-50/50 dark:bg-slate-900/10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Structure</h1>
          <p className="text-muted-foreground mt-2">Visual hierarchical mapping of corporate entities, branches, and teams.</p>
        </div>
      </div>

      <div className="flex-1 border rounded-xl bg-white dark:bg-slate-950 p-8 overflow-auto flex justify-center min-h-[600px] shadow-inner">
        {isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2">
            <Network className="animate-pulse" /> Loading Enterprise Hierarchy...
          </div>
        ) : treeData && treeData.length > 0 ? (
          <div className="pt-8">
            {treeData.map((rootNode: any) => (
              <OrgNode key={rootNode.id} node={rootNode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Network className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-400">No Hierarchy Configured</h3>
            <p className="text-slate-500 mt-2">Please create Organization Nodes in the API to visualize the tree.</p>
          </div>
        )}
      </div>
    </div>
  );
}
