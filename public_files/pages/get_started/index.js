class SignupForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.fetchPredmeti();

        //za login profesora
        this.redirectUrl = "/pages/profesor/index.html";
    }

    async fetchPredmeti() {
        let response = await fetch('/api/predmeti');
        this.predmeti = await response.json();
        this.render()
    }

    renderPredmet(predmet){
        let predmetiTemplate=`<div class="group">
            <input type="checkbox" id="subject${predmet.id}" name="subject${predmet.id}">
            <label for="subject${predmet.id}">${predmet.naziv}</label>
        </div>`;
        return predmetiTemplate
    }
    render() {
        let predmetiTemplate = '';
        for(let i of this.predmeti){
            predmetiTemplate=predmetiTemplate+this.renderPredmet(i);
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
                <input type="text" id="firstName" name="firstName" required>

                <label for="lastName">Prezime:</label>
                <input type="text" id="lastName" name="lastName" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>

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
                <input type="password" id="password" name="password" required>

                <label for="confirmPassword">Potvrdite lozinku:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required>

                <button type="submit">Registriraj se</button>
            </form>
            <!-- Student Login forma-->
            <form id="studentLoginForm" style="display: none;">
                <h1>Log In</h1>
                <label for="loginEmail">Email:</label>
                <input type="email" id="loginEmail" name="loginEmail" required>

                <label for="loginPassword">Lozinka:</label>
                <input type="password" id="loginPassword" name="loginPassword" required>

                <button type="submit">Prijavi se</button>
            </form>
            <!-- Profesor Login forma -->
            <form id="loginForm" style="display: none;">
                <h1> Log In </h1>
                <label for="loginEmail">Email:</label>
                <input type="email" id="loginEmail" name="loginEmail" required>

                <label for="loginPassword">Lozinka:</label>
                <input type="password" id="loginPassword" name="loginPassword" required>

                <button type="submit">Prijavi se</button>
            </form>
            <div id="successMessageSignup" style="color: green; margin-top: 10px; display: none;">
                Uspješno ste se registrirali!
            </div>
            <div id="successMessageLogin" style="color: green; margin-top: 10px; display: none;">
                Uspješno ste se prijavili!
            </div>
        `;

        this.shadowRoot.getElementById('professorButton').addEventListener('click', this.showLoginForm.bind(this));
        this.shadowRoot.getElementById('studentButton').addEventListener('click', this.showSignupForm.bind(this));
        this.shadowRoot.getElementById('signupForm').addEventListener('submit', this.handleSignup.bind(this));
        this.shadowRoot.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        this.shadowRoot.getElementById('studentButton').addEventListener('click', this.showStudentLoginForm.bind(this));
    }

    showSignupForm() {
        this.shadowRoot.getElementById('signupForm').style.display = 'block';
        this.shadowRoot.getElementById('loginForm').style.display = 'none';
    }

    showLoginForm() {
        console.log('Showing professor login form');
        this.shadowRoot.getElementById('loginForm').style.display = 'block';
        this.shadowRoot.getElementById('signupForm').style.display = 'none';
    }
    
    showStudentLoginForm() {
        console.log('Showing student login form');
        this.shadowRoot.getElementById('studentLoginForm').style.display = 'block';
        this.shadowRoot.getElementById('loginForm').style.display = 'none';
    }
    

    handleLogin(event) {
        event.preventDefault();

        const profesoriRouter = require('/api/profesori');
        app.use('/api/profesori', profesoriRouter);
    
        const loginEmail = this.shadowRoot.getElementById('loginEmail').value;
        const loginPassword = this.shadowRoot.getElementById('loginPassword').value;
    
        const mockUser = {
            email: 'ime.prezime@example.com',
            password: 'nekaLozinka',
            ime: 'Ime'
        };
    
        if (loginEmail === mockUser.email && loginPassword === mockUser.password) {
            console.log('Preusmjeravam korisnika na:', this.redirectUrl);
            window.location.href = this.redirectUrl;
        } else {
            console.error('Pogrešni korisnički podaci');
        }
    } 

    handleStudentLogin(event) {
        event.preventDefault();

        const studentiRouter = require('/api/studenti');
        app.use('/api/studenti', studentiRouter);

        const loginEmail = this.shadowRoot.getElementById('loginEmail').value;
        const loginPassword = this.shadowRoot.getElementById('loginPassword').value;

        const mockUser = {
            email: 'ime.prezime@example.com',
            password: 'nekaLozinka',
            ime: 'Ime'
        };

        if (loginEmail === mockUser.email && loginPassword === mockUser.password) {
            console.log('Preusmjeravam studenta na:', this.redirectUrl);
            window.location.href = this.redirectUrl;
        }else {
            console.error('Pogrešni korisnički podaci');
        }
    }
    
    handleSignup(event) {
        event.preventDefault();

        const firstName = this.shadowRoot.getElementById('firstName').value;
        const lastName = this.shadowRoot.getElementById('lastName').value;
        const mail = this.shadowRoot.getElementById('email').value;
        const password = this.shadowRoot.getElementById('password').value;
        const confirmPassword = this.shadowRoot.getElementById('confirmPassword').value;

        const selectedSubjects = [];
        const checkboxes = this.shadowRoot.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            selectedSubjects.push(checkbox.labels[0].innerText);
        });

        console.log('Podaci forme:');
        console.log('Ime:', firstName);
        console.log('Prezime:', lastName);
        console.log('Email:', mail);
        console.log('Predmeti:', selectedSubjects.join(', '));
        console.log('Lozinka:', password);
        console.log('Potvrda lozinke:', confirmPassword);

        const data = {
            ime: firstName,
            prezime: lastName,
            mail: mail,
            predmeti: selectedSubjects,
            lozinka: password
        };

        console.log('Data object to be sent to the server:', data);

        this.saveDataToDatabase('/api/studenti', data);
    }

    async saveDataToDatabase(apiEndpoint, data) {
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
            } else {
                console.error('Greška prilikom pohrane podataka:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Greška prilikom izvršavanja fetch zahtjeva:', error);
        }
    }

}

customElements.define('signup-form', SignupForm);
