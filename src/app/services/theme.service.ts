// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ThemeService {
//   private currentTheme: 'light' | 'dark' = 'light';

//   constructor() {
//     const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
//     this.currentTheme = savedTheme || 'light';
//     this.applyTheme(this.currentTheme);
//   }

//   toggleTheme(): void {
//     this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
//     this.applyTheme(this.currentTheme);
//   }

//   applyTheme(theme: 'light' | 'dark'): void {
//     document.body.classList.remove('light', 'dark');
//     document.body.classList.add(theme);
//     localStorage.setItem('theme', theme);
//   }

//   getTheme(): 'light' | 'dark' {
//     return this.currentTheme;
//   }
// }
