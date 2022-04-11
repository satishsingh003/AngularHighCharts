import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoService } from './cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isAuthenticated: boolean = false;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
  }

  public ngOnInit(): void {
    this.cognitoService.isAuthenticated()
    .then((success: boolean) => {
      console.log('success', success)
      this.isAuthenticated = success;
    });
  }

  public signOut(): void {
    this.cognitoService.signOut()
    .then(() => {
      this.isAuthenticated = false;
      this.router.navigate(['/signIn']);
      window.location.reload();

    });
  }

}
