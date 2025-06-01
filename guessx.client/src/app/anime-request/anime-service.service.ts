import { Injectable } from '@angular/core';
import { AnimeSearchResponse } from './anime.model';
import { forkJoin, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimeServiceService {
  // URLs for the Jikan API
  // The Jikan API is a RESTful API for the MyAnimeList website
  // It provides access to anime, manga.

  /*
    filtro de Tipo de contenido (Anima/Manga/All)
    Modal que cargue las imagenes, se puedan seleccionar y devuelva un arreglo de imagenes(urls)
        - Aparecera una lista de posibles respuestas para adivinar ademas de las default (incluir las que estan por idioma)
        - Todas las Opciones de respuestas seran editables
        - Saldran las que estan seleccionadas en un apestaña de opciones y las que no estan seleccionadas en otra pestaña
  */

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

 getAnimePictures(id: number): Observable<{ url: string }[]> {
  const requests = this.animePicturesUrl.map(item => {
    const url = `https://api.jikan.moe/v4/anime/${id}/${item.urlTerm}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // Extraemos las urls usando la propiedad en item.imageProp (acceso dinámico)
        // La propiedad puede ser anidada, entonces hacemos split y recorremos
        const dataArray = response.data || [];
        return dataArray.map((entry: any) => {
          const props = item.imageProp.split('.');
          let url = entry;
          for (const prop of props) {
            url = url?.[prop];
            if (!url) break;
          }
          return { url };
        }).filter((img: any) => img.url);
      })
    );
  });

  // forkJoin espera que todas las peticiones terminen y las combina
  return forkJoin(requests).pipe(
    map(resultsArrays => resultsArrays.flat()) // Aplanamos el array de arrays
  );
}


}
