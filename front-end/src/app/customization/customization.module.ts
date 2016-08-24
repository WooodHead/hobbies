import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DateInputComponent } from './date-input.component';
import { ModalComponent } from './modal.component';
import { ItemListComponent } from './item-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        DateInputComponent,
        ModalComponent,
        ItemListComponent
    ],
    exports: [
        DateInputComponent,
        ItemListComponent
    ]
})
export class CustomizationModule {}