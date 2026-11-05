import Link from 'next/link';
import { prisma, getOrCreateDefaultUser } from '@/lib/prisma';
import {
  Code,
  LayoutDashboard,
  Plus,
  ExternalLink,
  ShieldCheck,
  Zap,
  QrCode,
  Database,
  ArrowRight,
  Globe,
  Layers,
} from 'lucide-react';

export default async function HomePage() {
  await getOrCreateDefaultUser();
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  const publishedPages = pages.filter((p) => p.isPublished);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Next.js 15 • Prisma v6 • PostgreSQL 15
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Hosting Halaman HTML Mentah <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Pantas, Ringkas & Berkesan
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Platform Mini-CMS untuk memuat naik dan menguruskan halaman kod HTML anda secara langsung. Dilengkapi dengan pengesahan slug tersuai, kod QR automatik, dan pangkalan data relasi sebenar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-0.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Buka Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>Cipta Halaman Baru</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Next.js 15 App Router</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pematuhan 100% spesifikasi terkini di mana parameter dinamik <code className="text-blue-300 font-mono">params</code> diurus sebagai Promise dan di-await.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Jana Kod QR Pantas</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrasi pakej <code className="text-purple-300 font-mono">qrcode.react</code> untuk menjana imej kod QR siap muat turun ke pautan <code className="text-purple-300 font-mono">/p/[slug]</code>.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Prisma v6 & PostgreSQL</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pangkalan data PostgreSQL aktif dengan skema Prisma terstruktur bagi model User dan Page dengan keselamatan data tinggi.
          </p>
        </div>
      </section>

      {/* Featured / Recent Pages */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Halaman Diterbitkan Terkini
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Lihat contoh halaman HTML yang kini boleh diakses secara langsung di bawah laluan awam.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Lihat Semua di Dashboard &rarr;
          </Link>
        </div>

        {publishedPages.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Belum ada halaman diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedPages.map((page) => (
              <div
                key={page.id}
                className="group bg-slate-900/70 hover:bg-slate-800/70 border border-slate-800 hover:border-blue-500/40 p-5 rounded-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Published
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      /p/{page.slug}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {page.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Dicipta pada{' '}
                    {new Date(page.createdAt).toLocaleDateString('ms-MY', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`/p/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <span>Buka Halaman</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href={`/dashboard/edit/${page.id}`}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Sunting
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
