import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { User } from '../model/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  user1: User = new User();
  errorMessage = 'Invalid Credentials';
  successMessage: string;
  invalidLogin = false;
  loginSuccess = false;
  rola: string;
  private isVisible = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService) { }

  ngOnInit() {
  }

  handleLogin() {
    this.authenticationService.authenticationService(this.user.username, this.user.password).subscribe((result) => {
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.isVisible = false;
      this.successMessage = 'Uspešno ste se prijavili!';
    });

    this.login();
  }

  login() {
    this.authenticationService.loginDone(this.user).subscribe(

      (data: User) => {
        this.successMessage = 'Uspešno ste se prijavili!';
        this.user = data;
        sessionStorage.setItem("authenticatedUser", this.user.username)
        sessionStorage.setItem("authenticatedUserRole", this.user.role)
        if (this.user.role === "CCA") {
          this.router.navigate(['/profileClinicCenterAdmin']);
        } else if (this.user.role === 'PA') {
          this.router.navigate(['/patient-home-page']);
        } else if (this.user.role === 'CA') {
          this.router.navigate(['/cadmin-home-page']);
        } else if (this.user.role === 'DOC') {
          this.router.navigate(['/doctorHomePage']);
        } else if (this.user.role === 'NURSE') {
          this.router.navigate(['/nurse-home-page']);
        } else {
          this.invalidLogin = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  change(isVisible: boolean) {
    this.isVisible = isVisible;
  }
}
