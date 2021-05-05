import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { IFileUploader } from 'src/app/classes/file-uploader';
import { UploadService } from 'src/app/services/upload.service';
import { VideoService } from 'src/app/services/video.service';

import { UploadComponent } from './upload.component';
type VideoServiceSpy = jasmine.SpyObj<VideoService>
type UploadServiceSpy = jasmine.SpyObj<UploadService>

class FileUploaderDummy implements IFileUploader {
  private uploadedBytes = 0;
  private events = new Map();
  private readonly CHUNK_SIZE = 10 ** 6;
  constructor(private file: File){}
  getFileSize(): number {
    return this.file.size;
  }
  getUploadedSize(): number {
    return this.uploadedBytes;
  }
  getVideoId() {
    return 1;
  }
  addEventListener(event: 'chunkuploaded' | 'uploaded' | 'error', cb: CallableFunction): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(cb);
  }
  async upload(): Promise<void> {
    this.uploadedBytes = this.getFileSize();
    (this.events.get('uploaded') || []).forEach(cb => cb.call(this));
  }

}

@Component({template: ''})
class DummyComponent {}

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let videoService: VideoServiceSpy;
  let uploadService: UploadServiceSpy;
  let location: Location;

  beforeEach(async () => {
    const videoServiceSpy = jasmine.createSpyObj('VideoService', ['create']);
    const uploadServiceSpy = jasmine.createSpyObj('UploadService', ['createUploader']);
    await TestBed.configureTestingModule({
      declarations: [ UploadComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {path: '', component: UploadComponent},
          {path: 'video/:id', component: DummyComponent}
        ])
      ],
      providers: [
        {provide: VideoService, useValue: videoServiceSpy},
        {provide: UploadService, useValue: uploadServiceSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    videoService = TestBed.inject(VideoService) as VideoServiceSpy;
    uploadService = TestBed.inject(UploadService) as UploadServiceSpy;
    location = TestBed.inject(Location);
    videoService.create.and.callFake((dto) => {
      expect(dto.title).toBeDefined();
      expect(dto.videoId).toBeDefined();
      return new BehaviorSubject({id: 1, title: dto.title});
    });
    uploadService.createUploader.and.callFake((file) => {
      return new FileUploaderDummy(file);
    })
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display file uploading progress', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const fileElement: HTMLInputElement = compiled.querySelector('input[type="file"]');
    expect(fileElement).toBeDefined();
    component.uploadStatus$.subscribe(v => {
      fixture.detectChanges();
      const info: HTMLParagraphElement = compiled.querySelector('#proggress-info');
      expect(info).toBeDefined();
      let text = '';
      if (v === 'pending') {
        text = 'Uploading...';
      }
      if (v === 'completed') {
        text = 'Uploaded!';
      }
      if (v === 'error') {
        text = 'Failed to upload video! Pleas try again later.';
      }
      expect(info.textContent.trim()).toEqual(text);
    });
    const file = new File(['custom text'], 'test.txt');
    component.uploadFile({target: {files: [file]}});
  });

  it('should save a new video and then redirect to the video', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const fileElement: HTMLInputElement = compiled.querySelector('input[type="file"]');
    expect(fileElement).toBeDefined();
    // File is not a real required field.
    fileElement.removeAttribute('required');
    component.form.get('title').setValue('Test video title');
    component.form.get('videoId').setValue(1);
    fixture.detectChanges();
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    submitButton.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/video/1');
    })
  })
});
