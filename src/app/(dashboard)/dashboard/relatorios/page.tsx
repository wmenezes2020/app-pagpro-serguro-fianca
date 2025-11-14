"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Relatórios e indicadores avançados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <p>
          Este módulo está preparado para se conectar ao seu data warehouse ou
          ferramenta de BI preferida. Utilize as APIs da PagPro para extrair
          dados de solicitações, análises, apólices e pagamentos.
        </p>
        <p>
          Recomendações:
          <br />• Conecte o endpoint `/applications` ao seu pipeline de dados.
          <br />• Atualize indicadores a cada 5 minutos para decisões em tempo
          real.
          <br />• Estruture dashboards para inadimplência, tempo médio de
          aprovação e engajamento dos parceiros.
        </p>
      </CardContent>
    </Card>
  );
}

