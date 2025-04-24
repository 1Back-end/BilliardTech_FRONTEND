import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
    TranslateModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() closeOffCanvas = new EventEmitter<boolean>();

  constructor(private router: Router, public role: RoleService) {}

  menuRoutes: any = [
    {
      id: 'save_notes',
      path: '/admin/professor/save_notes',
      label: 'MENU.SAVE_NOTES',
      icon: 'fa-solid fa-file-circle-plus', // Choix d’icône pour l’enregistrement
      visibleFor: ['PROFESSEUR'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'my_courses',
      path: '/professor/my-courses',
      label: 'MENU.MY_COURSES',
      icon: 'fa-solid fa-book-open-reader', // Icône livre ouvert
      visibleFor: ['PROFESSEUR'],
      children: [],
      subMenuRoutes: [],
    },
    {
      
      id: 'dashboard',
      path: '/admin/dashboard',
      label: 'MENU.DASHBOARD',
      icon: 'fa-solid fa-chart-simple',
      permission: '',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'academic_year',
      path: '/admin/academic_year',
      label: 'MENU.ACADEMIC_YEAR',
      icon: 'fa-solid fa-calendar-plus',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'groups',
      path: '/admin/groups',
      label: 'MENU.GROUPS',
      icon: 'fa-solid fa-landmark',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'semester',
      path: '/admin/semester',
      label: 'MENU.SEMESTER',
      icon: 'fas fa-calendar',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'programs',
      path: '/admin/programs',
      label: 'MENU.PROGRAMS',
      icon: 'fas fa-project-diagram',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'departments',
      path: '/admin/departments',
      label: 'MENU.DEPARTMENTS',
      icon: 'fas fa-layer-group',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'type_of_examns',
      path: '/admin/type_of_examns',
      label: 'MENU.TYPE_OF_EXAMS',
      icon: 'fa-solid fa-book',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'profesors',
      path: '/admin/profesors',
      label: 'MENU.PROFESSORS',
      icon: 'fa-solid fa-users-viewfinder',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'courses',
      path: '/admin/courses',
      label: 'MENU.COURSES',
      icon: 'fa-solid fa-pen-to-square',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'affectations_courses',
      path: '/admin/affectations_courses',
      label: 'MENU.COURSES_ASSIGMENT',
      icon: 'fa-solid fa-share-nodes',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'students',
      path: '/admin/students',
      label: 'MENU.STUDENTS',
      icon: 'fa-solid fa-users-between-lines',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'notes',
      path: '/admin/notes',
      label: 'MENU.NOTES',
      icon: 'fas fa-clipboard-check',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'Utilisateurs',
      path: '/admin/users',
      label: 'MENU.USERS',
      icon: 'fa-solid fa-users-gear',
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    
  ];

  closeCanvas() {
    this.closeOffCanvas.emit(true);
  }

  isActiveSubmenu(routes: string[]): boolean {
    return routes.some(route => this.router.url.startsWith(route));
  }

  hasPermission(route: any): boolean {
    return !route.visibleFor || route.visibleFor.includes(this.role.getUserRole());
  }
}
