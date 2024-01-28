class SignupForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.fetchPredmeti();

    //za login profesora
    this.redirectUrl = "/pages/profesor/index.html";
  }

  async fetchPredmeti() {
    let response = await fetch("/api/predmeti");
    this.predmeti = await response.json();
    this.render();
  }

  renderPredmet(predmet) {
    let predmetiTemplate = `<div class="group">
            <input type="checkbox" id="subject${predmet.id}" name="subject" value="${predmet.id}">
            <label for="subject${predmet.id}">${predmet.naziv}</label>
        </div>`;
    return predmetiTemplate;
  }
  render() {
    let predmetiTemplate = "";
    for (let i of this.predmeti) {
      predmetiTemplate = predmetiTemplate + this.renderPredmet(i);
    }
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 300px;
                    margin: 20px auto;
                }

                form {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    margin-bottom: 12px;
                    align-items: left;
                    display: block;
                }

                input {
                    margin-bottom: 16px;
                }
                .group{
                    display: flex;
                    flex-direction: row;
                    gap:1em;
                }
            </style>
            <button id="professorButton">Nastavi kao profesor</button>
            <button id="studentButton">Nastavi kao student</button>
            <!-- Student Signup forma-->
            <form id="signupForm" style="display: none;">
                <h1>Sign Up</h1>

                <label for="firstName">Ime:</label>
                <input type="text" id="firstName" name="ime" required>

                <label for="lastName">Prezime:</label>
                <input type="text" id="lastName" name="prezime" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="mail" required>

                <label>Predmeti koje upisujete:</label>
                ${predmetiTemplate}
                <!--
                <div class="group">
                    <input type="checkbox" id="subject1" name="subject1">
                    <label for="subject1">Predmet 1</label>
                </div>
                <div class="group">
                    <input type="checkbox" id="subject2" name="subject2">
                    <label for="subject2">Predmet 2</label>
                </div>
                <div class="group">
                    <input type="checkbox" id="subject3" name="subject3">
                    <label for="subject3">Predmet 3</label>
                </div>  -->
                <label for="password">Lozinka:</label>
                <input type="password" id="password" name="lozinka" required>

                <label for="confirmPassword">Potvrdite lozinku:</label>
                <input type="password" id="confirmPassword" name="ponovljenaLozinka" required>

                <button type="submit">Registriraj se</button>
            </form>
            <!-- Student Login forma-->
            <form id="studentLoginForm" style="display: none;">
                <h1>Log In</h1>
                <label for="stud_loginEmail">Email:</label>
                <input type="email" id="stud_loginEmail" name="email" required>

                <label for="stud_loginPassword">Lozinka:</label>
                <input type="password" id="stud_loginPassword" name="password" required>

                <input type="hidden" name="type" value="student">

                <button type="submit">Prijavi se</button>
            </form>
            <!-- Profesor Login forma -->
            <form id="loginForm" style="display: none;">
                <h1> Log In </h1>
                <label for="prof_loginEmail">Email:</label>
                <input type="email" id="prof_loginEmail" name="email" required>

                <label for="prof_loginPassword">Lozinka:</label>
                <input type="password" id="prof_loginPassword" name="password" required>

                <input type="hidden" name="type" value="profesor">

                <button type="submit">Prijavi se</button>
            </form>
            <div id="successMessageSignup" style="color: green; margin-top: 10px; display: none;">
                Uspješno ste se registrirali!
            </div>
            <div id="successMessageLogin" style="color: green; margin-top: 10px; display: none;">
                Uspješno ste se prijavili!
            </div>
        `;

    this.shadowRoot
      .getElementById("professorButton")
      .addEventListener("click", this.showLoginForm.bind(this));
    this.shadowRoot
      .getElementById("studentButton")
      .addEventListener("click", this.showSignupForm.bind(this));
    this.shadowRoot
      .getElementById("signupForm")
      .addEventListener("submit", this.handleSignup.bind(this));
    this.shadowRoot
      .getElementById("loginForm")
      .addEventListener("submit", this.handleLogin.bind(this));
    this.shadowRoot
      .getElementById("studentLoginForm")
      .addEventListener("submit", this.handleLogin.bind(this));
    this.shadowRoot
      .getElementById("studentButton")
      .addEventListener("click", this.showStudentLoginForm.bind(this));
  }

  showSignupForm() {
    this.shadowRoot.getElementById("signupForm").style.display = "block";
    this.shadowRoot.getElementById("loginForm").style.display = "none";
  }

  showLoginForm() {
    console.log("Showing professor login form");
    this.shadowRoot.getElementById("loginForm").style.display = "block";
    this.shadowRoot.getElementById("signupForm").style.display = "none";
  }

  showStudentLoginForm() {
    console.log("Showing student login form");
    this.shadowRoot.getElementById("studentLoginForm").style.display = "block";
    this.shadowRoot.getElementById("loginForm").style.display = "none";
  }

  async handleLogin(event) {
    event.preventDefault();

    const $form = event.target;
    const formData = new FormData($form);
    const formDataObj = Object.fromEntries(formData.entries());

    console.log(formDataObj);

    switch (formData.get("type")) {
      case "profesor": {
        const resp = await this.apiPost("/api/profesori/login", formDataObj);

        if (!resp) {
          return alert("Nešto je pošlo po krivu. Molimo probajte ponovno.");
        }

        if (!resp.success) {
          switch (resp.error) {
            case "invalid_credentials": {
              return alert(
                "Nevaljani email ili password. Molimo probajte ponovno"
              );
            }
          }

          return alert(
            `Dogodila se greška: ${resp.error}. Molimo probajte ponovno`
          );
        }

        window.location = "/profesor/dashboard";

        break;
      }

      case "student": {
        const resp = await this.apiPost("/api/studenti/login", formDataObj);

        if (!resp) {
          return alert("Nešto je pošlo po krivu. Molimo probajte ponovno.");
        }

        if (!resp.success) {
          switch (resp.error) {
            case "invalid_credentials": {
              return alert(
                "Nevaljani email ili password. Molimo probajte ponovno"
              );
            }
          }

          return alert(
            `Dogodila se greška: ${resp.error}. Molimo probajte ponovno`
          );
        }

        window.location = "/student/dashboard";

        break;
      }
    }
  }

  async handleSignup(event) {
    event.preventDefault();

    const $form = event.target;
    const formData = new FormData($form);
    const formDataObj = {
      ...Object.fromEntries(formData.entries()),
      subject: formData.getAll("subject"),
    };

    console.log("Data object to be sent to the server:", formDataObj);

    const resp = await this.apiPost("/api/studenti", formDataObj);

    if (!resp) {
      return alert("Nešto je pošlo po krivu. Molimo probajte ponovno.");
    }

    if (resp.error) {
      return alert(
        `Dogodila se greška: ${resp.error}. Molimo probajte ponovno`
      );
    }

    console.log(resp);
  }

  async apiPost(url, data) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);

        return null;
      });
  }

  async saveDataToDatabase(apiEndpoint, data) {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
      } else {
        console.error(
          "Greška prilikom pohrane podataka:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Greška prilikom izvršavanja fetch zahtjeva:", error);
    }
  }
}

customElements.define("signup-form", SignupForm);
