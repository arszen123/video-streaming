import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentService, CommentList } from '../../services/comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.sass']
})
export class CommentsComponent implements OnInit {

  @Input() videoId: string | null = null;
  @Input() createCommentEnabled: boolean = false;
  comments$: Observable<CommentList>;

  constructor(
    private commentService: CommentService,
  ) {
  }

  ngOnInit(): void {
    this.comments$ = this.commentService.list(this.videoId);
  }

}
