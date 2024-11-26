import { Login } from "./components/auth/login";
import { Logout } from "./components/auth/logout";
import { SignUp } from "./components/auth/sign-up";
import { Dashboard } from "./components/dashboard";
import { Layout } from "./components/layout";
import { Profit } from "./components/profit/profit";
import { profitDelete } from "./components/profit/profit-delete";

export class Router {
  constructor() {
    this.titlePageElement = document.getElementById("page-title");
    this.contentPageElement = document.getElementById("content");
    this.indexStyleSheetElement = document.getElementById("index-stylesheet");

    this.initEvents();

    this.routes = [
      {
        route: "/",
        title: "Главная",
        filePathTemplate: "/templates/pages/dashboard.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Dashboard(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
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
          new Login(this.openNewRoute.bind(this));
        },
        styles: ["login.css"],
      },
      {
        route: "/sign-up",
        title: "Регистрация",
        filePathTemplate: "/templates/pages/auth/sign-up.html",
        useLayout: false,
        load: () => {
          new SignUp(this.openNewRoute.bind(this));
        },
        styles: ["login.css"],
      },
      {
        route: "/logout",
        load: () => {
          new Logout(this.openNewRoute.bind(this));
        }
      },
      {
        route: "/profit",
        title: "Доходы",
        filePathTemplate:
          "/templates/pages/profit/profit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Profit(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
          new profitDelete();
        },
      },
      {
        route: "/profit-expenses",
        title: "Доходы и расходы",
        filePathTemplate:
          "/templates/pages/profit-expenses/profit-expenses.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
      {
        route: "/profit-expenses-edit",
        title: "Редактирование дохода/расхода",
        filePathTemplate:
          "/templates/pages/profit-expenses/profit-expenses-edit.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
      {
        route: "/profit-expenses-create",
        title: "Создание дохода/расхода",
        filePathTemplate:
          "/templates/pages/profit-expenses/profit-expenses-create.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
      
      {
        route: "/profit-edit",
        title: "Редактирование категории доходов",
        filePathTemplate:
          "/templates/pages/profit/profit-edit.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
      {
        route: "/profit-create",
        title: "Создание категории доходов",
        filePathTemplate:
          "/templates/pages/profit/profit-create.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
      {
        route: "/expenses",
        title: "Расходы",
        filePathTemplate:
          "/templates/pages/expenses/expenses.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
      {
        route: "/expenses-edit",
        title: "Редактирование категории расходов",
        filePathTemplate:
          "/templates/pages/expenses/expenses-edit.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
      {
        route: "/expenses-create",
        title: "Создание категории расходов",
        filePathTemplate:
          "/templates/pages/expenses/expenses-create.html",
        useLayout: "/templates/layout.html",
        // load: () => {
        //   new Registration();
        // },
      },
    ];
  }

  initEvents() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    document.addEventListener("click", this.clickHandler.bind(this));
  }

  async openNewRoute(url) {
    const currentRoute = window.location.pathname;
    history.pushState({}, "", url);
    await this.activateRoute(null, currentRoute);
  }

  async clickHandler(e) {
    let element = null;
    if (e.target.nodeName === "A") {
      element = e.target;
    } else if (e.target.parentNode.nodeName === "A") {
      element = e.target.parentNode;
    }

    if (element) {
      e.preventDefault();
      const url = element.href.replace(window.location.origin, "");
      if (!url || url === "/#" || url.startsWith("javascript:void(0)")) {
        return;
      }
      await this.openNewRoute(url);
    }
  }

  async activateRoute(e, oldRoute = null) {
    if (oldRoute) {
      const currentRoute = this.routes.find((item) => item.route === oldRoute);
      if (currentRoute.styles && currentRoute.styles.length > 0) {
        currentRoute.styles.forEach((style) => {
          document.querySelector(`link[href='/css/${style}']`).remove();
        });
      }
    }
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => item.route === urlRoute);

    if (newRoute) {
      if (newRoute.styles && newRoute.styles.length > 0) {
        newRoute.styles.forEach((style) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "/css/" + style;
          document.head.insertBefore(link, this.indexStyleSheetElement);
        });
      }

      if (newRoute.title) {
        this.titlePageElement.innerText =
          newRoute.title + " | Lumincoin Finance";
      }

      if (newRoute.filePathTemplate) {
        let contentBlock = this.contentPageElement;
        if (newRoute.useLayout) {
          this.contentPageElement.innerHTML = await fetch(
            newRoute.useLayout
          ).then((response) => response.text());
          contentBlock = document.getElementById("content-layout");
        }
        contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(
          (response) => response.text()
        );
      }

      if (newRoute.load && typeof newRoute.load === "function") {
        newRoute.load();
      }
    } else {
      history.pushState({}, "", "/404");
      await this.activateRoute();
      console.log("No route found");
    }
  }
}
