import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ToastType {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export interface ToastData {
  msg: string;
  type: ToastType;
  show?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  data!: ToastData;

  public open = new Subject<ToastData>();

  show(data: ToastData) {
    this.data = { ...data, show: true };
    this.open.next(this.data);
  }

  hide() {
    this.data = { ...this.data, show: false };
    this.open.next(this.data);
  }
}
