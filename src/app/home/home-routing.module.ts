import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableContainerComponent } from './table-container/table-container.component';

const routes: Routes = [
  { path: '', component: TableContainerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
