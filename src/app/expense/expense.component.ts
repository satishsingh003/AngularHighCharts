import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { first, map, Observable } from 'rxjs';
import { ExpenseService } from '../expense.service';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  expenses: any = [];
  expensesCache: any;
  Highcharts: typeof Highcharts = Highcharts;
  HighchartsPie: typeof Highcharts = Highcharts;
  updateFlag = false;
  chart: any;
  chartConstructor = "chart";
  chartCallback: any;
  expenseData: any;
  expenseDataXAxis: any;
  constructor(private route: ActivatedRoute, private router: Router, private ExpenseService: ExpenseService) {
    const self = this;
    this.chartCallback = (chart: any) => {
       self.chart = chart;
    };
  }
  startdate: any;
  endDate: any;
  sumedUpDates: any = [];
  prices: any = [];
  chartOptions: Highcharts.Options = {
    series: [
      {
        name: 'Expense',
        data: [],
        type: 'column'
      }
    ],
    exporting: {
      enabled: true
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: "Expenses"
      },
      labels: {
        overflow: 'justify',
      },
    },
    chart: { type: 'column', height: 400 },
    title: { text: 'Expense Reporting' },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      },
      pie: {
        dataLabels: {
          formatter: function () {
            var sliceIndex = this.point.index;
            var sliceName = this.series.chart.axes[0].categories[sliceIndex];
            return sliceName
          }
        }
      }
    },
    xAxis: [
      {
        categories: [],
        title: {
          text: '',
        },
      },
    ]
  };


  isDateSumedUp(date: string) {
    return this.sumedUpDates.indexOf(date.substring(0, 11)) !== -1;
  }

  sumUpDate(date: any) {
    var sum = 0;
    this.expensesCache.forEach((element: any, key: any) => {
      if (element.date.S.substring(0, 11) === date.substring(0, 11)) {
        sum += parseInt(element.expense.N);
      }
    });
    this.sumedUpDates.push(date.substring(0, 11));
    this.prices.push(sum);
  }

  ngOnInit(): void {
    this.ExpenseService.getExpense().subscribe((res: any) => {
      this.expenses = res.Items;
      this.expensesCache = res.Items;
      this.expenseData = [];
      this.expenseDataXAxis = [];
    
      this.updateChart()
    });
  }

  updateChart() {
    this.prices=[];
    this.sumedUpDates=[];
    this.expenses.forEach((element: any, key: any) => {
      this.expenseData.push({ "y": parseInt(element.expense.N) });
      this.expenseDataXAxis.push(element.expenseType.S)
      if (!this.isDateSumedUp(element.date.S)) {
        this.sumUpDate(element.date.S);
      }
    });
    const self = this,
      chart = this.chart;
    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();
      self.chartOptions.series = [
        {
          data: this.prices,
          type: 'column',

        }
      ];
      self.chartOptions.xAxis = [
        {
          categories: this.sumedUpDates
        }
      ];
      self.updateFlag = true;

    }, 2000);
  }

  changeFirstInput(e: any) {
    this.expenses = this.expensesCache;
    this.startdate = new Date(e.target.value);
    this.updateList();
  }
  changeSecondInput(e: any) {
    this.expenses = this.expensesCache;
    this.endDate = new Date(e.target.value);
    this.updateList();
  }
  updateList() {
    const result = this.expenses.filter((expense: any) => {
      let dateFormat = this.ExpenseService.formatDateReverse(expense.date.S);
      let dateS = new Date(dateFormat);
      return (this.startdate <= dateS && this.endDate >= dateS)
    }
    );
    this.expenses = result;
    this.updateChart();
  }
  deleteExpense(id: string) {
    const user = this.expenses.find((x: any) => x.expenseId.N === id);
    if (!user) return;
    user.isDeleting = true;
    this.ExpenseService.deleteExpense(id)
      .pipe(first())
      .subscribe(() => {
        this.expenses = this.expenses.filter((x: any) => x.expenseId.N !== id)
        this.updateList();
      });
  }
  showPie(event: any) {
    const self = this,
      chart = this.chart;
    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();
      self.chartOptions.series = [
        {
          data: this.prices,
          type: 'pie',

        }
      ];
      self.chartOptions.xAxis = [
        {
          categories: this.expenseDataXAxis
        }
      ];
      self.updateFlag = true;

    }, 2000);
  }
}
