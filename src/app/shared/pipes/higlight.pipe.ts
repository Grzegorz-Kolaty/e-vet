import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
  name: 'higlight'
})
export class HiglightPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer);

  transform(value: string, query: string): SafeHtml {
    if (!query) return value;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'ig');
    const highlighted = value.replace(regex, '<b>$1</b>');

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

}
