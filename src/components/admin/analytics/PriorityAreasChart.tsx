"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PriorityAreasChartProps {
  data: { name: string; full_name: string; value: number }[];
}

const COLORS = ["#6370f1", "#4e52e5", "#3f3fca", "#3436a3", "#8093f8", "#a4b9fc", "#efce1a", "#dfb30d"];

export function PriorityAreasChart({ data }: PriorityAreasChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-neutral-400">Sem dados suficientes</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ bottom: 40 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          angle={-30}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#6b7280" }}
          allowDecimals={false}
        />
        <Tooltip
          labelFormatter={(label, payload) => {
            const item = payload?.[0]?.payload;
            return item?.full_name ?? label;
          }}
          formatter={(value: number) => [value, "alunos"]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
