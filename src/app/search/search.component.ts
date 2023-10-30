import { Component, NgZone } from '@angular/core';

import { ElementRef, ViewChild } from '@angular/core';

export interface PlaceSearchResult {
  address: string;
  location?: google.maps.LatLng;
  imageUrl?: string;
  iconUrl?: string;
  name?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  @ViewChild('inputField')
  inputField!: ElementRef;
  location: GeolocationCoordinates | null = null;
  autocomplete: google.maps.places.Autocomplete | undefined;
  searchResult: PlaceSearchResult | undefined;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputField.nativeElement
    );

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete?.getPlace();
        const result: PlaceSearchResult = {
          address: this.inputField.nativeElement.value,
          name: place?.name,
          location: place?.geometry?.location,
          imageUrl: this.getPhotoUrl(place),
          iconUrl: place?.icon,
        };

        this.searchResult = result;
        this.location = {
          latitude: result.location!.lat(),
          longitude: result.location!.lng(),
        } as GeolocationCoordinates;
      });
    });
  }

  getPhotoUrl(
    place: google.maps.places.PlaceResult | undefined
  ): string | undefined {
    return place?.photos && place?.photos.length > 0
      ? place?.photos[0].getUrl({ maxWidth: 500 })
      : undefined;
  }

  ngOnDestroy() {
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }
}
