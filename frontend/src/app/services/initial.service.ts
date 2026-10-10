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
          resolve();
        },
        error: reject
      });
    });
  }
}
