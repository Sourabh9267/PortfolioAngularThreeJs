import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextScrambleComponent } from './text-scramble.component';

describe('TextScrambleComponent', () => {
  let component: TextScrambleComponent;
  let fixture: ComponentFixture<TextScrambleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextScrambleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextScrambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
