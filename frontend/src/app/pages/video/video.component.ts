import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/app/interfaces/video.interface';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/modules/alert';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit {

  private videoId;
  video$: Observable<IVideo>;

  constructor(
    private videoService: VideoService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(({id}) => {
      this.videoId = id;
      this.video$ = this.videoService.findById(id);
      this.video$.subscribe(() => {}, err => {
        if (err.error.code === 404) {
          this.alertService.open('Video not exists!', {type: 'warning'});
          this.router.navigateByUrl('/');
        }
      })
    });
  }

  get videoUrl() {
    return environment.apiUrl + '/api/videos/' + this.videoId + '/stream';
  }

}
