export interface AnimeSearchResponse {
  data: Anime[];
  pagination: Pagination;
}

export interface AnimeImage {
  imageUrl: string;
  selected?: boolean;
  imageType?: string; // 'jpg' or 'webp'
  id?: number; // optional, if needed for identification
}

export interface TitleData {
  id?: number;
  titleName: string;
  category: string;
  genres: string[];
  titleImages: AnimeImage[];
  titleAnswers: string[];
}

export interface Anime {
  mal_id: number;
  url: string;
  images: ImageFormats;
  titles: TitleEntry[];
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  status: string;
  score: number;
  genres: Genre[];
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface TitleEntry {
  type: string;
  title: string;
}

export interface ImageFormats {
  jpg: ImageUrlSet;
  webp: ImageUrlSet;
}

export interface ImageUrlSet {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}
