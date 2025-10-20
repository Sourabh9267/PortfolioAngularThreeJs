import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCyclerComponent } from './word-cycler.component';

describe('WordCyclerComponent', () => {
  let component: WordCyclerComponent;
  let fixture: ComponentFixture<WordCyclerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordCyclerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordCyclerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
