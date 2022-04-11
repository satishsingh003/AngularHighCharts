import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';

import { IUser, CognitoService } from '../cognito.service';
import {ExpenseService} from '../expense.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loading: boolean;
  user: any;
  constructor(private cognitoService: CognitoService, private expenseService:ExpenseService) {
    this.loading = false;
    this.user = {} ;
  }

  public ngOnInit(): void {
    
  }

  public update(): void {
    this.loading = true;
    this.expenseService.addExpense(this.user).pipe(first())
    .subscribe(() => {
       this.loading = false;
    })
  }

}
