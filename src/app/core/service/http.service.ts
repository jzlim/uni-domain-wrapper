import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  httpClientGet(url: string, params: any) {
    if (params) {
      params = new HttpParams({ fromObject: params });
    }
    return this.http.get(url, { params });
  }
}
