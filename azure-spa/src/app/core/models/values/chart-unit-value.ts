export class ChartUnitValue {
  walletId: string;
  expenses: {
      labels: string[],
      datasets: {label: string; data: number[]}[]
  }
}

export class Dataset {
  label: string;
  data: number[]
}

export class DataSetContainer {
  labels: number[];
  datasets: Dataset[]
}


export class ChartTimeUnitValue {
  walletId: string;
  expenses: DataSetContainer;
  invoices: DataSetContainer;
}

export class PieDataSet {
  data: number[];
  backgroundColor?: string[];
  hoverBackgroundColor?: string[];
}

export class LineDataSet {
  label: string;
  data: number[];
  fill?: boolean = false;
  borderColor?: string;
  tension: number = .4;
}

export class StackedBarDataSet {
  type: string = 'bar';
  label: string;
  backgroundColor?: string;
  data: number[];
}
