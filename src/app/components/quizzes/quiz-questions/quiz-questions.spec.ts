import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizQuestions } from './quiz-questions';

describe('QuizQuestions', () => {
  let component: QuizQuestions;
  let fixture: ComponentFixture<QuizQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
