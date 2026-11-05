import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center text-3xl font-mono mx-auto mb-6">
          404
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Halaman Tidak Dijumpai
        </h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Halaman yang anda akses sama ada tidak wujud, telah dipadam, atau masih berada dalam status <span className="font-semibold text-amber-400">Draf</span> (belum diterbitkan).
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            Kembali ke Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-all border border-slate-700"
          >
            Laman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
