import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 group-hover:bg-gray-800 transition-all duration-200">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                PagPro
              </p>
              <span className="text-xs font-medium text-gray-500">
                Finance
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
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

