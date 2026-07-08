import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileCode2 } from 'lucide-react';

export default function TemplateBuilder() {
  const [channel, setChannel] = useState('Email');
  
  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Builder</h1>
          <p className="text-muted-foreground mt-2">Design parameterized layouts for automated routing.</p>
        </div>
        <Button className="bg-indigo-600 text-white"><Save className="mr-2 h-4 w-4"/> Save Template</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Channel Setting</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant={channel === 'Email' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setChannel('Email')}>Email HTML</Button>
              <Button variant={channel === 'SMS' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setChannel('SMS')}>SMS Text</Button>
              <Button variant={channel === 'WhatsApp' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setChannel('WhatsApp')}>WhatsApp Block</Button>
              <Button variant={channel === 'Push' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setChannel('Push')}>In-App Web Push</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">System Variables</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded border">
                <li><code>{`{{user.firstName}}`}</code></li>
                <li><code>{`{{entity.id}}`}</code></li>
                <li><code>{`{{workflow.status}}`}</code></li>
                <li><code>{`{{company.name}}`}</code></li>
              </ul>
              <p className="text-xs text-slate-400 mt-3">Click to copy variable to clipboard.</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row justify-between border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center"><FileCode2 className="mr-2 h-5 w-5"/> Designer</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Template Name</label>
                <Input placeholder="e.g. Invoice Approval Reminder" />
              </div>
              
              {channel === 'Email' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Subject Line</label>
                  <Input placeholder="Action Required: Invoice {{entity.id}} is pending" />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Message Body</label>
                <Textarea 
                  className="min-h-[400px] font-mono text-sm" 
                  placeholder={channel === 'Email' ? "<h1>Hello {{user.firstName}},</h1>\n<p>Please review...</p>" : "Hello {{user.firstName}}, your OTP is {{otp.code}}"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
