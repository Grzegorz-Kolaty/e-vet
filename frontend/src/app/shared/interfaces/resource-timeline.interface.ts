export type ResourceTimelineUnit = 'hour' | 'day';

export interface ResourceTimelineRange {
  start: string | Date;
  end: string | Date;
  unit: ResourceTimelineUnit;
}

export interface ResourceTimelineRow {
  id: string;
  label: string;
  progress?: number;
  avatarUrl?: string;
  parentId?: string;
  expanded?: boolean;
}

export interface ResourceTimelineItem {
  id: string;
  rowId: string;
  title: string;
  subtitle?: string;
  start: string | Date;
  end: string | Date;
  progress?: number;
  selected?: boolean;
}

export interface ResourceTimelineColumn {
  id: string;
  label: string;
  value: (row: ResourceTimelineRow) => string | number | null | undefined;
}

export interface ResourceTimelineSlotClick {
  rowId: string;
  start: Date;
  end: Date;
}

export interface ResourceTimelineItemMove {
  item: ResourceTimelineItem;
  start: Date;
  end: Date;
}

export interface ResourceTimelineTimeColumn {
  id: string;
  start: Date;
  end: Date;
}
