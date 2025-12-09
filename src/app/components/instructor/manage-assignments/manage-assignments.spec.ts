import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssignments } from './manage-assignments';

describe('ManageAssignments', () => {
  let component: ManageAssignments;
  let fixture: ComponentFixture<ManageAssignments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAssignments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAssignments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
