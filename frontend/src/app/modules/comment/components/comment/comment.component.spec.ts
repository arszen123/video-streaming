import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentComponent } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.comment = {
      description: 'First comment',
      uid: '123123123123123123'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display comment text', () => {
    const descElement: HTMLElement = fixture.nativeElement.querySelector('.description');
    expect(descElement.textContent.trim()).toEqual(component.comment.description);
  })

  it('should display uid with max 10 character', () => {
    const descElement: HTMLElement = fixture.nativeElement.querySelector('.user');
    expect(descElement.textContent.trim()).toEqual(component.comment.uid.slice(0, 10));
  })
});
