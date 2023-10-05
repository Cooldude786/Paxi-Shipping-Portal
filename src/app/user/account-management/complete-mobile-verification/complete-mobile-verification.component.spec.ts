import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteMobileVerificationComponent } from './complete-mobile-verification.component';

describe('CompleteMobileVerificationComponent', () => {
  let component: CompleteMobileVerificationComponent;
  let fixture: ComponentFixture<CompleteMobileVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteMobileVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteMobileVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
