import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé


@Component({
  selector: 'app-add-professeurs',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './add-professeurs.component.html',
  styleUrl: './add-professeurs.component.css'
})
export class AddProfesseursComponent {

  UserForm: FormGroup;
  filePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.UserForm = this.fb.group({
      last_name : ['',Validators.required],
      first_name : ['',Validators.required],
      email :  ['',Validators.required],
      phone_number : ['',Validators.required],
      second_phone_number : ['',Validators.required]
     
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
  
      // Générer un aperçu de l’image
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  removeFile() {
    this.selectedFile = null;
    this.filePreview = null;
  }
  onSubmit(){

  }

}
