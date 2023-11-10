import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
})
export class VideosComponent implements OnInit {
  @ViewChildren('videoPlayer') videoPlayers: QueryList<
    ElementRef<HTMLVideoElement>
  > = new QueryList();

  muted = true;

  toggleMuted() {
    this.muted = !this.muted;

    this.videoPlayers.forEach((videoPlayer) => {
      videoPlayer.nativeElement.muted = this.muted;
    });
  }

  videos = [
    {
      url: './assets/1.mov',
    },
    {
      url: './assets/2.mov',
    },
    {
      url: './assets/3.mov',
    },
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLVideoElement).play();
        } else {
          (entry.target as HTMLVideoElement).pause();
        }
      });
    }, options);

    this.videoPlayers.forEach((videoPlayer) => {
      observer.observe(videoPlayer.nativeElement);
    });
  }

  onVideoLoad(videoPlayer: HTMLVideoElement) {
    console.log('Video metadata loaded:', videoPlayer);
  }
}
