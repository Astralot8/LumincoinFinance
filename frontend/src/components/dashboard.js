import { DateUtils } from "../utils/date-utils";
import { HttpUtils } from "../utils/http-utils";

import { Chart } from "chart.js/auto";

export class Dashboard {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.init();
  }

  init() {
    this.findElement();
    this.todayFilterButton.classList.add("active");
    this.getProfitExpenses();
    this.watchActiveButton(this.filterButtonsArray);
  }

  watchActiveButton(buttonsArray) {
    for (let i = 0; i < buttonsArray.length; i++) {
      buttonsArray[i].addEventListener("click", (e) => {
        if (buttonsArray[i].id === "today-filter") {
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses();
        }
        if (buttonsArray[i].id === "week-filter") {
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateWeek);
        }
        if (buttonsArray[i].id === "month-filter") {
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateMonth);
        }
        if (buttonsArray[i].id === "year-filter") {
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateYear);
        }
        if (buttonsArray[i].id === "all-filter") {
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateOld, DateUtils.dateNew);
        }
        if (buttonsArray[i].id === "interval-filter") {
          this.intervalPopUp.style.display = "flex";
          this.setInterval();
          this.chooseButton.addEventListener("click", (e) => {
            this.intervalPopUp.style.display = "none";

            buttonsArray[i].classList.add("active");
            this.getProfitExpenses(this.startDay, this.endDay);
          });
          this.closeButton.addEventListener("click", () => {
            this.intervalPopUp.style.display = "none";
          });
        }
      });
    }
  }

  setInterval() {
    this.startDateInput.addEventListener("change", () => {
      this.startDateText.innerText = new Date(
        this.startDateInput.value
      ).toLocaleDateString();
      this.startDay = this.startDateInput.value;
    });
    this.endDateInput.addEventListener("change", () => {
      this.endDateText.innerText = new Date(
        this.endDateInput.value
      ).toLocaleDateString();
      this.endDay = this.endDateInput.value;
    });
  }

  findElement() {
    this.recordsElement = document.getElementById("records");
    this.popUpElement = document.getElementById("deleteOperation");

    this.confirmButton = document.getElementById("confirm-button");
    this.canceledButton = document.getElementById("canceled-button");

    this.todayFilterButton = document.getElementById("today-filter");
    this.weekFilterButton = document.getElementById("week-filter");
    this.monthFilterButton = document.getElementById("month-filter");
    this.yearFilterButton = document.getElementById("year-filter");
    this.allFilterButton = document.getElementById("all-filter");
    this.intervalFilterButton = document.getElementById("interval-filter");

    this.intervalPopUp = document.getElementById("set-interval");
    this.chooseButton = document.getElementById("choose-button");
    this.closeButton = document.getElementById("close-button");

    this.startDateInput = document.getElementById("startDate");
    this.endDateInput = document.getElementById("endDate");

    this.startDay = null;
    this.endDay = null;

    this.startDateText = document.getElementById("startDateText");
    this.endDateText = document.getElementById("endDateText");

    this.filterButtonsArray = [
      this.todayFilterButton,
      this.weekFilterButton,
      this.monthFilterButton,
      this.yearFilterButton,
      this.allFilterButton,
      this.intervalFilterButton,
    ];

    this.incomeChartElement = document.getElementById("income");
    this.expenseChartElement = document.getElementById("expense");
    this.incomeChart = null;


    this.incomeValueArray = [];
    this.incomeLabelArray = [];
    this.expenseValueArray = [];
    this.expenseLabelArray = [];
  }

  async getProfitExpenses(dateFrom, dateTo) {
    let result = null;
    if (dateFrom && dateTo) {
      result = await HttpUtils.request(
        "/operations?period=interval&dateFrom=" +
          dateFrom +
          "&dateTo=" +
          dateTo,
        "GET",
        true
      );
      if (result.redirect) {
        return this.openNewRoute(result.redirect);
      }

      if (
        result.error ||
        !result.response ||
        (result.response && result.response.error)
      ) {
        return alert(
          "Возникла ошибка при запросе операций. Обратитесь в поддержку."
        );
      }
    } else {
      result = await HttpUtils.request("/operations", "GET", true);
      if (result.redirect) {
        return this.openNewRoute(result.redirect);
      }

      if (
        result.error ||
        !result.response ||
        (result.response && result.response.error)
      ) {
        return alert(
          "Возникла ошибка при запросе операций. Обратитесь в поддержку."
        );
      }
    }
    console.log(result.response)
    result.response.forEach(element => {
      if(element.type === "income"){
        this.incomeValueArray.push(element.amount);
        this.incomeLabelArray.push(element.category);
      }
    });

    
    this.initChartPie(this.incomeLabelArray, this.incomeValueArray)
  }
  initChartPie(lableData, valueData) {
    const languagesData = {
      labels: lableData,
      datasets: [
        {
          data: valueData,
          backgroundColor: [
            "#DC3545",
            "#FD7E14",
            "#FFC107",
            "#20C997",
            "#0D6EFD",
          ],
        },
      ],
    };
    const config = {
      type: "pie",
      data: languagesData,
    };
   
    
    this.incomeChart = new Chart(this.incomeChartElement, config);
    
  }
}
