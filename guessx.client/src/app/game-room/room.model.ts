export interface TitleImage {
  id: number | null;
  imageUrl: string;
  imageType: string;
}

export interface RoomImage {
  id: number;
  titleName: string;
  category: string;
  status: string;
  genres: string[];
  titleImages: TitleImage[];
  titleAnswers: string[];
}

export interface UserRoom {
  name: string;
  score: number;
}

export interface RoomState {
  roomId: string;
  images: RoomImage[];
  owner: string;
  currentImageIndex: number;
  users: UserRoom[];
}

export interface ChatMessage {
  id?: number;
  text: string;
  sender: string;
  timestamp: Date;
  ownMessage: boolean;
  isAnswer?: boolean;
}
