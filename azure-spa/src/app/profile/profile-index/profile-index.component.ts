import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UserValue } from 'src/app/core/models/values/user-value';
import { UserEmailService } from 'src/app/core/services/api/user-email.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-index',
  templateUrl: './profile-index.component.html',
  styleUrls: ['./profile-index.component.scss']
})
export class ProfileIndexComponent implements OnInit {
  user: UserValue;
  email: string;
  inputEmail = '';
  emailFieldOpened = false;
  errors: string[] = [];

  constructor(private http: HttpClient, private userEmaiService: UserEmailService) { }

  ngOnInit(): void {
    this.http.get<UserValue>(environment.graphUrl)
    .subscribe(user => this.user = user);

    this.userEmaiService.getUserEmail()
    .subscribe({next: userEmail => {
      this.email = userEmail.email;
    }, error: errorResponse => {
      this.email = ''
    }})

  }

  openToEdit() {
    if (this.email) {
      this.inputEmail = this.email
    }
    this.emailFieldOpened = true;
  }

  toDefault() {
    this.inputEmail = '';
    this.emailFieldOpened = false;
    this.errors = [];
  }

  onSave() {
    this.errors = [];
    debugger
    this.userEmaiService.setUserEmail(this.inputEmail)
    .subscribe({
      next: userEmail => {
        this.email = userEmail.email;
        this.toDefault();
      },
      error: response => {
        this.errors.push(response.error);
      }
    })
  }
}
