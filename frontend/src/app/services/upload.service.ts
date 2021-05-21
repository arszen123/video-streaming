import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileUploader, IFileUploader } from '../classes/file-uploader';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {}

  createUploader(file: File): IFileUploader {
    // @ts-ignore
    const fileUploader = new FileUploader(
      file,
      environment.apiUrl + '/api/upload-chunk',
      this.http
    );
    return fileUploader;
  }
}
