import { Injectable } from '@angular/core';
import { AnimeSearchResponse } from './anime.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimeServiceService {

  constructor(private http: HttpClient) { }
  getAnimeList(query: {
    q?: string,
    page?: number,
    limit?: number,
    type?: string,
    status?: string
  }): Observable<AnimeSearchResponse> {
    const params = new HttpParams({ fromObject: query as any });
    return this.http.get<AnimeSearchResponse>('https://api.jikan.moe/v4/anime', { params });
  }
}
