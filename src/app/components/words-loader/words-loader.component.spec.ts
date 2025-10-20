import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsLoaderComponent } from './words-loader.component';

describe('WordsLoaderComponent', () => {
  let component: WordsLoaderComponent;
  let fixture: ComponentFixture<WordsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
