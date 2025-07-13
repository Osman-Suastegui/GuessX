import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home-page/home-page.component").then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: "game-room",
    loadChildren: () =>
      import("./game-room/game-room.module").then((m) => m.GameRoomModule),
  },
  {
    path: "anime-request",
    loadChildren: () =>
      import("./anime-request/anime-request.module").then(
        (m) => m.AnimeRequestModule,
      ),
  },
];
