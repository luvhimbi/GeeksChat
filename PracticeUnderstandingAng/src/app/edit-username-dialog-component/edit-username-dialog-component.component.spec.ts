import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsernameDialogComponentComponent } from './edit-username-dialog-component.component';

describe('EditUsernameDialogComponentComponent', () => {
  let component: EditUsernameDialogComponentComponent;
  let fixture: ComponentFixture<EditUsernameDialogComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUsernameDialogComponentComponent]
    });
    fixture = TestBed.createComponent(EditUsernameDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
