import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: [],
  animations: [
    trigger('openClose', [
      state(
        'closed',
        style({
          visibility: 'hidden',
          right: '0px',
        })
      ),
      state(
        'open',
        style({
          right: '0px',
        })
      ),
      transition('open <=> closed', [animate('0.25s ease-in-out')]),
    ]),
  ],
})
export class ToastComponent implements OnInit {

  constructor(public toastService: ToastService) {
    this.toastService.open.subscribe((data) => {
      if (data.show) {
        setTimeout(() => {
          this.toastService.hide();
        }, 2000);
      }
    });
  }

  ngOnInit() {}
}
