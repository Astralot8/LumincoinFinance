import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";

export class Layout {
  constructor(openNewRoute) {
    this.balanceElement = document.getElementById("balance");
    this.modalSheet = document.getElementById("modalSheet");
    this.newBalanceValue = document.getElementById("newBalanceValue");
    this.saveBalanceButton = document.getElementById("save-button");
    this.cancelButton = document.getElementById("cancel-button");
    this.balanceValue = null;
    this.userName = document.getElementById("userName");

    this.openNewRoute = openNewRoute;
    this.watchUserName();
    this.watchBalance();
    

    document
      .getElementById("balance-button")
      .addEventListener("click", this.changeBalance.bind(this));
  }

  async watchBalance() {
    const result = await HttpUtils.request("/balance", "GET", true);
    if (result.redirect) {
      return this.openNewRoute(result.redirect);
    }
    if (result || !result.error) {
      this.balanceElement.innerText = result.response.balance + "$";
      this.balanceValue = result.response.balance;
      
    } else {
      this.balanceElement.innerText = "Ошибка запроса баланса";
    }
  }

  watchUserName(){
      const userInfo = JSON.parse(AuthUtils.getAuthInfo("userInfo"));
    
      if(userInfo){
        this.userName.innerText = userInfo.name + " " + userInfo.lastName;
      }
      
  }

  async changeBalance() {
    this.modalSheet.style.display = "flex";
    this.newBalanceValue.value = this.balanceValue;
    this.saveBalanceButton.addEventListener(
      "click",
      this.saveBalance.bind(this)
    );
    this.cancelButton.addEventListener("click", () => {
      this.modalSheet.style.display = "none";
    });
  }

  async saveBalance() {
    let balanceValue = this.newBalanceValue.value;
    if (balanceValue && balanceValue >= 0) {
      const result = await HttpUtils.request("/balance", "PUT", true, {
        newBalance: balanceValue,
      });
      if (result || !result.error) {
        this.balanceElement.innerText = result.response.balance + "$";
        this.modalSheet.style.display = "none";
        this.balanceValue = result.response.balance;
        return;
      } else {
        this.balanceElement.innerText = "Ошибка при изменении баланса";
        return;
      }
    } else {
      alert(
        "Баланс должен быть заполнен, укажите корректное значение баланса - равен или больше 0! "
      );
      return;
    }
  }
}
