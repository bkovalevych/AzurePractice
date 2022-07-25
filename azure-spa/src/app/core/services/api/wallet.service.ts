import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { CreateWalletRequest } from '../../models/requests/create-wallet-request';
import { CreateWalletTransaction } from '../../models/requests/create-wallet-transaction-request';
import { PerformedWalletTransactionResponse } from '../../models/values/performed-wallet-transaction-response';
import { WalletValue } from '../../models/values/wallet-value';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http: HttpClient, private auth: MsalService) { }

  createWallet(name: string) {
    let acc = this.auth.instance.getActiveAccount();
    const command: CreateWalletRequest = {
      name: name,
      userId: acc.localAccountId,
      userName: acc.username
    }
    let url = `${environment.functionsUrl}/CreateWallet?code=${environment.functionsKey}`;
    return this.http.post(url, command);
  }

  getWallets() {
    let acc = this.auth.instance.getActiveAccount();
    let url = `${environment.functionsUrl}/Wallets?userId=${acc.localAccountId}&code=${environment.functionsKey}`;
    return this.http.get<WalletValue[]>(url);
  }

  performTransaction(request: CreateWalletTransaction) {
    let url = environment.performTransactionUrl;
    return this.http.post<PerformedWalletTransactionResponse>(url, request);
  }
}

