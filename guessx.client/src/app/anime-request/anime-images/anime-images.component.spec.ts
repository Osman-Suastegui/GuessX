import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeImagesComponent } from './anime-images.component';

describe('AnimeImagesComponent', () => {
  let component: AnimeImagesComponent;
  let fixture: ComponentFixture<AnimeImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimeImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimeImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
