export class Login {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.emailElement = document.getElementById("email");
    this.emailErrorElement = document.getElementById("email-error");
    this.passwordElement = document.getElementById("password");
    this.passwordErrorElement = document.getElementById("password-error");
    this.rememberMeElement = document.getElementById("remember-me");
    this.commonErrorElement = document.getElementById("common-error");

    document.getElementById("process-button").addEventListener("click", this.login.bind(this));
  }

  validateForm() {
    let isValid = true;
    if (
      this.emailElement.value &&
      this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      this.emailElement.classList.remove("is-invalid");
      this.emailErrorElement.classList.add("d-none");
    } else {
      this.emailElement.classList.add("is-invalid");
      this.emailErrorElement.classList.remove("d-none");
      isValid = false;
    }
    if (this.passwordElement.value) {
      this.passwordElement.classList.remove("is-invalid");
      this.passwordErrorElement.classList.add("d-none");
    } else {
      this.passwordElement.classList.add("is-invalid");
      this.passwordErrorElement.classList.remove("d-none");
      isValid = false;
    }
    return isValid;
  }

  async login() {
    this.commonErrorElement.classList.add("d-none");
    if (this.validateForm()) {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: this.emailElement.value,
          password: this.passwordElement.value,
          rememberMe: this.rememberMeElement.checked,
        }),
      });

      const result = await response.json();
      if(result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.id || !result.user.lastName || !result.user.name){
        this.commonErrorElement.classList.remove("d-none");
        return;
      }
      
      localStorage.setItem('accessToken', result.tokens.accessToken);
      localStorage.setItem('refreshToken', result.tokens.refreshToken);
      localStorage.setItem('userInfo', JSON.stringify({id: result.user.id, lastName: result.user.lastName, name: result.user.name}));
      
      this.openNewRoute('/');
      
    }
  }
}
