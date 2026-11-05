'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Check,
  QrCode,
  Search,
  FileCode,
  Globe,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import QrCodeModal from '@/components/QrCodeModal';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  htmlContent: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
  };
}

export default function DashboardPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // QR Modal state
  const [selectedQrPage, setSelectedQrPage] = useState<{ title: string; slug: string } | null>(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPages(data.data);
      }
    } catch (err) {
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCopyLink = async (slug: string, id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/p/${slug}`;
      try {
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert(result.error || 'Gagal memadam halaman.');
      }
    } catch (err) {
      console.error('Error deleting page:', err);
      alert('Ralat semasa menyambung ke pelayan.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = pages.length;
  const publishedCount = pages.filter((p) => p.isPublished).length;
  const draftCount = totalPages - publishedCount;

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Mini-CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Urus, sunting, dan pantau status halaman HTML yang anda hoskan secara langsung.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPages}
            title="Muat semula senarai"
            aria-label="Muat semula senarai halaman"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Cipta Halaman Baru</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalPages}</div>
            <div className="text-xs text-slate-400">Jumlah Halaman</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{publishedCount}</div>
            <div className="text-xs text-slate-400">Diterbitkan (Published)</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{draftCount}</div>
            <div className="text-xs text-slate-400">Dalam Draf (Draft)</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari halaman mengikut tajuk atau slug URL..."
          className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">Tajuk (Title)</th>
                <th scope="col" className="px-6 py-4">Slug URL</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Tarikh Cipta</th>
                <th scope="col" className="px-6 py-4 text-right">Tindakan (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                      <span>Memuatkan senarai halaman...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-3">
                      <FileCode className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="font-semibold text-white">
                        {searchQuery ? 'Tiada halaman sepadan ditemui' : 'Belum ada halaman dicipta'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {searchQuery
                          ? `Cuba kata kunci carian yang berbeza untuk "${searchQuery}".`
                          : 'Mulakan dengan mencipta halaman HTML pertama anda sekarang.'}
                      </p>
                      {!searchQuery && (
                        <Link
                          href="/dashboard/create"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl transition-all shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Cipta Halaman Pertama</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Tajuk */}
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex flex-col">
                        <span className="font-semibold">{page.title}</span>
                        <span className="text-[11px] text-slate-500">
                          ID: {page.id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>

                    {/* Slug URL */}
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="text-slate-400">/p/</span>
                      <span className="text-blue-400 font-semibold">{page.slug}</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {page.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Tarikh Cipta */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(page.createdAt).toLocaleDateString('ms-MY', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Tindakan */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Generate QR Code Button */}
                        <button
                          onClick={() => setSelectedQrPage({ title: page.title, slug: page.slug })}
                          title="Generate QR Code"
                          aria-label={`Jana kod QR untuk ${page.title}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <QrCode className="w-4 h-4 text-purple-400" />
                        </button>

                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopyLink(page.slug, page.id)}
                          title="Salin Pautan (Copy Link)"
                          aria-label={`Salin pautan ${page.title}`}
                          className={`p-1.5 rounded-lg transition-colors ${
                            copiedId === page.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          {copiedId === page.id ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Open Link Button */}
                        {page.isPublished ? (
                          <a
                            href={`/p/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka Pautan (Open Link)"
                            aria-label={`Buka pautan ${page.title}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-400" />
                          </a>
                        ) : (
                          <button
                            onClick={() =>
                              alert('Halaman ini masih dalam status Draf. Terbitkan (Publish) dahulu untuk paparan awam.')
                            }
                            title="Halaman masih Draf (tidak boleh dibuka secara awam)"
                            aria-label={`Peringatan draf untuk ${page.title}`}
                            className="p-1.5 rounded-lg bg-slate-800/50 text-slate-600 cursor-not-allowed"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit Button */}
                        <Link
                          href={`/dashboard/edit/${page.id}`}
                          title="Sunting Halaman (Edit)"
                          aria-label={`Sunting ${page.title}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-amber-400" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirmId(page.id)}
                          title="Padam Halaman (Delete)"
                          aria-label={`Padam ${page.title}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-white mb-2">
              Padam Halaman Ini?
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6 leading-relaxed">
              Tindakan ini tidak boleh diundur. Fail HTML dan pautan URL akan dipadam sepenuhnya daripada pelayan pangkalan data.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {deleting ? 'Memadam...' : 'Ya, Padam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQrPage && (
        <QrCodeModal
          isOpen={Boolean(selectedQrPage)}
          onClose={() => setSelectedQrPage(null)}
          title={selectedQrPage.title}
          slug={selectedQrPage.slug}
        />
      )}
    </div>
  );
}
