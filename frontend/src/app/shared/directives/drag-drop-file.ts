import {Directive, EventEmitter, HostListener, Output, signal} from '@angular/core';

@Directive({
  selector: '[appDragDropFile]',
  exportAs: 'appDragDropFile' // KLUCZOWE: umożliwia referencję w szablonie
})
export class DragDropFile {
  isDragging = signal(false);

  @Output() fileDropped = new EventEmitter<File[]>();

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging.set(true)
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging.set(false)

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      const droppedFiles = [...files]
      this.fileDropped.emit(droppedFiles)
    }
  }

  constructor() { }

}
