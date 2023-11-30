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

  radiusList = [
    {
      value: 5000,
      label: '5 km',
    },
    {
      value: 10000,
      label: '10 km',
    },
    {
      value: 25000,
      label: '25 km',
    },
    {
      value: 50000,
      label: '50 km',
    },
  ];

  placeType = 'restaurant'
  radius = 5000;

  constructor(private locationService: LocationService, private zone: NgZone) {}

  setType(type: string) {
    this.locationService.setPlaceType(type);
  }

  setRadius(radius: number) {
    console.log('Radius changed:', radius);
    this.radius = radius;
    this.locationService.setRadius(radius);
  }

  setPlaceType(type: string) {
    console.log('Place type changed:', type);
    this.placeType = type;
    this.locationService.setPlaceType(type);
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
