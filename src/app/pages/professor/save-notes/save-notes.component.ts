import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient,HttpHeaders  ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../../config'
import { FormsModule } from '@angular/forms'; 
import {RoleService } from '../../../services/role.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé
import {LanguageHeaderService} from '../../../admin/language-header.service';
@Component({
  selector: 'app-save-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,TranslateModule],
  templateUrl: './save-notes.component.html',
  styleUrl: './save-notes.component.css'
})
export class SaveNotesComponent {

  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient,public role: RoleService,private translate: TranslateService,private languageHeaderService: LanguageHeaderService,) {
    
  }

}
