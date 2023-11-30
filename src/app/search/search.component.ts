import { Component, NgZone } from '@angular/core';

import { ElementRef, ViewChild } from '@angular/core';
import { LocationService } from '../location.service';

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

  constructor(
    private ngZone: NgZone,
    private locationService: LocationService
  ) {}

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

        if (result.location) {
          const location: GeolocationCoordinates = {
            latitude: result.location.lat(),
            longitude: result.location.lng(),
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          };

          this.locationService.setUserLocation(location);
        }

        this.searchResult = result;
        this.location = {
          latitude: result.location!.lat(),
          longitude: result.location!.lng(),
        } as GeolocationCoordinates;
      });
    });

    this.locationService.userLocation$.subscribe((location) => {
      if (location) {
        const latLng = new google.maps.LatLng(
          location.latitude,
          location.longitude
        );

        new google.maps.Geocoder().geocode(
          { location: latLng },
          (results, status) => {
            if (status === 'OK') {
              this.ngZone.run(() => {
                if (results)
                  this.inputField.nativeElement.value =
                    results[0].formatted_address;
              });
            }
          }
        );
      }
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
