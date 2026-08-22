import {DatePipe, NgStyle} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {CdkDrag, CdkDragEnd} from '@angular/cdk/drag-drop';
import {CdkScrollable} from '@angular/cdk/scrolling';

import {
  ResourceTimelineColumn,
  ResourceTimelineItem,
  ResourceTimelineItemMove,
  ResourceTimelineRange,
  ResourceTimelineRow,
  ResourceTimelineSlotClick,
} from '../../shared/interfaces/resource-timeline.interface';

import {
  generateTimeColumns,
  getSnapMs,
  snapDurationMs,
  toDate,
} from '../../shared/utils/resource-timeline.utils';

const HOUR_WIDTH = 72;

const DEFAULT_COLUMNS: ResourceTimelineColumn[] = [
  {
    id: 'label',
    label: 'Lekarz',
    value: row => row.label,
  },
];

@Component({
  selector: 'app-resource-timeline',
  imports: [CdkDrag, CdkScrollable, DatePipe, NgStyle],
  template: `
    <div class="timeline" cdkScrollable>
      <div class="timeline__sidebar">
        <div class="timeline__sidebar-header">
          @for (column of columns(); track column.id) {
            <div class="timeline__sidebar-cell">{{ column.label }}</div>
          }
        </div>

        @for (row of rows(); track row.id) {
          <div class="timeline__sidebar-row">
            @for (column of columns(); track column.id) {
              <div class="timeline__sidebar-cell">
                {{ getColumnValue(column, row) }}
              </div>
            }
          </div>
        }
      </div>

      <div class="timeline__content">
        <div class="timeline__time-header">
          @for (column of timeColumns(); track column.id) {
            <div class="timeline__time-cell">
              {{ column.start | date: 'HH:mm' }}
            </div>
          }
        </div>

        @for (row of rows(); track row.id) {
          <div class="timeline__row">
            @for (column of timeColumns(); track column.id; let columnIndex = $index) {
              <button
                type="button"
                class="timeline__slot"
                (click)="onSlotClick(row.id, columnIndex)">
              </button>
            }

            @for (item of itemsByRow().get(row.id) ?? []; track item.id) {
              <button
                type="button"
                class="timeline__item"
                cdkDrag
                cdkDragLockAxis="x"
                [cdkDragData]="item"
                [ngStyle]="getItemStyle(item)"
                (click)="onItemClick($event, item)"
                (cdkDragEnded)="onItemDragEnded($event, item)">
                <span class="timeline__item-title">{{ item.title }}</span>

                @if (item.subtitle) {
                  <span class="timeline__item-subtitle">{{ item.subtitle }}</span>
                }
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
    }

    .timeline {
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      width: 100%;
      max-width: 100%;
      height: 520px;
      overflow: auto;
      border: 1px solid #e5e7eb;
      background: #fff;
    }

    .timeline__content {
      width: max-content;
      min-width: 0;
    }

    .timeline__time-header {
      position: sticky;
      top: 0;
      z-index: 3;
      display: flex;
      width: max-content;
      height: 48px;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .timeline__row {
      position: relative;
      display: flex;
      width: max-content;
      height: 64px;
      border-bottom: 1px solid #e5e7eb;
    }

    .timeline__sidebar {
      position: sticky;
      left: 0;
      z-index: 4;
      background: #fff;
      border-right: 1px solid #e5e7eb;
    }

    .timeline__sidebar-header {
      position: sticky;
      top: 0;
      z-index: 5;
      height: 48px;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .timeline__sidebar-row {
      height: 64px;
      border-bottom: 1px solid #e5e7eb;
    }

    .timeline__sidebar-cell {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 12px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }

    .timeline__time-cell,
    .timeline__slot {
      flex: 0 0 72px;
      width: 72px;
    }

    .timeline__time-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e5e7eb;
      font-size: 13px;
      color: #64748b;
    }

    .timeline__slot {
      height: 64px;
      border: 0;
      border-right: 1px solid #eef2f7;
      background: transparent;
      cursor: pointer;
    }

    .timeline__slot:hover {
      background: rgba(13, 110, 253, 0.08);
    }

    .timeline__item {
      position: absolute;
      top: 11px;
      height: 42px;
      padding: 0 12px;
      border: 0;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #fff;
      text-align: left;
      cursor: move;
      z-index: 2;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.16);
    }

    .timeline__item-title,
    .timeline__item-subtitle {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .timeline__item-title {
      font-size: 13px;
      font-weight: 700;
    }

    .timeline__item-subtitle {
      margin-top: 2px;
      font-size: 11px;
      opacity: 0.9;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 5px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceTimelineComponent {
  rows = input.required<ResourceTimelineRow[]>();
  items = input.required<ResourceTimelineItem[]>();
  range = input.required<ResourceTimelineRange>();
  columns = input<ResourceTimelineColumn[]>(DEFAULT_COLUMNS);
  snapMinutes = input(30);

  slotClicked = output<ResourceTimelineSlotClick>();
  itemClicked = output<ResourceTimelineItem>();
  itemMoved = output<ResourceTimelineItemMove>();

  private suppressClickForItemId: string | null = null;

  protected readonly timeColumns = computed(() => generateTimeColumns(this.range()));

  protected readonly itemsByRow = computed(() => {
    const map = new Map<string, ResourceTimelineItem[]>();

    for (const row of this.rows()) {
      map.set(row.id, []);
    }

    for (const item of this.items()) {
      const rowItems = map.get(item.rowId) ?? [];
      rowItems.push(item);
      map.set(item.rowId, rowItems);
    }

    return map;
  });

  protected getColumnValue(column: ResourceTimelineColumn, row: ResourceTimelineRow): string {
    const value = column.value(row);
    return value == null ? '' : String(value);
  }

  protected onSlotClick(rowId: string, columnIndex: number): void {
    const column = this.timeColumns()[columnIndex];

    this.slotClicked.emit({
      rowId,
      start: column.start,
      end: column.end,
    });
  }

  protected onItemClick(event: MouseEvent, item: ResourceTimelineItem): void {
    if (this.suppressClickForItemId === item.id) {
      event.preventDefault();
      event.stopPropagation();
      this.suppressClickForItemId = null;
      return;
    }

    this.itemClicked.emit(item);
  }

  protected onItemDragEnded(event: CdkDragEnd<ResourceTimelineItem>, item: ResourceTimelineItem): void {
    const distanceX = event.distance.x;

    event.source.reset();

    if (Math.abs(distanceX) <= 3) {
      return;
    }

    const hourMs = 60 * 60 * 1000;
    const rawMovedMs = (distanceX / HOUR_WIDTH) * hourMs;
    const movedMs = snapDurationMs(
      rawMovedMs,
      getSnapMs(this.range(), this.snapMinutes()),
    );

    this.suppressClickForItemId = item.id;

    this.itemMoved.emit({
      item,
      start: new Date(toDate(item.start).getTime() + movedMs),
      end: new Date(toDate(item.end).getTime() + movedMs),
    });
  }

  protected getItemStyle(item: ResourceTimelineItem): Record<string, string> {
    const rangeStart = toDate(this.range().start).getTime();
    const itemStart = toDate(item.start).getTime();
    const itemEnd = toDate(item.end).getTime();

    const left = ((itemStart - rangeStart) / (60 * 60 * 1000)) * HOUR_WIDTH;
    const width = ((itemEnd - itemStart) / (60 * 60 * 1000)) * HOUR_WIDTH;

    return {
      left: `${left}px`,
      width: `${Math.max(width, 4)}px`,
      background: '#16a34a',
    };
  }
}
