import { inject, NgModule } from '@angular/core';
import { CanMatchFn, Router, RouterModule, Routes, UrlTree } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { InstanceService } from './core/config/instance.service';

/**
 * Guards `/hms` or `/cms` so only the active instance's module can match.
 *
 * `canMatch` is used deliberately rather than `canActivate`: it is the only one
 * of the two that runs BEFORE `loadChildren` fetches the lazy chunk, so a CMS
 * deployment never downloads the hotel screens even if someone types the URL.
 * A `canActivate` guard would still fire the download during recognition.
 *
 * Returning false makes the router fall through to the `**` route, so a stale
 * bookmark lands on the 404 page, which then offers a link home.
 */
function activeInstance(...types: string[]): CanMatchFn {
  return () => types.includes(inject(InstanceService).type);
}

/** Sends the bare `/` to whichever dashboard this deployment runs. */
function instanceHomeRedirect(): UrlTree {
  return inject(Router).parseUrl(inject(InstanceService).homeUrl);
}

/**
 * Route table is static. An earlier version built it from a `forRoot` factory
 * that read the instance type, which cannot work: `config.json` is fetched
 * through `HttpClient`, that request instantiates the HTTP interceptor, and the
 * interceptor injects `Router` -- so the factory ran during bootstrap, before
 * the instance type had been read. Gating with `canMatch` instead moves every
 * instance check to navigation time, which is always after startup.
 */
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [instanceHomeRedirect]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(a => a.AuthModule)
  },
  {
    path: 'hms',
    canMatch: [activeInstance('HMS')],
    loadChildren: () => import('./hms/hms.module').then(a => a.HmsModule)
  },
  {
    path: 'cms',
    canMatch: [activeInstance('CMS')],
    loadChildren: () => import('./cms/cms.module').then(a => a.CmsModule)
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