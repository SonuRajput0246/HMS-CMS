import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, Routes, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { AppConfig } from './core/config/config';
import { InstanceService } from './core/config/instance.service';

@Component({ selector: 'app-stub', standalone: true, template: 'stub' })
class StubDashboardComponent { }

@Component({ selector: 'app-stub-404', standalone: true, template: '404' })
class StubNotFoundComponent { }

describe('DEBUG2', () => {
  it('inspects canMatch on stub routes', async () => {
    const guardCalls: string[] = [];

    function activeInstance(type: string) {
      return () => {
        let result: any;
        try {
          result = TestBed.inject(InstanceService).type;
        } catch (e: any) {
          result = 'THREW: ' + e.message;
        }
        guardCalls.push(`${type} <- saw ${result}`);
        return result === type;
      };
    }

    const table: Routes = [
      { path: 'hms', canMatch: [activeInstance('HMS')], loadComponent: () => Promise.resolve(StubDashboardComponent) },
      { path: 'cms', canMatch: [activeInstance('CMS')], loadComponent: () => Promise.resolve(StubDashboardComponent) },
      { path: '**', component: StubNotFoundComponent }
    ];

    const config = new AppConfig();
    config.set('INSTANCE_TYPE', 'HMS');

    TestBed.configureTestingModule({
      providers: [provideRouter(table), { provide: AppConfig, useValue: config }]
    });

    const harness = await RouterTestingHarness.create('/hms/dashboard');
    console.log('DEBUG2 guard calls =', JSON.stringify(guardCalls));

    const router = TestBed.inject(Router);
    console.log('DEBUG2 url         =', router.url);
    let r = router.routerState.snapshot.root;
    console.log('DEBUG2 root path   =', r.routeConfig?.path);
    while (r.firstChild) {
      r = r.firstChild;
      console.log('DEBUG2 child path  =', r.routeConfig?.path, '| component:', (r.component as any)?.name);
    }

    expect(true).toBe(true);
  });
});