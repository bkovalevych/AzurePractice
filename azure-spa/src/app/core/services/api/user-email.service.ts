import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { SetEmailRequest } from '../../models/requests/set-email-request';
import { UserEmailValue } from '../../models/values/user-email-value';

@Injectable({
  providedIn: 'root'
})
export class UserEmailService {

  constructor(private http: HttpClient, private auth: MsalService) { }

  setUserEmail(email: string) {
    let acc = this.auth.instance.getActiveAccount();
    const command: SetEmailRequest = {
      userId: acc.localAccountId,
      email: email
    };
    let url = `${environment.baseUrl}/userEmails`;
    return this.http.put<UserEmailValue>(url, command);
  }

  getUserEmail() {
    let acc = this.auth.instance.getActiveAccount();
    let url = `${environment.baseUrl}/userEmails/${acc.localAccountId}`;

    return this.http.get<UserEmailValue>(url);
  }
}

