import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmapComponent } from './gmap/gmap.component';
import { PlacesComponent } from './places/places.component';
import { PlaceDetailsComponent } from './place-details/place-details.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [
  { path: 'map', component: GmapComponent },
  { path: 'list', component: PlacesComponent },
  { path: 'detail/:id', component: PlaceDetailsComponent },
  { path: 'videos', component: VideosComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
