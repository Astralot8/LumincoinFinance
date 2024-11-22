import { HttpUtils } from "../../utils/http-utils";

export class Profit{
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;
        this.getProfit().then();
    }

    async getProfit(){
        const result = await HttpUtils.request('/categories/income', 'GET', true);
        if(result.redirect) {
            return this.openNewRoute(result.redirect);
        }
          
          if(result.error || !result.response || (result.response && result.response.error)){
            return alert('Возникла ошибка при запросе доходов. Обратитесь в поддержку.');
          };

          this.showRecords(result.response);

    }

    showRecords(profitArray){
        console.log(profitArray);

        
    }


}