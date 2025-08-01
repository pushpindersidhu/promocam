import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { listReviews } from 'src/graphql/queries';
import { ListReviewsQuery, Review } from 'src/API';

interface Card {
  url: string;
  type: 'image' | 'video';
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
})
export class VideosComponent implements OnInit {
  @ViewChildren('videoPlayer') videoPlayers: QueryList<
    ElementRef<HTMLVideoElement>
  > = new QueryList();

  @Input() pid = 'ChIJYSt-YlwsflMR_kCtUZKkJgM';
  @Input() photos: string[] = [];
  @Input() reviews: (Review & { videoUrl: string })[] = [];

  cards: Card[] = [];

  ngOnChanges() {
    this.cards = [];
    this.cards = this.cards.concat(
      this.reviews.map((review) => ({ url: review.videoUrl, type: 'video' }))
    );

    this.cards = this.cards.concat(
      this.photos.map((photo) => ({ url: photo, type: 'image' }))
    );
  }

  muted = true;

  toggleMuted() {
    this.muted = !this.muted;

    this.videoPlayers.forEach((videoPlayer) => {
      videoPlayer.nativeElement.muted = this.muted;
    });
  }

  constructor(private ngZone: NgZone) {}

  ngOnInit() {}

  onVideoLoad(videoPlayer: HTMLVideoElement) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoPlayer.muted = this.muted;
          videoPlayer.play();
        } else {
          videoPlayer.pause();
        }
      });
    }, options);

    observer.observe(videoPlayer);
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
}
