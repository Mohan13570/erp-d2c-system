import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import { Megaphone, Plus, Pin, Calendar, AlertTriangle, Info, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function EmployeeAnnouncements() {
  const { user } = useEmployeeAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // HR Post Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Info');
  const [isPinned, setIsPinned] = useState(false);
  const [posting, setPosting] = useState(false);

  const isHRAdmin = user?.role === 'hr_admin';

  const loadAnnouncements = () => {
    setLoading(true);
    employeePortalService.getAnnouncements()
      .then(res => {
        if (res.data.success) setAnnouncements(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);

    try {
      await employeePortalService.createAnnouncement({
        title,
        content,
        type,
        isPinned
      });
      setShowModal(false);
      setTitle('');
      setContent('');
      setIsPinned(false);
      loadAnnouncements();
      alert('Announcement posted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to post announcement');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* ── Breadcrumbs & Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight size={12} />
            <span>Employee Portal</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-bold">Announcements</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Company Announcements
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Official corporate broadcasts, holiday schedules, and policy notices.
          </p>
        </div>

        {isHRAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all self-start sm:self-auto"
          >
            <Plus size={16} /> Post Announcement
          </button>
        )}
      </div>

      {/* ── Announcements Feed List ───────────────────────────────────────── */}
      <div className="space-y-4">
        {announcements.map((a, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border transition-all space-y-3 bg-white shadow-sm ${
              a.isPinned
                ? 'border-purple-300 ring-1 ring-purple-100'
                : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  a.type === 'Emergency'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : a.type === 'Holiday'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {a.type || 'Info'}
                </span>

                {a.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    <Pin size={10} /> Pinned
                  </span>
                )}
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900">{a.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-normal">{a.content}</p>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200/80 rounded-2xl font-medium text-xs shadow-sm">
            No company announcements posted yet.
          </div>
        )}
      </div>

      {/* ── Post Announcement Modal (HR Admin Only) ───────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone size={18} className="text-purple-600" /> Post New Announcement (HR Admin)
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Announcement Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 font-medium"
                  placeholder="e.g. Q3 Townhall Meeting & Holiday Notice"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Broadcast Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 font-semibold"
                  >
                    <option value="Info">Info Broadcast</option>
                    <option value="Holiday">Holiday Notice</option>
                    <option value="Emergency">Emergency Alert</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Pinning</label>
                  <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={e => setIsPinned(e.target.checked)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Pin to top of feed</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Announcement Content</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 font-medium"
                  placeholder="Write the full announcement body text..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  {posting ? 'Posting...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
