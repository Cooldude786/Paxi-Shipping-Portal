import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelHistoryComponent } from './parcel-history.component';

describe('ParcelHistoryComponent', () => {
  let component: ParcelHistoryComponent;
  let fixture: ComponentFixture<ParcelHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
