import { ChartPoint } from '../shared/model/chart-point.interface';
import { SpecializationGroup } from '../shared/model/specialization-group.interface';

const FILTER_PALETTE = [
  '#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9',
  '#c45850', '#a8d8ea', '#ffab91', '#c5e1a5'
];

export function getFilterColor(idx: number): string {
  return FILTER_PALETTE[idx % FILTER_PALETTE.length];
}

export function flattenGroupsToChartPoints(
  allGroups: { year: number; county: string; data: SpecializationGroup[] }[]
): ChartPoint[] {
  const rawPoints: ChartPoint[] = [];

  for (const { year, county, data } of allGroups) {
    for (const group of data) {
      const raw = group.lastCandidate?.madm;
      if (!raw) continue;

      const madm = parseFloat(raw.replace(',', '.'));
      if (isNaN(madm)) continue;

      const spec = group.specialization.replace(/\(.*?\)/g, '').trim();

      rawPoints.push({
        year,
        school: group.school,
        specialization: spec,
        language: group.language,
        madm,
        county,
        label: `${group.school} | ${spec}`,
      });
    }
  }

  const uniqueMap = new Map<string, ChartPoint>();
  for (const p of rawPoints) {
    const key = `${p.county}|${p.school}|${p.specialization}|${p.year}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, p);
    } else {
      const existing = uniqueMap.get(key)!;
      existing.madm = Math.max(existing.madm, p.madm);
    }
  }

  return Array.from(uniqueMap.values());
}

export function toChartJSData(
  points: ChartPoint[],
  filters: { school?: string; spec?: string }
): { datasets: any[] } {
  if (!filters.school && !filters.spec) {
    return { datasets: [] };
  }

  const filtered = points.filter(p => {
    if (filters.school && p.school !== filters.school) return false;
    if (filters.spec && p.specialization !== filters.spec) return false;
    return true;
  });

  const grouped = new Map<string, ChartPoint[]>();
  for (const p of filtered) {
    if (!grouped.has(p.label)) grouped.set(p.label, []);
    grouped.get(p.label)!.push(p);
  }

  const datasets = Array.from(grouped.entries()).map(([label, pts], i) => ({
    label,
    data: pts.map(pt => ({ x: pt.year, y: pt.madm })),
    fill: false,
    borderColor: getFilterColor(i),
    tension: 0.2,
  }));

  return { datasets };
}
