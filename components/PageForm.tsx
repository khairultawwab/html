'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug, isValidSlug } from '@/lib/slug';
import {
  Save,
  Send,
  Eye,
  Code2,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

interface PageFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    htmlContent: string;
    isPublished: boolean;
  };
  isEdit?: boolean;
}

const TEMPLATES = [
  {
    name: 'Landing Page Elegan',
    content: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Produk Terkini</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #0f172a; color: #f8fafc; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; }
    .tag { display: inline-block; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; padding: 0.35rem 1rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 1.5rem; }
    h1 { font-size: 3rem; font-weight: 800; margin: 0 0 1rem; line-height: 1.2; background: linear-gradient(to right, #ffffff, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p.lead { font-size: 1.25rem; color: #94a3b8; max-width: 650px; margin: 0 auto 2.5rem; }
    .cta { display: inline-flex; align-items: center; gap: 0.5rem; background: #2563eb; color: white; padding: 0.85rem 2rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600; box-shadow: 0 10px 20px -5px rgba(37,99,235,0.4); }
    .cta:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="tag">🚀 Pelancaran Baru</div>
    <h1>Laman Web HTML Impian Anda</h1>
    <p class="lead">Cipta, kongsi, dan sebarkan reka bentuk HTML anda kepada dunia dalam masa beberapa saat dengan Mini-CMS.</p>
    <a href="#" class="cta">Dapatkan Sekarang &rarr;</a>
  </div>
</body>
</html>`,
  },
  {
    name: 'Kad Profil / Linktree',
    content: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profil Saya</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #18181b; color: #fafafa; min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; padding: 1.5rem; }
    .card { width: 100%; max-width: 400px; background: #27272a; border-radius: 1.5rem; padding: 2rem; text-align: center; border: 1px solid #3f3f46; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .avatar { width: 80px; height: 80px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; font-weight: bold; }
    h2 { margin: 0 0 0.25rem; font-size: 1.35rem; }
    .bio { color: #a1a1aa; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .btn { display: block; padding: 0.85rem; margin-bottom: 0.75rem; background: #3f3f46; color: white; border-radius: 0.75rem; text-decoration: none; font-weight: 500; transition: background 0.2s; }
    .btn:hover { background: #3b82f6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">👨‍💻</div>
    <h2>Ahmad Albab</h2>
    <div class="bio">Pereka Web & Pencipta Kandungan</div>
    <a href="https://instagram.com" class="btn" target="_blank">Instagram</a>
    <a href="https://tiktok.com" class="btn" target="_blank">TikTok</a>
    <a href="https://wa.me/60123456789" class="btn" target="_blank">WhatsApp Saya</a>
  </div>
</body>
</html>`,
  },
  {
    name: 'Pengumuman Promosi',
    content: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Jualan Kilat!</title>
  <style>
    body { font-family: Arial, sans-serif; background: #fff1f2; color: #881337; margin: 0; padding: 2rem; display: flex; justify-content: center; }
    .box { background: white; border: 3px dashed #f43f5e; border-radius: 1rem; padding: 2rem; max-width: 500px; text-align: center; }
    h1 { color: #e11d48; margin-top: 0; }
    .discount { font-size: 3rem; font-weight: bold; color: #e11d48; }
    .code { background: #ffe4e6; padding: 0.5rem 1rem; font-family: monospace; font-size: 1.25rem; border-radius: 0.5rem; display: inline-block; margin: 1rem 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="box">
    <h1>🔥 Jualan Kilat Hujung Minggu!</h1>
    <div class="discount">DISKAUN 50%</div>
    <p>Gunakan kod kupon di bawah semasa pembayaran untuk menikmati tawaran istimewa ini.</p>
    <div class="code">KILAT2026</div>
    <p style="font-size: 0.85rem; color: #9f1239;">*Tertakluk kepada terma & syarat.</p>
  </div>
</body>
</html>`,
  },
];

export default function PageForm({ initialData, isEdit = false }: PageFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugCustom, setIsSlugCustom] = useState(isEdit);
  const [htmlContent, setHtmlContent] = useState(
    initialData?.htmlContent ||
      `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Halaman Baru</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; background: #f8fafc; color: #1e293b; text-align: center; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Selamat Datang ke Halaman HTML Saya</h1>
  <p>Sunting kandungan ini mengikut kreativiti anda.</p>
</body>
</html>`
  );

  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle title change and auto-generate slug if not manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugCustom(true);
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
  };

  const handleAutoSlug = () => {
    setSlug(generateSlug(title));
    setIsSlugCustom(false);
  };

  const handleInsertTemplate = (content: string) => {
    if (confirm('Gantikan kandungan kod HTML dengan templat ini?')) {
      setHtmlContent(content);
    }
  };

  const handleSubmit = async (publishStatus: boolean) => {
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!title.trim()) {
      setErrorMsg('Sila masukkan Tajuk Halaman.');
      return;
    }

    const cleanSlug = generateSlug(slug || title);
    if (!isValidSlug(cleanSlug)) {
      setErrorMsg('Slug tidak sah. Pastikan slug hanya mengandungi huruf kecil, nombor, dan tanda sempang (-).');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isEdit ? `/api/pages/${initialData?.id}` : '/api/pages';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: cleanSlug,
          htmlContent,
          isPublished: publishStatus,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Berlaku ralat semasa menyimpan.');
      }

      setSuccessMsg(
        publishStatus
          ? 'Halaman berjaya diterbitkan!'
          : 'Halaman berjaya disimpan sebagai draf!'
      );

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ralat sambungan rangkaian.');
    } finally {
      setLoading(false);
    }
  };

  const slugIsValid = isValidSlug(generateSlug(slug || title));

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isEdit ? 'Kemaskini Halaman HTML' : 'Cipta Halaman HTML Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEdit
                ? 'Ubah suai kandungan kod HTML, pautan URL (slug), atau status penerbitan.'
                : 'Masukkan kod HTML mentah dan konfigurasikan slug untuk hoskan halaman anda.'}
            </p>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Simpan Draf</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Terbitkan (Publish)'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold">Ralat Pendaftaran Halaman</p>
            <p className="text-rose-200/90 text-xs mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {/* Form Fields Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        {/* Title Field */}
        <div>
          <label
            htmlFor="page-title"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
          >
            Tajuk Halaman (Title) <span className="text-rose-400">*</span>
          </label>
          <input
            id="page-title"
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="cth: Laman Pendaratan Produk 2026"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-colors"
          />
        </div>

        {/* Slug Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="page-slug"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
            >
              URL Kustom (Slug) <span className="text-rose-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleAutoSlug}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Jana Semula dari Tajuk
            </button>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-500 text-xs font-mono select-none">
              /p/
            </span>
            <input
              id="page-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="produk-2026"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-950 border rounded-xl text-white text-sm font-mono outline-none transition-colors ${
                slugIsValid
                  ? 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'border-rose-500/50 focus:border-rose-500'
              }`}
            />
            {slugIsValid ? (
              <span className="absolute right-3 text-emerald-400 text-xs">✓</span>
            ) : (
              <span className="absolute right-3 text-rose-400 text-xs">✗</span>
            )}
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Editor Toolbar */}
        <div className="bg-slate-950/70 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Kod HTML Mentah</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratonton Langsung</span>
            </button>
          </div>

          {/* Quick Template Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Templat Segera:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertTemplate(tmpl.content)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor or Preview Pane */}
        {activeTab === 'code' ? (
          <div className="relative">
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              rows={22}
              aria-label="Kod HTML Mentah"
              placeholder="Tampal kod HTML lengkap di sini (termasuk tag <style>, <script>, dll)..."
              className="w-full p-4 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 outline-none resize-y border-none leading-relaxed selection:bg-blue-500/30"
              spellCheck={false}
            />
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{htmlContent.length} aksara • HTML5 Raw</span>
              <span>Kandungan dipaparkan terus via dangerouslySetInnerHTML</span>
            </div>
          </div>
        ) : (
          <div className="bg-white min-h-[500px] w-full overflow-hidden">
            <iframe
              srcDoc={htmlContent}
              title="Pratonton Halaman HTML"
              sandbox="allow-scripts allow-same-origin allow-forms"
              className="w-full h-[550px] border-none"
            />
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-sm font-medium rounded-xl transition-colors"
        >
          Batal
        </Link>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit(false)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-slate-400" />
          <span>Simpan Draf</span>
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Menyimpan...' : 'Terbitkan (Publish)'}</span>
        </button>
      </div>
    </div>
  );
}
