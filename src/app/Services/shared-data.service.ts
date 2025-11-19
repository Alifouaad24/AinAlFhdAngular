import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  private packages: any[] = []

  setData(data: any[]) {
    this.packages = data
  }

  getData() {
    return this.packages
  }

  clearData() {
    this.packages = []
  }
}
