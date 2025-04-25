import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LoginGuard } from './auth/login.guard'; // Importation du guard de connexion
import { AuthGuard } from './auth/auth.guard'; // Importation du guard d'authentification
import { AdminComponent } from './admin/admin.component'; // Composant principal pour l'admin
import { DashboardComponent } from './dashboard/dashboard.component'; // Composant de dashboard
import {UtilisateursComponent} from './utilisateurs/utilisateurs.component'; // Composant pour les utilisateurs
import {AddUtilisateursComponent} from './utilisateurs/add-utilisateurs/add-utilisateurs.component'; // Composant pour ajouter des utilisateurs
import {ChangePasswordComponent} from './auth/change-password/change-password.component';
import {AcademicYearComponent} from './academic-year/academic-year.component';
import {SemesterComponent} from './semester/semester.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {CodeOtpComponent} from './auth/code-otp/code-otp.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ProgramsComponent} from './programs/programs.component';
import {HomeComponent} from './home/home.component';
import {DepartmentsComponent} from './departments/departments.component';
import {TypeOfExamnsComponent} from './type-of-examns/type-of-examns.component';
import {ProfesorsComponent} from './profesors/profesors.component';
import {GroupComponent} from './group/group.component';
import {StudentComponent} from './student/student.component';
import {AddStudentComponent} from './student/add-student/add-student.component';
import {EditStudentComponent} from './student/edit-student/edit-student.component';
import {EditUtilisateursComponent} from './utilisateurs/edit-utilisateurs/edit-utilisateurs.component';
import {AddProfesseursComponent} from './profesors/add-professeurs/add-professeurs.component';
import {ProfileUsersComponent} from './profile-users/profile-users.component';
import {EditProfesseursComponent} from './profesors/edit-professeurs/edit-professeurs.component';
import {CoursesComponent} from './courses/courses.component';
import {AddCoursesComponent} from './courses/add-courses/add-courses.component';
import {EditCoursesComponent} from './courses/edit-courses/edit-courses.component';
import {AffectationsCoursesComponent} from './affectations-courses/affectations-courses.component';
import {SaveNotesComponent} from './pages/professor/save-notes/save-notes.component';
import {StudentResultsComponent} from './pages/student-results/student-results.component';


export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [LoginGuard] 
  },
  {
    path: 'home',
    component: HomeComponent
  },
  
  // Route de l'admin (avec sous-routes)
  {
    path: 'admin', 
    component: AdminComponent, // Composant principal pour l'admin
    canActivate: [AuthGuard], // Protège cette route avec un guard d'authentification
    children: [
      {
        path: 'dashboard', 
        component: DashboardComponent, // Composant de dashboard pour l'admin
        canActivate: [AuthGuard] // Protège cette route avec le même guard d'authentification
      },
      {
        path: 'profile',
        component: ProfileUsersComponent,
        canActivate : [AuthGuard]
      },
      {
        path: 'users',
        component: UtilisateursComponent, // Composant pour la gestion des utilisateurs
        canActivate: [AuthGuard] // Protège cette route avec le même guard d'authentification
      },
      {
        path: 'users/add',
        component: AddUtilisateursComponent, // Composant pour ajouter un nouvel utilisateur
        canActivate: [AuthGuard] // Protège cette route avec le même guard d'authentification
      },
      {
        path: 'users/edit/:uuid',
        component: EditUtilisateursComponent, // Composant pour ajouter un nouvel utilisateur
        canActivate: [AuthGuard] // Protège cette route avec le même guard d'authentification
      },
      {
        path :'academic_year',
        component: AcademicYearComponent, // Composant pour la gestion des années académiques
        canActivate: [AuthGuard] // Protège cette route avec le même guard d'authentification
      },
      {
        path :'affectations_courses',
        component: AffectationsCoursesComponent, // Composant pour la gestion des années académiques
        canActivate: [AuthGuard] // Protège cette route avec le même guard d'authentification
      },
      {
        path :'semester',
        component: SemesterComponent, // Composant pour la gestion des années académiques
        canActivate: [AuthGuard] // Protège cette route avec le même guard d'authentification
      },
      {
        path : 'programs',
        component : ProgramsComponent,
        canActivate : [AuthGuard]
      },
      {
        path : 'departments',
        component : DepartmentsComponent,
        canActivate : [AuthGuard]
      },
      {
        path : 'type_of_examns',
        component : TypeOfExamnsComponent,
        canActivate : [AuthGuard]
      },
      {
        path : 'profesors',
        component : ProfesorsComponent,
        canActivate : [AuthGuard]
      },
      {
        path :'groups',
        component : GroupComponent,
        canActivate : [AuthGuard]

      },
      {
        path :'students',
        component : StudentComponent,
        canActivate : [AuthGuard]

      },
      {
        path : 'courses',
        component : CoursesComponent,
        canActivate : [AuthGuard]

      },
      {
        path : 'courses/add',
        component : AddCoursesComponent,
        canActivate : [AuthGuard]

      },
      {
        path : 'courses/edit/:uuid',
        component : EditCoursesComponent,
        canActivate : [AuthGuard]

      },
      {
        path :'students/add',
        component : AddStudentComponent,
        canActivate : [AuthGuard]

      },
      {
        path :'teachers/add',
        component : AddProfesseursComponent,
        canActivate : [AuthGuard]

      },
      {
        path :'teachers/edit/:uuid',
        component : EditProfesseursComponent,
        canActivate : [AuthGuard]

      },
      {
        path :'students/edit/:uuid',
        component : EditStudentComponent,
        canActivate : [AuthGuard]

      },
      {
        path: 'student-results',
        component: StudentResultsComponent,
        canActivate : [AuthGuard]
      },
      {
        path: 'professor/save_notes',
        component: SaveNotesComponent,
        canActivate: [AuthGuard]
      },
      {
        path : 'home',
        component : HomeComponent,
      },
      { 
        path: '', 
        redirectTo: '/admin/dashboard', 
        pathMatch: 'full' // Redirige vers le dashboard par défaut si rien n'est spécifié après "admin"
      }
    ]
  },
  
  // Redirection par défaut pour les utilisateurs non connectés
  { 
    path: '',
    redirectTo: '/home',
    pathMatch: 'full' 
  },
  {
    path: 'auth/change-password', // Route séparée pour le changement de mot de passe
    component: ChangePasswordComponent,
    canActivate: [AuthGuard ], // Protéger cette route
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'auth/code-otp',
    component: CodeOtpComponent,
  },
  {
    path: 'auth/reset-password',
    component: ResetPasswordComponent,
  },
];
