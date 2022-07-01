import { Component, Inject, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];

  itemsForAnonymous: MenuItem[] = [
    {
      label: 'home',
      routerLink: '/',
    },
    {
      label: 'login',
      command: () => {this.login()}
    }
  ];

  itemsForUser: MenuItem[] = [
    {
      label: 'home',
      routerLink: '/',
    },
    {
      label: 'logout',
      command: () => {this.logout()},
    },
    {
      label: 'profile',
      routerLink: 'profile'
    },
    {
      label: 'dashboard',
      routerLink: 'dashboard'
    }
  ]

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService) { }

    ngOnInit(): void {
      this.isIframe = window !== window.parent && !window.opener;
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
      const acc = this.authService.instance.getActiveAccount();
      this.loginDisplay = !!acc;
      if (this.loginDisplay) {
        const profileBtn = this.itemsForUser[2];
        this.items = this.itemsForUser;
        profileBtn.label = `profile ${acc.name}`
      } else {
        this.items = this.itemsForAnonymous;
      }
    }

    login() {
      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
        if (this.msalGuardConfig.authRequest) {
          this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
              this.setLoginDisplay();
            });
        } else {
          this.authService.loginPopup()
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
              this.setLoginDisplay();
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
