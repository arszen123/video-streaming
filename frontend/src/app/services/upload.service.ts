import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileUploader, IFileUploader } from '../classes/file-uploader';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  createUploader(file: File): IFileUploader {
    // @ts-ignore
    const fileUploader = new FileUploader(file, environment.apiUrl + '/api/upload-chunk');
    return fileUploader;
  }
}
