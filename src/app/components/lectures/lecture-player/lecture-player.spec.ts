import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturePlayer } from './lecture-player';

describe('LecturePlayer', () => {
  let component: LecturePlayer;
  let fixture: ComponentFixture<LecturePlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LecturePlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecturePlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
