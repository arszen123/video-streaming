import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.sample';

interface CommentDto {
  description: string;
};

export interface Comment {
  uid: string;
  description: string;
}

export type CommentList = Comment[];

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly _listCache = new Map<string, ReplaySubject<CommentList>>();

  constructor(private http: HttpClient) { }

  create(listId: string, commentDto: CommentDto) {
    const path = '/api/comment-lists/' + listId + '/comments';
    return this.http.post(environment.apiUrl + path, commentDto)
      .pipe(tap(() => this.refreshList(listId)));
  }

  list(listId: string): Observable<CommentList> {
    if (!this._listCache.has(listId)) {
      this._listCache.set(listId, new ReplaySubject(1));
      this.refreshList(listId);
    }
    return this._listCache.get(listId).pipe(catchError(err => {
      this._listCache.delete(listId);
      throw err;
    })) as Observable<CommentList>;
  }

  private refreshList(listId: string) {
    const subj = this._listCache.get(listId);
    const path = '/api/comment-lists/' + listId;
    this.http.get<CommentList>(environment.apiUrl + path)
      .subscribe(data => {
        subj.next(data);
      }, err => {
        subj.error(err);
        subj.complete();
      })
  }
}
