import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private userLocationSubject =
    new BehaviorSubject<GeolocationCoordinates | null>(null);
  private placesListSubject = new BehaviorSubject<
    google.maps.places.PlaceResult[]
  >([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  userLocation$ = this.userLocationSubject.asObservable();
  placesList$ = this.placesListSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    if (!this.userLocationSubject.value) {
      const cachedLocation = localStorage.getItem('userLocation');
      if (cachedLocation) {
        const coordinates: GeolocationCoordinates = JSON.parse(cachedLocation);
        this.userLocationSubject.next(coordinates);
      } else {
        this.isLoadingSubject.next(true);
        this.getCurrentLocation();
      }
      this.watchLocationChanges();
    }
  }

  private getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coordinates: GeolocationCoordinates = position.coords;
          this.userLocationSubject.next(coordinates);
          this.isLoadingSubject.next(false);
        },
        (error: GeolocationPositionError) => {
          console.error('Error getting user location:', error.message);
          this.isLoadingSubject.next(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.isLoadingSubject.next(false);
    }
  }

  get userLocation(): GeolocationCoordinates | null {
    return this.userLocationSubject.value;
  }

  onLocationChange() {
    this.getCurrentLocation();
  }

  private updatePlacesList(places: any[]) {
    this.placesListSubject.next(places);
  }

  private watchLocationChanges() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => {
          const coordinates: GeolocationCoordinates = position.coords;
          this.userLocationSubject.next(coordinates);
          console.log('User location changed:', coordinates);
        },
        (error: GeolocationPositionError) => {
          console.error('Error watching user location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getNearbyPlaces() {
    const userLocation = this.userLocationSubject.value;

    if (!userLocation) {
      console.error('User location is not available.');
      return;
    }

    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const location = new google.maps.LatLng(
      this.userLocationSubject.value!.latitude,
      this.userLocationSubject.value!.longitude
    );
    service.nearbySearch(
      {
        location: location,
        type: 'night_club',
        rankBy: google.maps.places.RankBy.DISTANCE,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          this.updatePlacesList(results);
        } else {
          console.error('Error fetching nearby places:', status);
        }
      }
    );
  }
}
