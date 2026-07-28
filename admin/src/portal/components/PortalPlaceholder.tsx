import { type LucideIcon } from 'lucide-react';

/**
 * PortalPlaceholder — generic stub for modules not yet built.
 * Each module page will replace this component as it is implemented.
 */
export default function PortalPlaceholder({
  title,
  description,
  icon: Icon,
  comingSoon = true,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto mt-16 text-center">
      <div className="inline-flex p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
        <Icon size={32} className="text-sky-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-500 text-sm mb-6">{description}</p>
      {comingSoon && (
        <span className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          Coming next — route scaffold ready
        </span>
      )}
    </div>
  );
}
