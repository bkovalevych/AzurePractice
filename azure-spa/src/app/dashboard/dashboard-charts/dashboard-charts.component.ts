import { Component, OnInit } from '@angular/core';
import { WalletValue } from 'src/app/core/models/values/wallet-value';
import { WalletService } from 'src/app/core/services/api/wallet.service';
import { LineChartComposer } from 'src/app/core/services/chart-helpers/line-chart-composer';
import { PieChartComposer } from 'src/app/core/services/chart-helpers/pie-chart-composer';
import { StackedBarChartComposer } from 'src/app/core/services/chart-helpers/stacked-bar-chart-composer';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.scss']
})
export class DashboardChartsComponent implements OnInit {
  walletsLineCharts: any;
  walletsStackedCharts: any;
  walletsPieCharts: any;

  stackedOptions = { tooltips: {mode: 'index', intersect: false}, responsive: true, scales: { xAxes: { stacked: true, }, yAxes: { stacked: true }}};

  constructor(private walletService: WalletService) { }

  ngOnInit(): void {
    this.walletService.getWallets().subscribe( wallets => {
      this.initTimeCharts(wallets);
    });
  }
  initTimeCharts = (wallets: WalletValue[]) => {
    let walletIds = wallets.map<string>(it => it.id);
    let day7Before = new Date();
    day7Before.setDate(day7Before.getDate() - 7)
    day7Before.setHours(0);
    day7Before.setMinutes(0);
    this.walletService.getCharts(walletIds, day7Before, new Date())
    .subscribe(charts => {
      this.walletsPieCharts = charts.map(unit => {
        let composer = new PieChartComposer()
        let expenses = composer.compose(unit)
        return {
          tabHeader: wallets.find(it => it.id == unit.walletId).name,
          tabContent: [{chartHeader: "Expenses", chart: expenses}]
        };
      })
    })

    this.walletService.getTimeCharts(walletIds, day7Before, new Date(), 60 * 60 * 24)
    .subscribe(charts => {
      this.walletsLineCharts = charts.map(unit => {
        let composer = new LineChartComposer();
        let expenses = composer.compose(unit.expenses);
        let invoices = composer.compose(unit.invoices);
        return {
          tabHeader: wallets.find(it => it.id == unit.walletId).name,
          tabContent: [
            {
              chartHeader: "Expenses",
              chart: expenses
            },
            {
              chartHeader: "Invoices",
              chart: invoices
            }
          ]
        };
      })

      this.walletsStackedCharts = charts.map(unit => {
        let composer = new StackedBarChartComposer();
        let expenses = composer.compose(unit.expenses);
        for (let data of expenses.datasets) {
          data.data = data.data.map(it => -it);
        }
        let invoices = composer.compose(unit.invoices);
        expenses.datasets = [...invoices.datasets, ...expenses.datasets]
        return {
          tabHeader: wallets.find(it => it.id == unit.walletId).name,
          tabContent: [
            {
              chartHeader: "StackedBars",
              chart: expenses
            }
          ]
        };
      })
    })
  }
}
