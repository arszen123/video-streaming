import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertService } from 'src/app/modules/alert';
import { CommentService } from '../../services/comment.service';

import { CommentsComponent } from './comments.component';

describe('CommentsComponent', () => {
  const videoId = '1';
  const comments = [
    {description: 'First comment', uid: '1'},
    {description: 'Second comment', uid: '2'},
  ];
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let commentService: jasmine.SpyObj<CommentService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const commentSpy = jasmine.createSpyObj(CommentService.name, ['list']);
    const alertSpy = jasmine.createSpyObj(CommentService.name, ['open']);
    await TestBed.configureTestingModule({
      declarations: [ CommentsComponent ],
      providers: [
        { provide: CommentService, useValue: commentSpy },
        { provide: AlertService, useValue: alertSpy },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    commentService = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    commentService.list.and.callFake((listId) => {
      expect(listId).toEqual(videoId);
      return of(comments);
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    component.videoId = videoId;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have property comments$', () => {
    component.comments$.subscribe(res => {
      expect(res).toEqual(comments);
    });
    expect(commentService.list).toHaveBeenCalledWith(videoId);
  })

  it('should display the comments', () => {
    const commentElements = fixture.nativeElement.querySelectorAll('app-comment');
    expect(commentElements.length).toEqual(comments.length)
  });

  it('should display a message if there are no comments', () => {
    component.comments$ = of([]);
    fixture.detectChanges();
    const commentsContainer: HTMLElement = fixture.nativeElement.querySelector('#comments');

    expect(commentsContainer.textContent.trim()).toEqual('Be the first who write\'s a comment');
  })
});
