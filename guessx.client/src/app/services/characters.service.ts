import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime, Character, SplashOfTheDay } from '../home-page-multi-games/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  constructor(private httpClient: HttpClient) {}

  public getCharacter(name: string): Observable<Character[]> {
    const encodedName: string = encodeURIComponent(name);
    return this.httpClient.get<Character[]>(`http://localhost:5290/api/characters/search?name=${encodedName}`);
  }

  public getAnimes(name: string): Observable<Anime[]> {
    const encodedName: string = encodeURIComponent(name);
    return this.httpClient.get<Anime[]>(`http://localhost:5290/api/anime/search?name=${encodedName}`);
  }

  public getCharacterOfTheDay(gameId: number): Observable<Character> {
    return this.httpClient.get<Character>(`http://localhost:5290/api/characters/characterOfTheDay?gameId=${gameId}`);
  }

    // 'http://localhost:5290/api/Characters/splashOfTheDay?gameId=1' \
  
  public getSplashOfTheDay(gameId: number): Observable<SplashOfTheDay> {
    return this.httpClient.get<SplashOfTheDay>(`http://localhost:5290/api/characters/splashOfTheDay?gameId=${gameId}`);
  }

  public getSplashOfTheDayAnime(): Observable<SplashOfTheDay> {
    return this.httpClient.get<SplashOfTheDay>(`http://localhost:5290/api/anime/getSplashOfTheDay`);
  }

  
}
