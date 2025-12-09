import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentReview } from './assignment-review';

describe('AssignmentReview', () => {
  let component: AssignmentReview;
  let fixture: ComponentFixture<AssignmentReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
