import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';

import { ListComponent } from './list.component';


describe('ListComponent', () => {
  const videos = [
    {id: 1, title: 'Test video 1'},
    {id: 2, title: 'Test video 2'},
  ]
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let serviceSpy: jasmine.SpyObj<VideoService>;
  
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('VideoService', ['list']);
    await TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      imports: [RouterTestingModule],
      providers: [
        {provide: VideoService, useValue: spy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    serviceSpy = TestBed.inject(VideoService) as jasmine.SpyObj<VideoService>;
    serviceSpy.list.and.returnValue(new BehaviorSubject(videos));
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });

  it('videos$ should be defined and contain a list of videos', () => {
    expect(component.videos$).toBeDefined();
    component.videos$.subscribe(vs => {
      expect(vs).toEqual(videos)
    })
  });

  it('should display the videos', () => {
    const list = 
    (fixture.nativeElement as HTMLElement).querySelectorAll('.list-group a');
    expect(list).toBeDefined();
    expect(list.length).toEqual(2);
    videos.forEach((video, index) => {
      const link: HTMLAnchorElement = list[index] as HTMLAnchorElement;
      expect(link.textContent).toEqual(video.title);
    })
  })
});
