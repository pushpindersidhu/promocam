import { Component, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { ListReviewsQuery, Review } from 'src/API';
import { listReviews } from 'src/graphql/queries';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
})
export class PlaceDetailsComponent {
  @ViewChild('container') container: any;

  placeDetails: google.maps.places.PlaceResult | null = null;
  photoIdx = 0;
  photoUrl: string | null = null;
  photos: string[] = [];
  pid = '';
  showWriteReview = false;
  reviews: (Review & { videoUrl: string })[] = [];

  constructor(private ngZone: NgZone, private route: ActivatedRoute) {
    this.pid = this.route.snapshot.paramMap.get('id') as string;
  }

  ngOnInit(): void {
    this.ngZone.run(() => {
      this.getReviews();
    });

    var map = new google.maps.Map(document.createElement('div'), {
      center: { lat: -33.866, lng: 151.196 },
      zoom: 15,
    });

    var request = {
      placeId: this.pid,
    };

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      request,
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.ngZone.run(() => {
            this.placeDetails = place;
            if (place && place.photos && place.photos.length > 0) {
              this.photoUrl = place.photos[0].getUrl();

              for (let i = 0; i < place.photos.length; i++) {
                this.photos.push(place.photos[i].getUrl());
              }
            }

            console.log(this.placeDetails);
          });
        }
      }
    );
  }

  getDayName(day: number): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[day];
  }

  formatTime(time: string): string {
    const hours = time.substring(0, 2);
    const minutes = time.substring(2);
    return `${hours}:${minutes}`;
  }

  nextPhoto(): void {
    const photos = this.placeDetails?.photos;
    if (photos) {
      this.photoIdx = (this.photoIdx + 1) % photos.length;
      this.ngZone.run(() => {
        const photos = this.placeDetails?.photos;
        if (photos && photos.length > 0) {
          this.photoUrl = photos[this.photoIdx].getUrl();
        }
      });
    }
  }

  prevPhoto(): void {
    const photos = this.placeDetails?.photos;
    if (photos) {
      this.photoIdx = (this.photoIdx - 1 + photos.length) % photos.length;
      this.ngZone.run(() => {
        const photos = this.placeDetails?.photos;
        if (photos && photos.length > 0) {
          this.photoUrl = photos[this.photoIdx].getUrl();
        }
      });
    }
  }

  setActivePhoto(idx: number): void {
    this.photoIdx = idx;
    this.ngZone.run(() => {
      const photos = this.placeDetails?.photos;
      if (photos && photos.length > 0) {
        this.photoUrl = photos[this.photoIdx].getUrl();
      }
    });
  }

  toggleWriteReview(): void {
    this.showWriteReview = !this.showWriteReview;
  }

  async getReviews() {
    const result = await API.graphql(
      graphqlOperation(listReviews, {
        filter: {
          pid: {
            eq: this.pid,
          },
        },
        limit: 100,
      })
    );

    const reviews = (result as { data: ListReviewsQuery; errors: any[] }).data
      .listReviews?.items as Review[];

    const promises = reviews.map(async (review) => {
      const videoUrl = await Storage.get(review.video, { expires: 60 });
      return { ...review, videoUrl };
    });

    this.reviews = await Promise.all(promises);
  }

  strToDate(str: string): Date {
    return new Date(str);
  }
}
