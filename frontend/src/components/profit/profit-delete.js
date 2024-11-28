import { HttpUtils } from "../../utils/http-utils";

export class profitDelete {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    const url = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    
    this.deleteProfit().then();
  }

  async deleteProfit() {
    await HttpUtils.request("/categories/income/" + this.id, "DELETE", true);

    
  }
  
}
