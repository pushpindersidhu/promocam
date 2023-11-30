import { Component, NgZone } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styles: [],
})
export class PlacesComponent {
  nearbyPlaces: google.maps.places.PlaceResult[] = [];
  placeType: string = '';

  constructor(private locationService: LocationService, private zone: NgZone) {}

  ngOnInit() {
    this.locationService.placesList$.subscribe((places) => {
      this.zone.run(() => {
        this.nearbyPlaces = places;
        console.log(this.nearbyPlaces);
      });
    });

    this.locationService.placeType$.subscribe((type) => {
      this.zone.run(() => {
        this.placeType = type.replace('_', ' ');
      });
    });
  }

  ngAfterViewInit() {
    if (this.nearbyPlaces.length === 0) {
      this.locationService.getNearbyPlaces();
    }
  }
}
