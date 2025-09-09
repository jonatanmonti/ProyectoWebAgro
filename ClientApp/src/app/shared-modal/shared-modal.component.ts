import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ModalType = 'success' | 'info' | 'warning' | 'error';

export interface ModalConfig {
  title?: string;
  message?: string;
  type?: ModalType;
  showClose?: boolean;
  confirmText?: string;
}

@Component({
  selector: 'app-shared-modal',
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss']
})
export class SharedModalComponent {
  @Input() visible = false;
  @Input() config: ModalConfig = {
    title: 'Message',
    message: '',
    type: 'info',
    showClose: true,
    confirmText: 'OK',
  };
  @Output() closed = new EventEmitter<void>();

  close() {
    this.visible = false;
    this.closed.emit();
  }

  get headerClass() {
    switch (this.config.type) {
      case 'success': return 'bg-success text-white';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-danger text-white';
      default: return 'bg-info text-white';
    }
  }

  get icon() {
    switch (this.config.type) {
      case 'success': return 'bi-check-circle';
      case 'warning': return 'bi-exclamation-triangle';
      case 'error': return 'bi-x-circle';
      default: return 'bi-info-circle';
    }
  }
}
