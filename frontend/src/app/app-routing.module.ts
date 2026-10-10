import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'hms/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(a => a.AuthModule)
  }, 
  {
    path: 'hms',
    loadChildren: () => import('./hms/hms.module').then(a => a.HmsModule),
  },
  {
    // Cafe Management System. Separate lazy chunk from HMS so a CMS-only
    // deployment never downloads hotel screens and vice versa.
    path: 'cms',
    loadChildren: () => import('./cms/cms.module').then(a => a.CmsModule),
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }