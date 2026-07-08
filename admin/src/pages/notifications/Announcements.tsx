import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, Pin, Users, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Announcements() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const { data: announcements, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await axios.get('/api/announcements');
      return data;
    }
  });

  const handleBroadcast = async () => {
    try {
      await axios.post('/api/announcements', {
        title,
        content,
        type: 'Info',
        targetAudience: 'Global',
        isPinned: true
      });
      setTitle('');
      setContent('');
      refetch();
    } catch(e) {
      alert('Failed to broadcast');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto grid md:grid-cols-2 gap-8 min-h-full">
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-2">Broadcast company-wide alerts and news.</p>
        </div>

        <Card className="border-indigo-200 shadow-sm">
          <CardHeader className="bg-indigo-50/50 border-b pb-4">
            <CardTitle className="text-lg flex items-center text-indigo-800">
              <Megaphone className="mr-2 h-5 w-5" /> New Broadcast
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Input 
              placeholder="Announcement Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="font-semibold text-lg"
            />
            <Textarea 
              placeholder="Write your message here..." 
              value={content} 
              onChange={e => setContent(e.target.value)}
              className="min-h-[150px]"
            />
            <div className="flex justify-between items-center pt-2">
              <div className="flex space-x-2 text-sm text-slate-500">
                <Badge variant="outline" className="flex items-center"><Users className="mr-1 h-3 w-3"/> Global</Badge>
                <Badge variant="outline" className="flex items-center text-amber-600 bg-amber-50"><Pin className="mr-1 h-3 w-3"/> Pinned</Badge>
              </div>
              <Button onClick={handleBroadcast} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Send className="mr-2 h-4 w-4" /> Publish Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[80vh] pt-4 md:pt-[5.5rem]">
        <h2 className="font-semibold text-slate-500 px-1 mb-2">Live Feed</h2>
        
        {announcements?.length === 0 && (
          <div className="p-12 text-center text-slate-400 border-2 border-dashed rounded-lg">
            No active announcements.
          </div>
        )}

        {announcements?.map((ann: any) => (
          <Card key={ann.id} className={`${ann.isPinned ? 'border-l-4 border-l-amber-500 bg-amber-50/10' : ''}`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{ann.title}</h3>
                {ann.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
              </div>
              <p className="text-slate-600 text-sm">{ann.content}</p>
              <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                <span>By System Admin</span>
                <span>{new Date(ann.createdAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
