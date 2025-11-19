"use client";

import { CreditAnalysis, RiskLevel } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface CreditAnalysisViewProps {
  analysis: CreditAnalysis;
}

const riskLevelLabels: Record<RiskLevel, string> = {
  LOW: "Baixo",
  MEDIUM: "Médio",
  HIGH: "Alto",
};

const riskLevelVariants: Record<RiskLevel, "default" | "success" | "warning" | "danger" | "outline"> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

export function CreditAnalysisView({ analysis }: CreditAnalysisViewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 60) return "text-[#f5c437]";
    if (score >= 45) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-[#f5c437]" />;
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle>Análise de crédito</CardTitle>
        <Badge variant={riskLevelVariants[analysis.riskLevel]}>
          Risco {riskLevelLabels[analysis.riskLevel]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>{getScoreIcon(analysis.score)}</div>
            <div>
              <p className="text-sm text-slate-500">Score</p>
              <p className={`text-3xl font-semibold ${getScoreColor(analysis.score)}`}>
                {analysis.score}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Cobertura máxima</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatCurrency(analysis.maximumCoverage)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Parcela mensal</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatCurrency(analysis.recommendedMonthlyFee)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Taxa de adesão</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatCurrency(analysis.recommendedAdhesionFee)}
            </p>
          </div>
        </div>

        {analysis.analystNotes && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Observações da análise</p>
            <p className="mt-2 text-sm text-slate-700">{analysis.analystNotes}</p>
          </div>
        )}

        {analysis.indicators && Object.keys(analysis.indicators).length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-medium text-slate-900">Indicadores</p>
            <div className="grid gap-2 md:grid-cols-2">
              {Object.entries(analysis.indicators).map(([key, value]) => {
                if (key === "aiGenerated" || key === "aiModel" || key === "aiNotes") {
                  return null;
                }
                return (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-slate-700">
                      {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                    </span>
                    <span className="text-slate-600">
                      {typeof value === "number"
                        ? value.toFixed(2)
                        : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
            {analysis.indicators.aiGenerated === true && (
              <div className="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-700">
                <p className="font-medium">Análise gerada por IA</p>
                {typeof analysis.indicators.aiModel === "string" && (
                  <p>Modelo: {analysis.indicators.aiModel}</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

