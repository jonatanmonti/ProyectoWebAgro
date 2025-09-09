import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { ModalService } from './services/modal.service';
import { ModalConfig } from './shared-modal/shared-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  vm$ = combineLatest([
    this.modalService.isVisible$,
    this.modalService.modalConfig$
  ]).pipe(
    map(([visible, config]) => ({ visible, config: config as ModalConfig | null }))
  );

  constructor(private modalService: ModalService) { }

  onClosed() {
    this.modalService.close();
  }
}
