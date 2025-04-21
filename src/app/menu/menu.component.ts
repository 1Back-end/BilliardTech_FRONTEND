import {Component, EventEmitter, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé

@Component({
  selector: 'app-menu',
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
    TranslateModule
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent {

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
    {
      id: 'academic_year',
      path: '/admin/academic_year',
      label: 'MENU.ACADEMIC_YEAR',
      icon: 'fa-solid fa-calendar-plus', // Calendrier
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'groups',
      path: '/admin/groups',
      label: 'MENU.GROUPS',
      icon: 'fa-solid fa-landmark', // Tableau de classe
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'semester',
      path: '/admin/semester',
      label: 'MENU.SEMESTER',
      icon: 'fas fa-calendar', // Période
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'programs',
      path: '/admin/programs',
      label: 'MENU.PROGRAMS',
      icon: 'fas fa-project-diagram', // Structure
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'departments',
      path: '/admin/departments',
      label: 'MENU.DEPARTMENTS',
      icon: 'fas fa-layer-group', // Spécialisations
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'type_of_examns',
      path: '/admin/type_of_examns',
      label: 'MENU.TYPE_OF_EXAMS',
      icon: 'fa-solid fa-book', // Notes validées
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'profesors',
      path: '/admin/profesors',
      label: 'MENU.PROFESSORS',
      icon: 'fa-solid fa-users-viewfinder', // Professeur
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'courses',
      path: '/admin/courses',
      label: 'MENU.COURSES',
      icon: 'fa-solid fa-pen-to-square', // Livre ouvert
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'affectations_courses',
      path: '/admin/affectations_courses',
      label: 'MENU.COURSES_ASSIGMENT',
      icon: 'fa-solid fa-share-nodes', // Professeur
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'students',
      path: '/admin/students',
      label: 'MENU.STUDENTS',
      icon: 'fa-solid fa-users-between-lines', // Étudiants
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'notes',
      path: '/admin/notes',
      label: 'MENU.NOTES',
      icon: 'fas fa-clipboard-check', // Notes validées
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'Utilisateurs',
      path: '/admin/users',
      label: 'MENU.USERS',
      icon: 'fa-solid fa-users-gear', // Groupe d'utilisateurs
      permission: 'UserController::index',
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
