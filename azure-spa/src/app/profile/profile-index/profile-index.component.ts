import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserValue } from 'src/app/core/models/values/user-value';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-index',
  templateUrl: './profile-index.component.html',
  styleUrls: ['./profile-index.component.scss']
})
export class ProfileIndexComponent implements OnInit {
  user: UserValue;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<UserValue>(environment.graphUrl)
      .subscribe(user => {
        this.user = user;
      })
  }
}
