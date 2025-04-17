import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../config';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-profesors',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './profesors.component.html',
  styleUrl: './profesors.component.css'
})
export class ProfesorsComponent  {
  profesors : any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 5;
  searchQuery: string = '';
  exportUrl: string = '';
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {}; // pour le tri par colonne

  sortBy(column: string): void {
    // Toggle sort direction
    this.direction[column] = this.direction[column] === 'asc' ? 'desc' : 'asc';

    // Perform sorting on the fournisseurs array
    this.profesors.sort((a: any, b: any) => {
      const valA = a[column] || '';
      const valB = b[column] || '';
      
      // Sort in ascending or descending order based on direction
      return this.direction[column] === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }


}
