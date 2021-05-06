import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';
import { ListComponent } from './pages/list/list.component';
import { UploadComponent } from './pages/upload/upload.component';
import { VideoComponent } from './pages/video/video.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'video/:id', component: VideoComponent},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
