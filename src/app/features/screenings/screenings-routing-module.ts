import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreeningByFilmComponent } from './screening-by-film/screening-by-film';

const routes: Routes = [
  { path: 'film/:filmId', component: ScreeningByFilmComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreeningsRoutingModule { }