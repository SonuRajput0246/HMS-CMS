import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../core/config/config';

@Injectable({
  providedIn: 'root'
})
export class InitialService {

  private http = inject(HttpClient);
  private appConfig = inject(AppConfig);

  /** Holds API base URL loaded at app startup */
  baseUrl!: string;

  loadAppConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<any>('assets/config.json').subscribe({
        next: (data) => {
          const baseUrl = data?.global_setting?.api_base_url;

          if (!baseUrl) {
            reject('api_base_url missing in config.json');
            return;
          }

          this.appConfig.set('BASE_URL', baseUrl);

          // Which product this deployment is. Left undefined when absent so
          // InstanceService can apply its own HMS fallback rather than
          // failing startup on a half-written config file.
          const instanceType = data?.global_setting?.instance_type;
          if (instanceType) {
            this.appConfig.set('INSTANCE_TYPE', instanceType);
          }

          resolve();
        },
        error: reject
      });
    });
  }
}
