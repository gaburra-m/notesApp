import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styles: ``,
})
export class AlertComponent {
  type = input<'success' | 'error' | 'warning' | 'info' | null>(null);
  message = input<string | null>(null);

  get alertClasss() {
    switch (this.type()) {
      case 'success':
        return 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400';
        break;

      case 'error':
        return ' text-red-800 bg-red-50 dark:bg-red-900 dark:text-red-100';
        break;

      case 'warning':
        return 'text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300';
        break;

      case 'info':
      default:
        return 'text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400';
        break;
    }
  }
}
