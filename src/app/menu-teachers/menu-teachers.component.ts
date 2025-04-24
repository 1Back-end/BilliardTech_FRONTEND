import {Component, EventEmitter, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé

@Component({
  selector: 'app-menu-teachers',
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
    TranslateModule
  ],
  templateUrl: './menu-teachers.component.html',
  styleUrl: './menu-teachers.component.css'
})
export class MenuTeachersComponent {

  @Output() closeOffCanvas = new EventEmitter<boolean>();

  menuRoutes: any = [
    {
      id: 'dashboard',
      path: '/admin/dashboard',
      label: 'MENU.DASHBOARD',
      icon: 'fa-solid fa-chart-simple', // Tableau de bord
      permission: '',
      children: [],
      subMenuRoutes: [],
    },
  
    
  ];

  constructor(private router: Router) {
  }

  closeCanvas() {
    this.closeOffCanvas.emit(true);
  }

  isActiveSubmenu(routes: string[]): boolean {
    return routes.some(route => this.router.url.startsWith(route));
  }


}
