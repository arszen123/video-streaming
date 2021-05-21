import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { VideoComponent } from './video.component';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';

describe('VideoComponent', () => {
  const video = {id: 1, title: 'Test video'};
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;
  let serviceSpy: jasmine.SpyObj<VideoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('VideoService', ['findById']);
    const authSpy = jasmine.createSpyObj('AngularFireAuth', ['signOut'], {
      // @ts-ignore
      user: new BehaviorSubject({uid: 'test'}),
    });
    await TestBed.configureTestingModule({
      declarations: [ VideoComponent ],
      imports: [
          RouterTestingModule.withRoutes([
          {path: 'video/:id', component: VideoComponent},
        ])
      ],
      providers: [
        {provide: VideoService, useValue: spy},
        {provide: ActivatedRoute, useValue: {
          params: of({
            id: video.id
          })
        }},
        {provide: AngularFireAuth, useValue: authSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    serviceSpy = TestBed.inject(VideoService) as jasmine.SpyObj<VideoService>;
    serviceSpy.findById.and.callFake((id) => {
      expect(id).toEqual(video.id);
      return new BehaviorSubject(video);
    });
    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('video$ should be defined', () => {
    expect(component.video$).toBeDefined();
    component.video$.subscribe(v => {
      expect(v).toEqual(video);
    });
  });

  it('getUrl should be defined', () => {
    expect(component.videoUrl).toBeDefined();
    expect(component.videoUrl).toEqual(
      environment.apiUrl + '/api/videos/' + video.id + '/stream'
    );
  });

  it('should have a video element with videoUrl source', () => {
    expect(component.videoUrl).toBeDefined();
    const video: HTMLVideoElement = fixture.nativeElement.getElementsByTagName('video')[0];
    expect(video).toBeDefined();
    const source = video.getElementsByTagName('source')[0];
    expect(source).toBeDefined();
    expect(source.src).toEqual(component.videoUrl);
  });
});
