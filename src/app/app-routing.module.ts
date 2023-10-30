import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmapComponent } from './gmap/gmap.component';
import { PlacesComponent } from './places/places.component';
import { PlaceDetailsComponent } from './place-details/place-details.component';

const routes: Routes = [
  { path: 'map', component: GmapComponent },
  { path: 'list', component: PlacesComponent },
  { path: 'detail/:id', component: PlaceDetailsComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
