import { DataSetContainer, StackedBarDataSet } from "src/app/core/models/values/chart-unit-value";
import * as moment from 'moment';
import { randomColor } from "./color-helper";

export class StackedBarChartComposer {
  compose(chartUnit: DataSetContainer, dateFormat: string = 'YYYY/MM/d') {
    let datasets = chartUnit.datasets.map<StackedBarDataSet>(unit => ({
      label: unit.label,
      data: unit.data,
      type: 'bar',
      backgroundColor: randomColor()
    }))
    let labels = chartUnit.labels.map<string>(label => moment(new Date(label * 1000)).format(dateFormat))
    return {labels, datasets};
  }
}
