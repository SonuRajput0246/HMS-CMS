import { TestBed } from '@angular/core/testing';
import { Router, Routes, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AppConfig } from './core/config/config';
import { InstanceService } from './core/config/instance.service';
import { routes } from './app-routing.module';

describe('DEBUG', () => {
  it('captures guard result and redirect timing', async () => {
    const config = new AppConfig();
    config.set('INSTANCE_TYPE', 'CMS');

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: AppConfig, useValue: config }
      ]
    });

    const hmsRoute = routes.find(r => r.path === 'hms')!;
    const guard = hmsRoute.canMatch![0] as any;

    let result: any = 'NOT CALLED';
    try {
      result = TestBed.runInInjectionContext(
        () => guard({ routeConfig: hmsRoute } as any, [['hms'], ['dashboard']] as any)
      );
      if (result instanceof Promise) {
        result = 'PROMISE';
        const v = await result;
        console.log('DEBUG guard awaited =', v);
      }
    } catch (e: any) {
      result = 'THREW: ' + e.message;
    }
    console.log('DEBUG guard raw   =', result);

    // Now the redirect timing
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    console.log('DEBUG url before  =', router.url);
    await harness.navigateByUrl('/');
    console.log('DEBUG url after nav =', router.url);
    await new Promise(r => setTimeout(r, 0));
    console.log('DEBUG url after tick =', router.url);
    await new Promise(r => setTimeout(r, 50));
    console.log('DEBUG url after 50ms =', router.url);

    expect(true).toBe(true);
  });
});