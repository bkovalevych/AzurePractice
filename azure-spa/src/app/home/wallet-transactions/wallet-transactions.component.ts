import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getTopics, TopicValue } from 'src/app/core/models/values/topic-value';
import { TransactionValue } from 'src/app/core/models/values/transaction-value';
import { WalletValue } from 'src/app/core/models/values/wallet-value';

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  styleUrls: ['./wallet-transactions.component.scss']
})
export class WalletTransactionsComponent implements OnInit, OnChanges {
  @Input() header: string;
  @Input() typeTransaction: string;
  @Input() transactions: TransactionValue[];
  @Input() wallets: { [key: string]: WalletValue };
  allTopics: { [key: string]: TopicValue } = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions'].currentValue) {
      this.transactions = changes['transactions'].currentValue
      .filter(it => it.type == this.typeTransaction)
    }
  }

  ngOnInit(): void {
    for(let topic of getTopics()) {
     this.allTopics[topic.name] = topic
    }
  }

  topicByName = (name:string) : TopicValue => {
    let topicsSrc = {
      clothes: "assets/images/topics/clothes.png",
      education: "assets/images/topics/education.png",
      entertainment: "assets/images/topics/entertainment.png",
      food: "assets/images/topics/food.png",
      transport: "assets/images/topics/transport.png"
    }

    let topicSrc = topicsSrc[name];
    let topic: TopicValue = { name: name, iconSrc: topicSrc}
    return topic
  }
}
