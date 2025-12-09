import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmit } from './assignment-submit';

describe('AssignmentSubmit', () => {
  let component: AssignmentSubmit;
  let fixture: ComponentFixture<AssignmentSubmit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSubmit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentSubmit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
