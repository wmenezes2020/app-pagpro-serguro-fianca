"use client";

export function LoadingScreen() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm font-medium text-slate-600">
        Carregando informações...
      </p>
    </div>
  );
}

