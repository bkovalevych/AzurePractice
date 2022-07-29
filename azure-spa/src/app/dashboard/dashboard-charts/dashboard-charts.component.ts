import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ChartTimeUnitValue } from 'src/app/core/models/values/chart-unit-value';
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
export class DashboardChartsComponent implements OnInit, OnChanges {
  @Input() selectedWallet: WalletValue;

  walletsLineCharts: any;
  walletsStackedCharts: any;
  walletsPieCharts: any;

  stackedOptions = { tooltips: {mode: 'index', intersect: false}, responsive: true, scales: { xAxes: { stacked: true, }, yAxes: { stacked: true }}};

  constructor(private walletService: WalletService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWallet'] || changes['selectedWallet'].currentValue) {
      let wallet : WalletValue = changes['selectedWallet'].currentValue;
      this.initCharts(wallet);
    }
  }

  ngOnInit(): void {
  }

  private getMode(mode: string) {
    switch(mode) {
      case 'month':
        let firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1)
        firstDayOfMonth.setHours(0);
        firstDayOfMonth.setMinutes(0);
        firstDayOfMonth.setSeconds(0);
        let days3 = 60 * 60 * 24 * 3;
        return {date: firstDayOfMonth, range: days3, dateFormat: 'YYYY/MM/d'};
      case 'day':
        let dayBefore = new Date();
        dayBefore.setHours(0);
        dayBefore.setMinutes(0);
        dayBefore.setSeconds(0);
        let hour = 60 * 60;
        return {date: dayBefore, range: hour, dateFormat: 'hh:mm'}
      default:
        let firstDayOfWeek = new Date();
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1)
        firstDayOfWeek.setHours(0);
        firstDayOfWeek.setMinutes(0);
        firstDayOfWeek.setSeconds(0);
        let day = 60 * 60 * 24;
        return {date: firstDayOfWeek, range: day, dateFormat: 'MM/d'};
    }
  }

  preparePieCharts = async (mode: string, walletIds: string[]) => {
    let { date } = this.getMode(mode);
    let charts = await firstValueFrom(
      this.walletService.getCharts(walletIds, date, new Date()));
    let composer = new PieChartComposer()
    if (!charts[0]) {
      return { tabHeader: mode};
    }

    let expenses = composer.compose(charts[0])
    return {
      tabHeader: mode,
      tabContent: [{chartHeader: "Expenses", chart: expenses}]
    };
  }
  prepareLineCharts = (mode: string, dateFormat: string, chart: ChartTimeUnitValue) => {
    if (!chart) {
      return {
        tabHeader: mode,
        tabContent: [
          {
            chartHeader: "Expenses"
          },
          {
            chartHeader: "Incomes"
          }
        ]
      }
    }
    let composer = new LineChartComposer();
    let expenses = composer.compose(chart.expenses, dateFormat);
    let incomes = composer.compose(chart.invoices, dateFormat);
    return {
      tabHeader: mode,
      tabContent: [
        {
          chartHeader: "Expenses",
          chart: expenses
        },
        {
          chartHeader: "Incomes",
          chart: incomes
        }
      ]
    };
  }

  prepareStackedCharts = (mode: string, dateFormat: string, chart: ChartTimeUnitValue) => {
    if (!chart) {
      return {
        tabHeader: mode,
        tabContent: [
          {
            chartHeader: "StackedBars"
          }
        ]
      }
    }
    let stackedComposer = new StackedBarChartComposer();
    let stackedComposerExpenses = stackedComposer.compose(chart.expenses, dateFormat);
    for (let data of stackedComposerExpenses.datasets) {
      data.data = data.data.map(it => -it);
    }
    let stackedComposerInvoices = stackedComposer.compose(chart.invoices, dateFormat);
    stackedComposerExpenses.datasets = [...stackedComposerInvoices.datasets, ...stackedComposerExpenses.datasets]
    return {
      tabHeader: mode,
      tabContent: [
        {
          chartHeader: "StackedBars",
          chart: stackedComposerExpenses
        }
      ]
    };
  }

  initCharts = (wallet: WalletValue) => {
    if (!wallet) {
      return;
    }
    let walletIds = [wallet.id];
    let modes = ["week", "day", "month"]
    Promise.all(modes.map(async (mode) => await this.preparePieCharts(mode, walletIds)))
    .then(value => {
      this.walletsPieCharts = value;
    });

    Promise.all(modes.map(async (mode) => {
      let { date, range, dateFormat } = this.getMode(mode);
      let charts = await firstValueFrom(
        this.walletService.getTimeCharts(walletIds, date, new Date(), range));
      return { mode, dateFormat, chart: charts[0]};
    })).then((value) => {
      this.walletsLineCharts = value.map(
        ({mode, chart, dateFormat}) => this.prepareLineCharts(mode, dateFormat, chart)
      );
      this.walletsStackedCharts = value.map(
        ({mode, chart, dateFormat}) => this.prepareStackedCharts(mode, dateFormat, chart)
      )
    })
  }
}
