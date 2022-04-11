import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { TableContainerComponent } from './table-container/table-container.component';
import { CoreModule } from '../core/core.module';
import { SortableDirective } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    TableContainerComponent,
    SortableDirective
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CoreModule,
    FormsModule,
    NgbModule
  ]
})
export class HomeModule { }
