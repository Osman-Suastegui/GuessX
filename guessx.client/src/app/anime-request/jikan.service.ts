import { Injectable } from '@angular/core';
import { AnimeSearchResponse, TitleData } from './anime.model';
import { forkJoin, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class JikanService {
  // URLs for the Jikan API
  // The Jikan API is a RESTful API for the MyAnimeList website
  // It provides access to anime, manga.

  mangaUrl = 'https://api.jikan.moe/v4/manga';
  mangaPicturesUrl = [
    {
      urlTerm:'pictures',
      imageProp: 'webp.large_image_url', // for each manga
    }
  ];

  animeUrl = 'https://api.jikan.moe/v4/anime';
  animePicturesUrl = [
    {
      urlTerm:'pictures',
      imageProp: 'webp.large_image_url', // for each anime
    },
    {
      urlTerm: 'videos/episodes',
      imageProp: 'images.jpg.image_url'
    }

  ];

  constructor(private http: HttpClient) { }
  getAnimeList(query: {
    q?: string,
    page?: number,
    limit?: number,
    type?: string,
    status?: string
  }): Observable<AnimeSearchResponse> {
    const params = new HttpParams({ fromObject: query as any });
    return this.http.get<AnimeSearchResponse>(this.animeUrl, { params });
  }

  getAnimePictures(id: number): Observable<{ url: string, imageType: string, id: number }[]> {
    const requests = this.animePicturesUrl.map(item => {
      const url = `https://api.jikan.moe/v4/anime/${id}/${item.urlTerm}`;
      return this.http.get<any>(url).pipe(
        map(response => {
          const dataArray = response.data || [];
          return dataArray.map((entry: any) => {
            const props = item.imageProp.split('.');
            let url = entry;
            for (const prop of props) {
              url = url?.[prop];
              if (!url) break;
            }
            return url ? { imageUrl:url, imageType: 'anime' } : null;
          }).filter((img: any) => img);
        })
      );
    });

    return forkJoin(requests).pipe(
      map(resultsArrays => resultsArrays.flat())
    );
  }

}
