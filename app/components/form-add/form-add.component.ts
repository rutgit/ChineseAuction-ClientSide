import { Component, EventEmitter, Input,Output, OnChanges, SimpleChanges, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Present } from 'src/app/models/Present.model';
import { PresentService } from 'src/app/services/present.service';

@Component({
  selector: 'app-form-add',
  templateUrl: './form-add.component.html',
  styleUrls: ['./form-add.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class FormAddComponent implements OnChanges  {
  // @Input()
  // presentId: number = 0;

  constructor(private presentService: PresentService, private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    //this.presentService.getPresentById(this.presentId).subscribe(present => this.present = present);
  }
  @Input()
  present: Present = new Present();
  submitted: boolean = false;
  @Input()
  presentDialog: boolean = true;
  @Output()
  presentDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  hideDialog() {
    this.presentDialog = false;
    this.presentDialogChange.emit(this.presentDialog);
    this.submitted = false;
  }

  savePresent() {
    this.submitted = true;
    if (this.present.name.trim()) {

      if (this.present.presentId) {
        this.presentService.savePresent(this.present).subscribe(b => {
          console.log(b,"a")   
          this.presentService.setReloadPresent();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'present Updated', life: 3000 });
        });
      }
      else {  

        this.presentService.addPresent(this.present).subscribe(a => {
          console.log(a,"a")    
          this.presentService.setReloadPresent();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'present Created', life: 3000 });
        });
      }
      this.presentDialogChange.emit(this.presentDialog);
      this.present = new Present;
      this.hideDialog()
    }
  }

}
