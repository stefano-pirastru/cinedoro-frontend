import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Screenings } from './screenings';

describe('Screenings', () => {
  let component: Screenings;
  let fixture: ComponentFixture<Screenings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Screenings],
    }).compileComponents();

    fixture = TestBed.createComponent(Screenings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
