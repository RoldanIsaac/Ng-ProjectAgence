import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenceTableComponent } from './agence-table.component';

describe('AgenceTableComponent', () => {
  let component: AgenceTableComponent;
  let fixture: ComponentFixture<AgenceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgenceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
