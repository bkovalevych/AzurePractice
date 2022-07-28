import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { WalletValue } from 'src/app/core/models/values/wallet-value';

@Component({
  selector: 'app-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss']
})
export class DashboardIndexComponent implements OnInit, OnDestroy {
  isOpenedPopupToCreateTransaction: boolean = false;
  private readonly _destroying$ = new Subject<void>();
  selectedWallet: WalletValue;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams
    .pipe(takeUntil(this._destroying$))
    .subscribe(queryParams => {
      this.onCreateTransactionDialogVisibilityChanged(queryParams['openPopupToCreateTransaction']);
    })
  }

  onCreateTransactionDialogVisibilityChanged(visible: boolean) {
    this.isOpenedPopupToCreateTransaction = visible;
    if (!visible) {
      this.router.navigate([], {
        queryParams: {
          openPopupToCreateTransaction: null
        },
        queryParamsHandling: 'merge'
      })
    }
  }

  onSelectedWallet(wallet: WalletValue) {
    this.selectedWallet = wallet;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
