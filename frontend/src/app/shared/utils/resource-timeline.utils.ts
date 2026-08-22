import {
  ResourceTimelineRange,
  ResourceTimelineTimeColumn,
  ResourceTimelineUnit
} from "../interfaces/resource-timeline.interface";


const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function getUnitMs(unit: ResourceTimelineUnit): number {
  return unit === 'hour' ? HOUR_MS : DAY_MS;
}

export function addUnit(date: Date, unit: ResourceTimelineUnit): Date {
  return new Date(date.getTime() + getUnitMs(unit));
}

export function generateTimeColumns(range: ResourceTimelineRange): ResourceTimelineTimeColumn[] {
  const start = toDate(range.start);
  const end = toDate(range.end);
  const columns: ResourceTimelineTimeColumn[] = [];

  let current = new Date(start);

  while (current < end) {
    const next = addUnit(current, range.unit);

    columns.push({
      id: current.toISOString(),
      start: new Date(current),
      end: next,
    });

    current = next;
  }

  return columns;
}


export function getSnapMs(range: ResourceTimelineRange, snapMinutes: number): number {
  return range.unit === 'hour'
    ? snapMinutes * 60 * 1000
    : DAY_MS;
}

export function snapDurationMs(durationMs: number, snapMs: number): number {
  return Math.round(durationMs / snapMs) * snapMs;
}
