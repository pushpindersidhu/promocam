import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmapComponent } from './gmap/gmap.component';
import { PlacesComponent } from './places/places.component';
import { PlaceDetailsComponent } from './place-details/place-details.component';
import { VideosComponent } from './videos/videos.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  { path: 'map', component: GmapComponent },
  { path: 'places', component: PlacesComponent },
  { path: 'places/:id', component: PlaceDetailsComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'upload', component: UploadComponent },
  { path: '', redirectTo: '/places', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
