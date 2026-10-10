import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig } from '../../core/config/config';
import { IEntityResponse } from '../../models/ICommon.model';
import { ICustomer, IFloorView } from '../../models/ICms.model';

/**
 * Tables, zones and customers.
 *
 * Kept in one service because they share the till: opening a table order and
 * identifying the customer happen in the same interaction, and splitting them
 * would mean two injections on every screen.
 */
@Injectable({ providedIn: 'root' })
export class CmsFloorService {

  private http = inject(HttpClient);
  private config = inject(AppConfig);

  private readonly baseURL: string;

  constructor() {
    this.baseURL = this.config.get('BASE_URL');
  }

  // ---- zones ----------------------------------------------------------

  getZones(data: any): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/table-zone/get`, data);
  }

  upsertZone(data: any): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/table-zone/upsert`, data);
  }

  getZoneTableCount(zoneId: number): Observable<IEntityResponse> {
    return this.http.get(`${this.baseURL}/api/v1/table-zone/get-table-count?id=${zoneId}`);
  }

  // ---- tables ---------------------------------------------------------

  getTables(data: any): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/table/get`, data);
  }

  getTableById(id: number): Observable<IEntityResponse> {
    return this.http.get(`${this.baseURL}/api/v1/table/get-by-id?id=${id}`);
  }

  /** Whole floor grouped by zone with any live order per table. One call. */
  getFloorView(): Observable<IEntityResponse> {
    return this.http.get(`${this.baseURL}/api/v1/table/get-floor-view`);
  }

  upsertTable(data: any): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/table/upsert`, data);
  }

  /**
   * Manual status flip.
   *
   * The backend refuses to release a table that still has an open order, so a
   * 409 here means "settle the order first" -- the caller should show that
   * message rather than silently retrying.
   */
  updateTableStatus(id: number, status: string, remarks?: string): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/table/update-status`, {
      id, status, remarks: remarks ?? null
    });
  }

  // ---- customers ------------------------------------------------------

  getCustomers(data: any): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/customer/get`, data);
  }

  getCustomerById(id: number): Observable<IEntityResponse> {
    return this.http.get(`${this.baseURL}/api/v1/customer/get-by-id?id=${id}`);
  }

  lookupByPhone(phone: string): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/customer/lookup-by-phone`, { phone });
  }

  /**
   * Minimal walk-in capture (name + phone).
   *
   * Returns the EXISTING customer with status 200 when the phone is already
   * known, so a caller can treat both outcomes as "customer ready" and bill
   * the original record.
   */
  quickCreateCustomer(data: { name: string; phone: string }): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/customer/quick-create`, data);
  }

  upsertCustomer(data: any): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/customer/upsert`, data);
  }

  redeemPoints(id: number, points: number): Observable<IEntityResponse> {
    return this.http.post(`${this.baseURL}/api/v1/customer/redeem-points`, { id, points });
  }
}