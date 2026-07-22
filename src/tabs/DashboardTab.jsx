import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import StatCard from "../components/StatCard.jsx";
import { totals as computeTotals, monthlyAgg as computeMonthly } from "../lib/stats.js";

export default function DashboardTab({ T, days }) {
  const totals = useMemo(() => computeTotals(days), [days]);
  const monthlyAgg = useMemo(() => computeMonthly(days), [days]);

  return (
    <div className="pb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard T={T} label="Грехов всего" value={totals.sins} color={T.accent2} />
        <StatCard T={T} label="Благих дел всего" value={totals.good} color={T.good} />
        <StatCard T={T} label="Баланс" value={totals.balance > 0 ? `+${totals.balance}` : totals.balance} />
        <StatCard T={T} label="Дней с намазом вовремя" value={totals.namazDays} color={T.good} />
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }} className="p-4">
        <h3 style={{ fontFamily: T.displayFont, color: T.text }} className="text-sm font-bold mb-4">
          Грехи и благие дела по месяцам
        </h3>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <ResponsiveContainer width="100%" height={260} minWidth={280}>
            <BarChart data={monthlyAgg}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="month" stroke={T.muted} fontSize={12} />
              <YAxis stroke={T.muted} fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, color: T.text, fontSize: 12, borderRadius: 8 }}
                cursor={{ fill: T.border, opacity: 0.3 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: T.muted }} />
              <Bar dataKey="Грехи" fill={T.accent2} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Благие дела" fill={T.good} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
