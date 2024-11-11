import { Login } from "./components/auth/login";
import { Registration } from "./components/auth/registration";
import { Dashboard } from "./components/dashboard";

export class Router {
  constructor() {
    this.titlePageElement = document.getElementById("page-title");
    this.contentPageElement = document.getElementById("content");
    

    this.initEvents();
    

    this.routes = [
      {
        route: "/",
        title: "Главная",
        filePathTemplate: "/templates/pages/dashboard.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Dashboard();
        },
      },
      {
        route: "/404",
        title: "Страница не найдена",
        filePathTemplate: "/templates/pages/404.html",
        useLayout: false,
      },
      {
        route: "/login",
        title: "Вход в систему",
        filePathTemplate: "/templates/pages/auth/login.html",
        useLayout: false,
        load: () => {
          new Login();
        },
      },
      {
        route: "/registration",
        title: "Регистрация",
        filePathTemplate: "/templates/pages/auth/registration.html",
        useLayout: false,
        load: () => {
          new Registration();
        },
      },
      {
        route: "/profit-expenses",
        title: "доходы и расходы",
        filePathTemplate: "/templates/pages/profit-expenses/profit-expenses.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
    ];
  }

  initEvents(){
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
  }

  async activateRoute() {
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find(item => item.route === urlRoute);

    if(newRoute){

        if(newRoute.title) {
            this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance'
        }

        if(newRoute.filePathTemplate){
          let contentBlock = this.contentPageElement;
          if(newRoute.useLayout){
            this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
            contentBlock = document.getElementById("content-layout");
          } 
          contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());     
        }

        if(newRoute.load && typeof newRoute.load === 'function'){
            newRoute.load();
        }

    } else {
        window.location = "/404";
        console.log("No route found");
    }
  }
}
