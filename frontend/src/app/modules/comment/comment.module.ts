import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentCreateComponent } from './components/comment-create/comment-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from '../alert';


@NgModule({
  declarations: [
    CommentsComponent,
    CommentComponent,
    CommentCreateComponent
  ],
  imports: [
    CommonModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommentsComponent,
  ]
})
export class CommentModule { }
