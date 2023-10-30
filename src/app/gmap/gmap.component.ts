import { Component, Input } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styles: [],
})
export class GmapComponent {
  constructor(private locationService: LocationService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const userLocation = this.locationService.userLocation;

    if (userLocation) {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          zoom: 14,
        }
      );

      const infoWindow = new google.maps.InfoWindow();

      map.addListener(
        'click',
        (mapsMouseEvent: { latLng: { toJSON: () => any } }) => {
          infoWindow.close();
          infoWindow.setContent(
            "<div style='text-align: center;'><h3>Location Details</h3><p>Latitude: " +
              mapsMouseEvent.latLng.toJSON().lat +
              '</p><p>Longitude: ' +
              mapsMouseEvent.latLng.toJSON().lng +
              '</p></div>'
          );
          infoWindow.open(map);
          infoWindow.setPosition(mapsMouseEvent.latLng.toJSON());
        }
      );
    }
  }
}
