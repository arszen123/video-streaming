import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/app/interfaces/video.interface';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  videos$: Observable<IVideo[]>

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videos$ = this.videoService.list();
  }

}
