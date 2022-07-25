import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWalletsComponent } from './dashboard-wallets.component';

describe('DashboardWalletsComponent', () => {
  let component: DashboardWalletsComponent;
  let fixture: ComponentFixture<DashboardWalletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardWalletsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
