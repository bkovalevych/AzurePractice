import { ChartUnitValue, PieDataSet } from "src/app/core/models/values/chart-unit-value";
import { randomColor } from "./color-helper";

export class PieChartComposer {
  compose(chartUnit: ChartUnitValue) {
    let datasets = chartUnit.expenses.datasets.map<PieDataSet>(dataset =>
      ({
        data: dataset.data,
        backgroundColor: dataset.data.map(_ => randomColor())
      }));
    return {labels: chartUnit.expenses.labels, datasets: datasets};
  }
}
