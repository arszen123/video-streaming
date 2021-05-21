import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment.sample';

import { CommentList, CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let controller: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CommentService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list method should return the list of comments', () => {
    const listId = '1';
    const comments: CommentList = [
      {description: 'First comment', uid: '1'},
      {description: 'Second comment', uid: '2'},
    ];
    const uriPath = `/api/comment-lists/${listId}`;

    service.list(listId).subscribe(res => {
      expect(res).toEqual(comments);
    });

    const op = controller.expectOne(environment.apiUrl + uriPath);
    expect(op.request.method).toBe('GET');
    op.flush(comments);
  });

  it('create method should ', () => {
    const listId = '1';
    const uriPath = `/api/comment-lists/${listId}/comments`;
    const apiResponse = {success: true};
    const createCommentDto = {description: 'First comment'}

    service.create(listId, createCommentDto).subscribe(res => {
      controller.expectOne(environment.apiUrl + `/api/comment-lists/${listId}`);
      expect(res).toEqual(apiResponse);
    });

    const op = controller.expectOne(environment.apiUrl + uriPath);
    expect(op.request.method).toBe('POST');
    expect(op.request.body).toEqual(createCommentDto);
    op.flush(apiResponse);
  })
});
