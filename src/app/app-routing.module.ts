import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AdminNavBarComponent } from './admin-nav-bar/admin-nav-bar.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin', component: AdminNavBarComponent, canActivate: [AuthGuard],
  children:[
    { path: 'home', component: AdminHomeComponent, canActivate: [AuthGuard] },
    { path: 'add-movie', component: AddMovieComponent, canActivate: [AuthGuard] },
    { path: 'add-movie/:id', component: AddMovieComponent, canActivate: [AuthGuard] },
  ]},
  { path: '**', component: NotFoundComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
   HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
