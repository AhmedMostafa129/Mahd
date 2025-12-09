import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSections } from './course-sections';

describe('CourseSections', () => {
  let component: CourseSections;
  let fixture: ComponentFixture<CourseSections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSections]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSections);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
