import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLecture } from './upload-lecture';

describe('UploadLecture', () => {
  let component: UploadLecture;
  let fixture: ComponentFixture<UploadLecture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadLecture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadLecture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
