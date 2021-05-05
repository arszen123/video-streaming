import { TestBed } from '@angular/core/testing';
import { FileUploader } from '../classes/file-uploader';

import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('createUploader should return a FileUploader', () => {
    const fileUploader = service.createUploader(new File([''], 'file.txt'));
    expect(fileUploader).toBeDefined();
    expect(fileUploader).toBeInstanceOf(FileUploader);
  })
});
