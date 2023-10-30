import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [],
})
export class CardComponent {
  @Input() place: any | undefined;

  getPhotoUrl(place: any | undefined): string | undefined {
    return place?.photos && place?.photos.length > 0
      ? place?.photos[0].getUrl({ maxWidth: 500 })
      : undefined;
  }
}
