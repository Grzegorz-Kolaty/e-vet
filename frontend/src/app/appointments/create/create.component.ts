import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {Router} from '@angular/router';

import {AppointmentsService} from '../../shared/data-access/appointments.service';
import {AuthService} from '../../shared/data-access/auth.service';

import {Role} from '../../shared/interfaces/user.interface';
import {
  ResourceTimelineItem, ResourceTimelineItemMove,
  ResourceTimelineRange,
  ResourceTimelineRow, ResourceTimelineSlotClick
} from "../../shared/interfaces/resource-timeline.interface";
import {ResourceTimelineComponent} from "../ui/resource-timeline.component";


interface PendingSlotSelection {
  rowId: string;
  start: Date;
}

interface VetAvailabilityBlock {
  id: string;
  rowId: string;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-create',
  imports: [
    ResourceTimelineComponent
  ],
  template: `
    <app-resource-timeline
      [rows]="rows()"
      [items]="items()"
      [range]="range()"
      (slotClicked)="onSlotClicked($event)"
      (itemMoved)="onItemMoved($event)"
    />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateComponent {
  private readonly authService = inject(AuthService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly router = inject(Router);

  readonly user = this.authService.user
  readonly pendingSelection = signal<PendingSlotSelection | null>(null);

  readonly range = signal<ResourceTimelineRange>({
    start: new Date(2026, 1, 3, 0, 0),
    end: new Date(2026, 1, 6, 0, 0),
    unit: 'hour'
  });

  readonly rows = signal<ResourceTimelineRow[]>([
    {id: 'vet-1', label: 'Anna Nowak', progress: 80},
    {id: 'vet-2', label: 'Jan Kowalski', progress: 45},
    {id: 'vet-3', label: 'Marta Zielinska', progress: 60},
  ]);

  readonly availabilities = signal<VetAvailabilityBlock[]>([]);


  readonly items = computed<ResourceTimelineItem[]>(() => {
    const availabilityItems: ResourceTimelineItem[] = this.availabilities().map(block => ({
      id: block.id,
      rowId: block.rowId,
      type: 'availability',
      title: 'Dostępność',
      subtitle: `${block.start.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${block.end.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      start: block.start,
      end: block.end,
      color: '#16a34a',
    }));

    return [...availabilityItems];
  });

  constructor() {
    effect(() => {
      if (!this.authService.initialized()) {
        return;
      }

      const user = this.authService.user();

      if (!user) {
        this.router.navigate(['auth', 'login']);
        return;
      }

      if (user.role !== Role.Vet) {
        this.router.navigate(['/']);
      }
    });
  }

  onSlotClicked(event: ResourceTimelineSlotClick): void {
    console.log('slot clicked', event);
    const pending = this.pendingSelection();

    if (!pending) {
      this.pendingSelection.set({
        rowId: event.rowId,
        start: event.start,
      });
      return;
    }

    if (pending.rowId !== event.rowId) {
      this.pendingSelection.set({
        rowId: event.rowId,
        start: event.start,
      });

      return;
    }

    const start =
      pending.start.getTime() <= event.start.getTime()
        ? pending.start
        : event.start;

    const end =
      pending.start.getTime() <= event.start.getTime()
        ? event.end
        : pending.start;

    if (start.getTime() === end.getTime()) {
      this.pendingSelection.set(null);
      return;
    }

    this.addAvailability(event.rowId, start, end);

    this.pendingSelection.set(null);
  }

  onItemMoved(event: ResourceTimelineItemMove): void {
    this.availabilities.update(blocks =>
      blocks.map(block =>
        block.id === event.item.id
          ? {
            ...block,
            start: event.start,
            end: event.end,
          }
          : block
      )
    );

    return;
  }

  private addAvailability(rowId: string, start: Date, end: Date): void {
    this.availabilities.update(blocks => [
      ...blocks,
      {
        id: crypto.randomUUID(),
        rowId,
        start,
        end,
      },
    ]);
  }
}
