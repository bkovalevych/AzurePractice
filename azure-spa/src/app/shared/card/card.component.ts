import { Component, Input, OnInit } from '@angular/core';
import { WalletValue } from 'src/app/core/models/values/wallet-value';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() wallet: WalletValue;
  @Input() size: number = 5;
  @Input() interactive: boolean = false;
  @Input() selected: boolean = false;
  cardBgPath: string;
  constructor() { }

  ngOnInit(): void {
    if (this.wallet) {
      let walletId = this.wallet.id;
      let length = walletId.length;
      let subCard = walletId.substring(length - 4);
      let countCards = 5;
      let numCard = (parseInt(subCard, 16) % countCards) + 1;
      this.cardBgPath = `assets/images/card-backgrounds/${numCard}_card_bg.jpg`;
    }
  }

}
