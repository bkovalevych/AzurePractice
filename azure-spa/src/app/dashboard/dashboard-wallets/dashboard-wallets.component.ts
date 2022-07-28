import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { WalletValue } from 'src/app/core/models/values/wallet-value';
import { WalletService } from 'src/app/core/services/api/wallet.service';

@Component({
  selector: 'app-dashboard-wallets',
  templateUrl: './dashboard-wallets.component.html',
  styleUrls: ['./dashboard-wallets.component.scss']
})
export class DashboardWalletsComponent implements OnInit {
  wallets: WalletValue[] = [];
  selectedWallet: WalletValue;
  @Output() selectedWalletChanged = new EventEmitter<WalletValue>();

  responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
  ];

  private readonly _destroying$ = new Subject<void>();

  constructor(private walletService: WalletService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadWallets();
  }

  loadWallets() {
    this.walletService.getWallets()
    .subscribe(payload => {
      this.wallets = payload;
      if (this.wallets && this.wallets.length) {
        let selectedWalletId = this.activatedRoute.snapshot.queryParams['selectedWallet'];
        if (selectedWalletId) {
          this.selectWallet(this.wallets.find(it => it.id == selectedWalletId));
        } else {
          this.selectWallet(this.wallets[0]);
        }
      }
    })
  }

  selectWallet(wallet: WalletValue) {
    this.router.navigate([], {queryParams: {selectedWallet: wallet.id}});
    this.selectedWalletChanged.next(wallet);
    this.selectedWallet = wallet;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
