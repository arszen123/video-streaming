import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ID, IVideo } from '../interfaces/video';

interface CreateVideoDto {
  videoId: ID,
  title: string,
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<IVideo[]>(environment.apiUrl + '/api/videos');
  }

  findById(id: ID) {
    return this.http.get<IVideo>(environment.apiUrl + '/api/videos/' + id);
  }

  create(createVideoDto: CreateVideoDto) {
    return this.http.post<IVideo>(environment.apiUrl + '/api/videos', createVideoDto);
  }
}
