import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-semibold uppercase tracking-wide text-primary">
              PagPro
            </p>
            <span className="text-xs font-medium text-slate-500">
              Seguro Fiança
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 hover:text-primary"
        >
          Voltar para a landing
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}

