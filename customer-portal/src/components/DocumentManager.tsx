import React, { useState } from 'react';
import { UploadCloud, FileText, Download, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

interface DocumentManagerProps {
  bookingId: string;
  documents: any[];
}

export default function DocumentManager({ bookingId, documents }: DocumentManagerProps) {
  const queryClient = useQueryClient();
  const [docType, setDocType] = useState('Commercial Invoice');
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (data: any) => api.post(`/bookings/${bookingId}/documents`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      setFile(null);
    }
  });

  const handleUpload = () => {
    if (!file) return;
    
    // Simulate upload payload (In real app, use FormData for actual file)
    const payload = {
      documentType: docType,
      documentName: file.name,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedBy: 'Current User'
    };
    
    uploadMutation.mutate(payload);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Document Management
      </h3>

      {/* Upload Zone */}
      <div className="mb-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <select 
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-950 text-sm"
          >
            <option>Commercial Invoice</option>
            <option>Packing List</option>
            <option>Bill of Lading</option>
            <option>Air Waybill</option>
            <option>Certificate of Origin</option>
          </select>
          <input 
            type="file" 
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button 
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents?.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No documents uploaded yet.</p>
        ) : (
          documents?.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{doc.documentType}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> v{doc.versions?.length || 1} • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> {doc.status}
                </span>
                <button 
                  onClick={() => {
                    const fileUrl = doc.versions?.[0]?.fileUrl;
                    if (fileUrl) {
                      window.open(`http://localhost:5000${fileUrl}`, '_blank');
                    } else {
                      alert('Document file URL is missing.');
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" 
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
