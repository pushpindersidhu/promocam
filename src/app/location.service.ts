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
  private placeTypeSubject = new BehaviorSubject<string>('night_club');
  private radiusSubject = new BehaviorSubject<number>(5000);

  private userAtPlaceSubject =
    new BehaviorSubject<google.maps.places.PlaceResult | null>(null);

  userLocation$ = this.userLocationSubject.asObservable();
  placesList$ = this.placesListSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  userAtPlace$ = this.userAtPlaceSubject.asObservable();
  placeType$ = this.placeTypeSubject.asObservable();
  radius$ = this.radiusSubject.asObservable();

  constructor() {
    if (!this.userLocationSubject.value) {
      this.isLoadingSubject.next(true);
      const cachedLocation = localStorage.getItem('userLocation');
      if (cachedLocation) {
        const coordinates: GeolocationCoordinates = JSON.parse(cachedLocation);
        this.userLocationSubject.next(coordinates);
        this.isLoadingSubject.next(false);
      }
      this.getCurrentLocation();
      this.getNearbyPlaces();
      this.watchLocationChanges();
    }

    this.userLocationSubject.subscribe((userLocation) => {
      if (userLocation) {
        this.getNearbyPlaces();
      }
    });

    this.placeTypeSubject.subscribe(() => {
      console.log('Place type changed:', this.placeTypeSubject.value);
      this.getNearbyPlaces();
    });

    this.radiusSubject.subscribe(() => {
      console.log('Radius changed:', this.radiusSubject.value);
      this.getNearbyPlaces();
    });
  }

  private getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coordinates: GeolocationCoordinates = position.coords;
          this.userLocationSubject.next(coordinates);
          this.isLoadingSubject.next(false);
          localStorage.setItem(
            'userLocation',
            JSON.stringify({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            })
          );
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

  setUserLocation(userLocation: GeolocationCoordinates) {
    this.userLocationSubject.next(userLocation);
    this.saveUserLocation();
  }

  saveUserLocation() {
    localStorage.setItem(
      'userLocation',
      JSON.stringify({
        latitude: this.userLocationSubject.value!.latitude,
        longitude: this.userLocationSubject.value!.longitude,
      })
    );
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
          localStorage.setItem(
            'userLocation',
            JSON.stringify({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            })
          );
          console.log('User location changed:', coordinates);
          this.checkIfUserAtAnyPlace();
        },
        (error: GeolocationPositionError) => {
          console.log('Error watching user location:', error);
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
        type: this.placeTypeSubject.value,
        radius: this.radiusSubject.value,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          this.updatePlacesList(results);
          this.checkIfUserAtAnyPlace();
        } else {
          console.log("Couldn't get nearby places.");
        }
      }
    );
  }

  private updateUserAtPlace(
    userAtPlace: google.maps.places.PlaceResult | null
  ) {
    this.userAtPlaceSubject.next(userAtPlace);
  }

  checkIfUserAtAnyPlace() {
    const userLocation = this.userLocationSubject.value;
    const placesList = this.placesListSubject.value;

    if (!userLocation || !placesList || placesList.length === 0) {
      console.log(userLocation, placesList);
      return;
    }

    const userLatLng = new google.maps.LatLng(
      userLocation.latitude,
      userLocation.longitude
    );

    const radiusThreshold = 200;

    const userAtPlace = placesList.find((place) => {
      const placeLatLng = place.geometry?.location;
      if (placeLatLng) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          userLatLng,
          placeLatLng
        );

        return distance <= radiusThreshold;
      }
      return false;
    });

    console.log('User at place:', userAtPlace?.name);

    this.updateUserAtPlace(userAtPlace || null);
  }

  public setPlaceType(placeType: string) {
    this.placeTypeSubject.next(placeType);
  }

  public setRadius(radius: number) {
    this.radiusSubject.next(radius);
  }
}
