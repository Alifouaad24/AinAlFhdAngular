import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = "http://saifsfo-002-site19.atempurl.com/";
  constructor(private http: HttpClient) { }

  getData(endPoint: string): Observable<any> {

    var data = this.http.get(`${this.baseUrl}${endPoint}`);
    return data;
  }


  postData(endPoint: string, data: any): Observable<any> {
    var data1 = this.http.post(`${this.baseUrl}${endPoint}`, data);
    return data1;
  }
}
