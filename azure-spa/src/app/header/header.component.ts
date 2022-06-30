import { Component, Inject, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [
    {
      label: 'home',
      routerLink: '/'
    },
    {
      label: 'login',
      command: () => {this.login()}
    },
    {
      label: 'logout',
      command: () => {this.logout()}
    },
    {
      label: 'profile'
    }
  ]

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient) { }

    ngOnInit(): void {
      this.isIframe = window !== window.parent && !window.opener;
      debugger
      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.setLoginDisplay();
        });
    }

    setLoginDisplay() {
      const accounts = this.authService.instance.getAllAccounts();
      this.loginDisplay = accounts.length > 0;
      const loginBtn = this.items[1];
      const logoutBtn = this.items[2];
      const profileBtn = this.items[3];

      loginBtn.visible = !this.loginDisplay;
      logoutBtn.visible = this.loginDisplay;
      profileBtn.visible = this.loginDisplay;



      if (this.loginDisplay) {
        const acc = accounts[0];
        this.http.get('https://localhost:7168/api')
        .subscribe({
          next: (some: any) => {
            debugger;
          },
          error: err => {
            debugger;
          }
        })
        profileBtn.label = `profile ${acc.name}`
      }
    }

    login() {
      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
        if (this.msalGuardConfig.authRequest) {
          this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
            });
        } else {
          this.authService.loginPopup()
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
            });
        }
      } else {
        if (this.msalGuardConfig.authRequest) {
          this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
        } else {
          this.authService.loginRedirect();
        }
      }
    }

    logout() {
      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
        this.authService.logoutPopup({
          postLogoutRedirectUri: "/",
          mainWindowRedirectUri: "/"
        });
      } else {
        this.authService.logoutRedirect({
          postLogoutRedirectUri: "/",
        });
      }
    }

    ngOnDestroy(): void {
      this._destroying$.next(undefined);
      this._destroying$.complete();
    }
}
