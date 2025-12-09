import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureResources } from './lecture-resources';

describe('LectureResources', () => {
  let component: LectureResources;
  let fixture: ComponentFixture<LectureResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureResources]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureResources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
