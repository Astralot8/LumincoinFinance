import { Chart } from "chart.js";

export class Dashboard {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    // const myChart = new Chart(ctx, {
    //   type: "line",
    //   data: data,
    //   options: {
    //     onClick: (e) => {
    //       const canvasPosition = getRelativePosition(e, myChart);

    //       // Substitute the appropriate scale IDs
    //       const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x);
    //       const dataY = myChart.scales.y.getValueForPixel(canvasPosition.y);
    //     },
    //   },
    // });
  }
}
