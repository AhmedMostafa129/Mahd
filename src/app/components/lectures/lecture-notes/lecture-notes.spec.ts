import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureNotes } from './lecture-notes';

describe('LectureNotes', () => {
  let component: LectureNotes;
  let fixture: ComponentFixture<LectureNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
