import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search } from 'lucide-react';

export default function VendorKnowledgeBase() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-support/knowledge-base')
      .then(res => res.json())
      .then(d => setArticles(d))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Self-service guides and FAQs for interacting with our systems.</p>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for articles, guides, or policies..." 
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No articles published yet.</p>
          </div>
        ) : (
          articles.map((a: any) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow cursor-pointer border-t-4 border-t-indigo-600">
              <CardHeader>
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <span className="text-xs font-semibold text-indigo-600 uppercase">{a.category}</span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{a.content}</p>
                <div className="mt-4 text-xs text-gray-400 border-t pt-3">
                  Updated {new Date(a.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
