import { Injectable } from '@angular/core';
import { TitleData } from './anime.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  api = 'https://localhost:7230/api/Anime';

  constructor(private http: HttpClient) {}

  // Register a new anime request
  registerAnimeRequest(animeRequest: TitleData): Observable<any> {
    return this.http.post(this.api, animeRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update an existing anime request
  updateAnimeRequest(id: number, animeRequest: TitleData): Observable<any> {
    return this.http.patch(`${this.api}/${id}`, animeRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get the list of anime requests
  getAnimeRequests(): Observable<TitleData[]> {
    return this.http.get<TitleData[]>(this.api);
  }
}
