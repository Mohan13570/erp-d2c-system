import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PromptLibrary() {
  const prompts = [
    { id: '1', name: 'Invoice_OCR_Extract', version: 'v3', targetModel: 'gemini-1.5-pro', status: 'Active' },
    { id: '2', name: 'Support_Auto_Reply', version: 'v12', targetModel: 'gpt-4o', status: 'Active' },
    { id: '3', name: 'Logistics_Route_Optimizer', version: 'v2', targetModel: 'claude-3-opus', status: 'Testing' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Enterprise Prompt Library</h1>
      <p className="text-muted-foreground">Version control and manage system prompts deployed to production AI agents.</p>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Active Version</TableHead>
                <TableHead>Target Model</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.version}</TableCell>
                  <TableCell className="text-indigo-600">{p.targetModel}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'Active' ? 'default' : 'secondary'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
