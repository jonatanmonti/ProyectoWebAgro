import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalConfig } from '../shared-modal/shared-modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private visible$ = new BehaviorSubject<boolean>(false);
  private config$ = new BehaviorSubject<ModalConfig | null>(null);

  isVisible$ = this.visible$.asObservable();
  modalConfig$ = this.config$.asObservable();

  open(config: ModalConfig) {
    this.config$.next({
      title: config.title ?? 'Message',
      message: config.message ?? '',
      type: config.type ?? 'info',
      showClose: config.showClose ?? true,
      confirmText: config.confirmText ?? 'OK',
    });
    this.visible$.next(true);
  }

  close() {
    this.visible$.next(false);
  }
}
