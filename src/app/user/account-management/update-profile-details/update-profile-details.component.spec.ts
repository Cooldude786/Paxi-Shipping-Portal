import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileDetailsComponent } from './update-profile-details.component';

describe('UpdateProfileDetailsComponent', () => {
  let component: UpdateProfileDetailsComponent;
  let fixture: ComponentFixture<UpdateProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProfileDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
