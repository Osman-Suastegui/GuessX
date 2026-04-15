export interface Character {
  id: string;
  gameId: number;
  name: string;
  metadata: string | null;
}

export interface CharacterLeagueOfLegends {
  id: string;
  name: string;
  gender: string;
  role: string;
  position: string;
  class: string;
  resource: string;
  rangeType: string;
  releaseYear: number; // this would be the year
  imageUrl: string;
}

export interface SplashOfTheDay {
  id: string;
  name: string;
  splashImageUrl: string;
  date: string; 
  gameName: string;
}