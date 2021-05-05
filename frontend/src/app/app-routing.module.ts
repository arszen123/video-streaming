import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';
import { ListComponent } from './pages/list/list.component';
import { UploadComponent } from './pages/upload/upload.component';
import { VideoComponent } from './pages/video/video.component';

const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'video/:id', component: VideoComponent},
  {path: 'upload', component: UploadComponent, canDeactivate: [UnsavedChangesGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
