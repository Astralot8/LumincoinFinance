export class SignUp {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.fullNameElement = document.getElementById("fullName");
    this.fullNameErrorElement = document.getElementById("fullName-error");
    this.emailElement = document.getElementById("email");
    this.emailErrorElement = document.getElementById("email-error");
    this.passwordElement = document.getElementById("password");
    this.passwordErrorElement = document.getElementById("password-error");
    this.repeatPasswordElement = document.getElementById("password-repeat");
    this.repeatPasswordErrorElement = document.getElementById(
      "password-repeat-error"
    );

    this.commonErrorElement = document.getElementById("common-error");

    document
      .getElementById("process-button")
      .addEventListener("click", this.signUp.bind(this));
  }

  validateForm() {
    let isValid = true;
    if (this.fullNameElement.value) {
      this.fullNameElement.classList.remove("is-invalid");
      this.fullNameErrorElement.classList.add("d-none");
    } else {
      this.fullNameElement.classList.add("is-invalid");
      this.fullNameErrorElement.classList.remove("d-none");
      isValid = false;
    }
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
    if (
      this.passwordElement.value &&
      this.passwordElement.value.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",/?]).{8,}$/
      )
    ) {
      this.passwordElement.classList.remove("is-invalid");
      this.passwordErrorElement.classList.add("d-none");
    } else {
      this.passwordElement.classList.add("is-invalid");
      this.passwordErrorElement.classList.remove("d-none");
      isValid = false;
    }
    if (
      this.repeatPasswordElement.value &&
      this.passwordElement.value === this.repeatPasswordElement.value
    ) {
      this.repeatPasswordElement.classList.remove("is-invalid");
      this.repeatPasswordErrorElement.classList.add("d-none");
    } else {
      this.repeatPasswordElement.classList.add("is-invalid");
      this.repeatPasswordErrorElement.classList.remove("d-none");
      isValid = false;
    }
    return isValid;
  }
  async signUp() {
    this.commonErrorElement.classList.add("d-none");
    if (this.validateForm()) {
      const fullNameArray = this.fullNameElement.value.split(" ");
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fullNameArray[1],
          lastName: fullNameArray[0],
          email: this.emailElement.value,
          password: this.passwordElement.value,
          passwordRepeat: this.repeatPasswordElement.value,
        }),
      });

      const result = await response.json();
      if (result.error) {
        this.commonErrorElement.innerText = result.message;
        this.commonErrorElement.classList.remove("d-none");
        return;
      }
      if (
        !result.user.id ||
        !result.user.email ||
        !result.user.name ||
        !result.user.lastName
      ) {
        this.commonErrorElement.classList.remove("d-none");
        return;
      }
      if (
        result.user.id ||
        result.user.email ||
        result.user.name ||
        result.user.lastName
      ) {
        const autoLogin = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: this.emailElement.value,
            password: this.passwordElement.value,
            rememberMe: true,
          }),
        });
        const resultLogin = await autoLogin.json();

        localStorage.setItem("accessToken", resultLogin.tokens.accessToken);
        localStorage.setItem("refreshToken", resultLogin.tokens.refreshToken);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: resultLogin.user.id,
            lastName: resultLogin.user.lastName,
            name: resultLogin.user.name,
          })
        );
      }

      this.openNewRoute("/");
    }
  }
}
