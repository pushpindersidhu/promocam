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
      url: 'https://promocam230ef6efbf964db494dd1b2c7abdce7a141802-dev.s3.us-west-1.amazonaws.com/10000000_962908494772126_8499920610684276092_n.mp4',
    },
    {
      url: 'https://promocam230ef6efbf964db494dd1b2c7abdce7a141802-dev.s3.us-west-1.amazonaws.com/120694194_200402133075910_8843272636753577936_n.mp4',
    },
    {
      url: 'https://promocam230ef6efbf964db494dd1b2c7abdce7a141802-dev.s3.us-west-1.amazonaws.com/165411836_333246639436166_5440819113394281133_n.mp4',
    },
    {
      url: 'https://promocam230ef6efbf964db494dd1b2c7abdce7a141802-dev.s3.us-west-1.amazonaws.com/333224036_318957977547545_4540424466466847770_n.mp4',
    },
    {
      url: 'https://promocam230ef6efbf964db494dd1b2c7abdce7a141802-dev.s3.us-west-1.amazonaws.com/53719457_651037963860751_1952520752597996374_n.mp4',
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
          (entry.target as HTMLVideoElement).muted = this.muted;
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
