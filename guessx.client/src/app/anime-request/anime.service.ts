import { Injectable } from '@angular/core';
import { TitleData } from './anime.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  api = 'http://localhost:5290/api/Anime';

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
  getAnimeRequests(filters: { [key: string]: any }, isArchived: boolean = false): Observable<TitleData[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      params = params.set(key, filters[key]);
    });
    params = params.set('isArchived', isArchived);
    return this.http.get<TitleData[]>(this.api, { params });
  }
}
