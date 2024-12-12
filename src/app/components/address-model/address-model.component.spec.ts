import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressModelComponent } from './address-model.component';

describe('AddressModelComponent', () => {
  let component: AddressModelComponent;
  let fixture: ComponentFixture<AddressModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
