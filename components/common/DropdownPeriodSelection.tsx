"ue";

import { parseAsNumberLiteral, useQueryState } from "nuqs";

export const PERIOD_VALUES = [7, 14, 30, 60];

export const PERIOD_OPTIONS = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 60, label: "Last 60 days" },
] as const;

export default function DropdownPeriodSelection({
  fetchData,
  disabled = false,
}: {
  fetchData: (period: number) => Promise<boolean>;
  disabled: boolean;
}) {
  const [period, setPeriod] = useQueryState(
    "period",
    parseAsNumberLiteral(PERIOD_VALUES).withDefault(30),
  );

  async function handlePeriodChange(newPeriod: number) {
    const oldPeriod = period;
    setPeriod(newPeriod);
    const isSuccess = await fetchData(newPeriod);
    if (!isSuccess) setPeriod(oldPeriod);
  }

  return (
    <select
      value={period}
      onChange={(e) => handlePeriodChange(Number(e.target.value))}
      disabled={disabled}
      className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white disabled:bg-gray-200 dark:bg-zinc-800 dark:disabled:bg-zinc-600 text-zinc-900 dark:text-zinc-50 cursor-pointer disabled:cursor-not-allowed"
    >
      {PERIOD_OPTIONS.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
}
