import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { CommentService } from '../../services/comment.service';

import { CommentCreateComponent } from './comment-create.component';

describe('CommentCreateComponent', () => {
  let component: CommentCreateComponent;
  let fixture: ComponentFixture<CommentCreateComponent>;
  let commentService: jasmine.SpyObj<CommentService>;

  beforeEach(async () => {
    const commentServiceSpy = jasmine.createSpyObj(CommentService.name, ['create']);
    await TestBed.configureTestingModule({
      declarations: [ CommentCreateComponent ],
      providers: [{provide: CommentService, useValue: commentServiceSpy}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    commentService = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentService.create.and.callFake((listId, commentDto) => {
      return of({success: true});
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saveComment should call commentService.create and reset commentControl', () => {
    const commentText = 'First comment!';
    const eventEmmiterSpy = jasmine.createSpyObj<EventEmitter<void>>(EventEmitter.name, ['emit']);
    component.save = eventEmmiterSpy;
    component.videoId = '1';
    
    expect(component.hasNoCommentText()).toEqual(true);
    component.commentControl.patchValue(commentText);
    fixture.detectChanges();
    expect(component.hasNoCommentText()).toEqual(false);

    component.saveComment();
    expect(commentService.create).toHaveBeenCalledWith(component.videoId, {description: commentText});
    expect(component.commentControl.value).toEqual('');
    expect(eventEmmiterSpy.emit).toHaveBeenCalled();
  })
});
