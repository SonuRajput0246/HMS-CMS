import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableRoomComponent } from './available-room.component';

describe('AvailableRoomComponent', () => {
  let component: AvailableRoomComponent;
  let fixture: ComponentFixture<AvailableRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableRoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
