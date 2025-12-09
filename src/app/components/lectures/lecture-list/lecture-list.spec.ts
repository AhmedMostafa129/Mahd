import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureList } from './lecture-list';

describe('LectureList', () => {
  let component: LectureList;
  let fixture: ComponentFixture<LectureList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
