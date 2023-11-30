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
  selectedSort: string = 'recommended';

  sortOptions = [
    {
      value: 'rating_asc',
      label: 'Highest Rated',
      sort: () => this.sortPlacesByRating(false),
    },
    {
      value: 'rating_desc',
      label: 'Lowest Rated',
      sort: () => this.sortPlacesByRating(true),
    },
    {
      value: 'price_asc',
      label: 'Highest Price',
      sort: () => this.sortPlacesByPrice(false),
    },
    {
      value: 'price_desc',
      label: 'Lowest Price',
      sort: () => this.sortPlacesByPrice(true),
    },
    {
      value: 'most_reviewed',
      label: 'Most Reviewed',
      sort: () => this.sortPlacesByReviewCount(false),
    }
  ];

  constructor(private locationService: LocationService, private zone: NgZone) {}

  ngOnInit() {
    this.locationService.placesList$.subscribe((places) => {
      this.zone.run(() => {
        this.nearbyPlaces = places;
      });
      this.sort();
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

  setSelectedSort(event: any) {
    this.selectedSort = event.target.value;
    this.sort();
  }

  sort() {
    const sortOption = this.sortOptions.find(
      (option) => option.value === this.selectedSort
    );

    if (sortOption) {
      sortOption.sort();
    }
  }

  sortPlacesByRating(ascending: boolean) {
    this.nearbyPlaces.sort((a, b) => {
      if (ascending) {
        if (a.rating === undefined) {
          return 1;
        }
        if (b.rating === undefined) {
          return -1;
        }
        return a.rating - b.rating;
      } else {
        if (a.rating === undefined) {
          return 1;
        }
        if (b.rating === undefined) {
          return -1;
        }
        return b.rating - a.rating;
      }
    });
  }

  sortPlacesByPrice(ascending: boolean) {
    this.nearbyPlaces.sort((a, b) => {
      if (ascending) {
        if (a.price_level === undefined) {
          return 1;
        }
        if (b.price_level === undefined) {
          return -1;
        }
        return a.price_level - b.price_level;
      } else {
        if (a.price_level === undefined) {
          return 1;
        }
        if (b.price_level === undefined) {
          return -1;
        }
        return b.price_level - a.price_level;
      }
    });
  }

  sortPlacesByReviewCount(ascending: boolean) {
    this.nearbyPlaces.sort((a, b) => {
      if (ascending) {
        if (a.user_ratings_total === undefined) {
          return 1;
        }
        if (b.user_ratings_total === undefined) {
          return -1;
        }
        return a.user_ratings_total - b.user_ratings_total;
      } else {
        if (a.user_ratings_total === undefined) {
          return 1;
        }
        if (b.user_ratings_total === undefined) {
          return -1;
        }
        return b.user_ratings_total - a.user_ratings_total;
      }
    });
  }
}
