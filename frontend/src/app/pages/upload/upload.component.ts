import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnUnsavedChanges } from 'src/app/interfaces/on-unsaved-changes.interface';
import { AlertService } from 'src/app/modules/alert';
import { UploadService } from 'src/app/services/upload.service';
import { VideoService } from 'src/app/services/video.service';

type UploadStatus = 'pending' | 'completed' | 'error' | 'inactive';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass']
})
export class UploadComponent implements OnInit, OnUnsavedChanges {

  form = new FormGroup({
    videoId: new FormControl(null, [Validators.required]),
    title: new FormControl(null, [Validators.required]),
  });

  uploadStatus$: Observable<UploadStatus> = new ReplaySubject(1);

  private _uploadedPercentage = 0;
  private isSaved = false;

  get uploadProgress() {
    return this._uploadedPercentage;
  }

  constructor(
    private uploadService: UploadService,
    private videoService: VideoService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.updateUploadFileStatus('inactive');
  }

  uploadFile(event) {
    this.updateUploadFileStatus('inactive');
    this._uploadedPercentage = 0;
    const file = event.target.files[0];
    if (file) {
      const fileUploader = this.uploadService.createUploader(file);
      const self = this;
      fileUploader.addEventListener('chunkuploaded', function () {
        self._uploadedPercentage = Math.ceil(this.getUploadedSize() * 100 / this.getFileSize());
      })
      fileUploader.addEventListener('uploaded', function () {
        self.form.get('videoId').setValue(this.getVideoId());
        self.updateUploadFileStatus('completed');
      });
      fileUploader.addEventListener('error', function () {
        self.updateUploadFileStatus('error');
      })
      this.updateUploadFileStatus('pending');
      fileUploader.upload();
    }
  }

  updateUploadFileStatus(status: UploadStatus) {
    (this.uploadStatus$ as Subject<UploadStatus>).next(status);
  }

  save(form: HTMLFormElement) {
    if (form.checkValidity() && this.form.valid) {
      this.videoService.create(this.form.value).subscribe(({id}) => {
        this.isSaved = true;
        this.alertService.open('Video saved!');
        this.router.navigateByUrl(`/video/${id}`);
      });
      return;
    }
    form.classList.add('was-validated');
  }

  onUnsavedChanges() {
    return this.uploadStatus$.pipe(map(status => {
      if (!this.isSaved && status !== 'inactive') {
        return "Are you sure you want to leave without saving the modifications?";
      }
      return true;
    }))
  }

}
