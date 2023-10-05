import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelNumberComponent } from './parcel-number.component';

describe('ParcelNumberComponent', () => {
  let component: ParcelNumberComponent;
  let fixture: ComponentFixture<ParcelNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
