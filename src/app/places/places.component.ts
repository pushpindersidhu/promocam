import { Component, NgZone } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styles: [],
})
export class PlacesComponent {
  nearbyPlaces: google.maps.places.PlaceResult[] = [];

  constructor(private locationService: LocationService, private zone: NgZone) {}

  ngOnInit() {
    this.locationService.placesList$.subscribe((places) => {
      this.zone.run(() => {
        this.nearbyPlaces = places;
        console.log(this.nearbyPlaces);
      });
    });
  }

  ngAfterViewInit() {
    if (this.nearbyPlaces.length === 0) {
      this.locationService.getNearbyPlaces();
    }
  }
}
