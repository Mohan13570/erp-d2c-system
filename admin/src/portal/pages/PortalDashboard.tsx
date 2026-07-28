import { usePortalUser } from '../hooks/usePortalUser';
import {
  Package, FileText, CreditCard, ShieldCheck,
  RotateCcw, HeadphonesIcon, ArrowRight, CheckCircle2,
  Activity, Globe, Clock,
} from 'lucide-react';

const MODULE_CARDS = [
  { label: 'My Shipments',   icon: Package,         color: 'sky',     href: '/portal/shipments',  desc: 'Track and manage all your shipments in real-time' },
  { label: 'Quotations',     icon: FileText,         color: 'violet',  href: '/portal/quotations', desc: 'Request and review freight quotations' },
  { label: 'Billing',        icon: CreditCard,       color: 'emerald', href: '/portal/billing',    desc: 'View invoices and make payments' },
  { label: 'Claims',         icon: ShieldCheck,      color: 'amber',   href: '/portal/claims',     desc: 'File and track insurance claims' },
  { label: 'Returns',        icon: RotateCcw,        color: 'rose',    href: '/portal/returns',    desc: 'Initiate and monitor return requests' },
  { label: 'Support',        icon: HeadphonesIcon,   color: 'indigo',  href: '/portal/support',    desc: 'Raise tickets and chat with support' },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  sky:     { bg: 'bg-sky-500/10',     text: 'text-sky-400',     border: 'border-sky-500/20',     glow: 'shadow-sky-500/10'     },
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20',  glow: 'shadow-violet-500/10'  },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20',   glow: 'shadow-amber-500/10'   },
  rose:    { bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/20',    glow: 'shadow-rose-500/10'    },
  indigo:  { bg: 'bg-indigo-500/10',  text: 'text-indigo-400',  border: 'border-indigo-500/20',  glow: 'shadow-indigo-500/10'  },
};

const STAT_ITEMS = [
  { label: 'Active Shipments', value: '—', icon: Activity,  sub: 'Loading from API...' },
  { label: 'Open Invoices',    value: '—', icon: CreditCard, sub: 'Loading from API...' },
  { label: 'Pending Quotes',   value: '—', icon: FileText,   sub: 'Loading from API...' },
  { label: 'Live Tracking',    value: '—', icon: Globe,      sub: 'Loading from API...' },
];

/**
 * PortalDashboard — landing page for authenticated customers at /portal
 *
 * This is the placeholder proving the /portal route tree is live and isolated.
 * API calls will be wired once the backend scoping (customerId from JWT) is confirmed.
 */
export default function PortalDashboard() {
  const { user } = usePortalUser();

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ── Welcome header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400 tracking-widest uppercase">
              Portal Active · /portal/* namespace
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.firstName ?? 'Customer'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {user?.companyName ?? 'Your Company'} · Customer Portal
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <Clock size={13} className="text-slate-500" />
          <span className="text-xs text-slate-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* ── Proof-of-isolation banner ───────────────────────────────────────── */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-4">
        <CheckCircle2 size={20} className="text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-300">Route isolation confirmed ✓</p>
          <p className="text-xs text-slate-400 mt-1">
            You are inside the <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">/portal/*</code> route
            namespace. The admin ERP lives at{' '}
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300">/admin/*</code> and is completely separate —
            different auth context, different API service layer, different layout.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['PortalAuthContext', 'PortalGuard', 'PortalLayout', 'portalApi.ts', 'usePortalUser'].map(f => (
              <code key={f} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-slate-400">{f}</code>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_ITEMS.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
              <Icon size={15} className="text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-[10px] text-slate-600 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Module cards ────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Your Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_CARDS.map(({ label, icon: Icon, color, href, desc }) => {
            const c = COLOR_MAP[color];
            return (
              <a
                key={label}
                href={href}
                className={`group relative bg-white/[0.03] hover:bg-white/[0.06] border ${c.border} rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${c.glow} cursor-pointer`}
              >
                <div className={`inline-flex p-2.5 rounded-lg ${c.bg} mb-4`}>
                  <Icon size={18} className={c.text} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{label}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
                <ArrowRight
                  size={14}
                  className={`absolute top-5 right-5 ${c.text} opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-150`}
                />
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}
