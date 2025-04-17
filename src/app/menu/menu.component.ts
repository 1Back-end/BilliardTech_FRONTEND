import {Component, EventEmitter, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-menu',
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
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
      label: 'Tableau de bord',
      icon: 'fas fa-tachometer-alt', // Tableau de bord
      permission: '',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'academic_year',
      path: '/admin/academic_year',
      label: 'Gestion des années académiques',
      icon: 'fas fa-calendar-alt', // Calendrier
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'groups',
      path: '/admin/groups',
      label: 'Gestion des classes',
      icon: 'fas fa-school', // Tableau de classe
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'semester',
      path: '/admin/semester',
      label: 'Gestion des semestres',
      icon: 'fas fa-calendar', // Période
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'programs',
      path: '/admin/programs',
      label: 'Gestion des filières',
      icon: 'fas fa-project-diagram', // Structure
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'departments',
      path: '/admin/departments',
      label: 'Gestion des spécialités',
      icon: 'fas fa-layer-group', // Spécialisations
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'type_of_examns',
      path: '/admin/type_of_examns',
      label: 'Gestion des types d\'examen',
      icon: 'fas fa-bookmark', // Notes validées
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'profesors',
      path: '/admin/profesors',
      label: 'Gestion des professeurs',
      icon: 'fas fa-chalkboard-teacher', // Professeur
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'students',
      path: '/admin/students',
      label: 'Gestion des étudiants',
      icon: 'fas fa-user-graduate', // Étudiants
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'notes',
      path: '/admin/notes',
      label: 'Gestion des notes',
      icon: 'fas fa-clipboard-check', // Notes validées
      permission: 'CentreController::index',
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'Utilisateurs',
      path: '/admin/users',
      label: 'Gestion des utilisateurs',
      icon: 'fas fa-users', // Groupe d'utilisateurs
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
