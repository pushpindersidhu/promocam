import { Component, NgZone } from '@angular/core';
import { LocationService } from 'src/app/location.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  typesList = [
    {
      value: 'restaurant',
      label: 'Restaurants',
    },
    {
      value: 'cafe',
      label: 'Cafes',
    },
    {
      value: 'night_club',
      label: 'Night Clubs',
    },
    {
      value: 'bar',
      label: 'Bars',
    },
    {
      value: 'casino',
      label: 'Casinos',
    },
  ];

  placeType = 'restaurant';
  radius = 5000;
  price: number = 0;

  constructor(private locationService: LocationService, private zone: NgZone) {
    this.locationService.placeType$.subscribe((type) => {
      this.zone.run(() => {
        this.placeType = type;
      });
    });

    this.locationService.radius$.subscribe((radius) => {
      this.zone.run(() => {
        this.radius = radius;
      });
    });

    this.locationService.price$.subscribe((price) => {
      this.zone.run(() => {
        this.price = price.min;
      });
    });
  }

  setType(type: string) {
    this.locationService.setPlaceType(type);
  }

  setRadius(event: any) {
    this.radius = event.target.value;
    this.locationService.setRadius(event.target.value);
  }

  setPlaceType(type: string) {
    this.placeType = type;
    this.locationService.setPlaceType(type);
  }

  setPrice(price: number) {
    if (this.price === price) {
      this.price = 0;
      this.locationService.setPrice({
        min: 0,
        max: 4,
      });
      return;
    }

    this.price = price;
    this.locationService.setPrice({
      min: this.price || 0,
      max: this.price || 4,
    });
  }

  resetFilters() {
    this.locationService.setRadius(5000);
    this.locationService.setPrice({
      min: 0,
      max: 4,
    });
  }
}
