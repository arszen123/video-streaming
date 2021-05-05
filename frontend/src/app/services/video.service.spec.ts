import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { VideoService } from './video.service';
import { environment } from 'src/environments/environment';

describe('VideoService', () => {
  let service: VideoService;
  let controller: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(VideoService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterAll(function () {
    controller.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list should return a list of videos', function () {
    const httpResponse = [
      {id: 1, title: 'Test video'},
      {id: 2, title: 'Test video2'},
    ]
    service.list().subscribe(videos => {
      expect(videos).toBe(httpResponse);
    });

    const req = controller.expectOne(environment.apiUrl + '/api/videos');
    expect(req.request.method).toEqual('GET');
    req.flush(httpResponse);
  })

  it('findById should return a video by id', function () {
    const httpResponse = {id: 1, title: 'Test video2'};
    service.findById(httpResponse.id).subscribe(video => {
      expect(video).toBe(httpResponse);
    });

    const req = controller.expectOne(environment.apiUrl + '/api/videos/' + httpResponse.id);
    expect(req.request.method).toEqual('GET');
    req.flush(httpResponse);
  })

  it('create should create and return a new video', function () {
    const newVideo = {title: 'Test video2', videoId: 123};
    service.create(newVideo).subscribe(video => {
      expect(video.id).toBeDefined();
      expect(video.title).toEqual(newVideo.title);
    });

    const req = controller.expectOne(environment.apiUrl + '/api/videos');
    expect(req.request.method).toEqual('POST');
    req.flush({
      id: 1,
      title: newVideo.title
    });
  })
});
