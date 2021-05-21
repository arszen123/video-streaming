import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/modules/alert';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.sass']
})
export class CommentCreateComponent {
  
  @Input() videoId: string;
  @Output() save = new EventEmitter();

  readonly commentControl = new FormControl('', [Validators.required]);
  
  constructor(
    private commentService: CommentService,
    private alertService: AlertService,
  ) { }

  saveComment() {
    const commentDto = {description: this.commentControl.value}
    this.commentService.create(this.videoId, commentDto).subscribe(() => {
      this.commentControl.reset('');
      this.alertService.open('Comment saved!');
      this.save.emit();
    }, () => {
      this.alertService.open('Error! Pleas try again later.', {type: 'danger'});
    })
  }

  hasNoCommentText() {
    return this.commentControl.value.length === 0;
  }

}
