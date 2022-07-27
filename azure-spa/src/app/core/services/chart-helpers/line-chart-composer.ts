import { DataSetContainer, LineDataSet } from "src/app/core/models/values/chart-unit-value";
import { randomColor } from "./color-helper";
import * as moment from 'moment';

export class LineChartComposer {

  compose(chartUnit: DataSetContainer, dateFormat: string = 'YYYY/MM/d') {
    let datasets = chartUnit.datasets.map<LineDataSet>(unit => ({
      label: unit.label,
      data: unit.data,
      fill: false,
      tension: .4,
      borderColor: randomColor()
    }));
    let labels = chartUnit.labels.map<string>(label => moment(new Date(label * 1000)).format(dateFormat))
    return {labels, datasets};
  }
}

