import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPlaceComponent } from './call-place.component';

describe('CallPlaceComponent', () => {
  let component: CallPlaceComponent;
  let fixture: ComponentFixture<CallPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
