import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg shadow-primary-500/25 group-hover:shadow-xl group-hover:shadow-primary-500/30 transition-all duration-200">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-base font-bold uppercase tracking-wider text-slate-900">
                PagPro
              </p>
              <span className="text-xs font-semibold text-slate-500">
                Seguro Fiança
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors duration-200"
          >
            Voltar para a landing
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </main>
    </div>
  );
}

