import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/app/interfaces/video';
import { environment } from 'src/environments/environment';

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
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(({id}) => {
      this.videoId = id;
      this.video$ = this.videoService.findById(id);
    });
  }

  get videoUrl() {
    return environment.apiUrl + '/api/videos/' + this.videoId + '/stream';
  }

}
