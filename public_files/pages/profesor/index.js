class StudentiComponent extends HTMLElement {
    constructor() {
        super();

        // Shadow DOM
        this.attachShadow({ mode: 'open' });
        this.fetchStudenti();
        // this.fetchZadace();
        
    }

    async fetchStudenti() {
        let response = await fetch('/api/studenti');
        this.studenti = await response.json();
        this.render()
    }

    // async fetchZadace() {
    //     let response = await fetch('/api/zadace');
    //     this.zadace = await response.json();
    //     this.render()
    // }

    setupEventListeners() {
        const dodajStudentaBtn = this.shadowRoot.querySelector("#dodajStudentaBtn");
        // const dodajZadacuBtn = this.shadowRoot.querySelector("#dodajZadacuBtn");

        dodajStudentaBtn.addEventListener("click", this.dodajStudenta.bind(this));
        // dodajZadacuBtn.addEventListener("click", this.dodajZadacu.bind(this));
    }

    connectedCallback() {
        this.prikaziStudente();
        // this.prikaziZadace();

        this.shadowRoot.querySelector('#dodajStudentaBtn').addEventListener('click', this.dodajStudentaForma.bind(this));
        // this.shadowRoot.querySelector('#dodajZadacuBtn').addEventListener('click', this.dodajZadacuForma.bind(this));
    }

    async prikaziStudente() {
        try {
            const response = await fetch('/api/studenti');
    
            if (!response.ok) {
                console.error('Greška prilikom dohvaćanja studenata:', response.status, response.statusText);
                return;
            }
    
            console.log(response);
    
            const studenti = await response.json();
    
            const tbody = this.shadowRoot.querySelector('tbody');
    
            // Očisti trenutni sadržaj tablice
            tbody.innerHTML = '';
    
            // Popuni tablicu s podacima o studentima
            studenti.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.ime}</td>
                    <td>${student.prezime}</td>
                    <td>${student.mail}</td>
                    <td>
                        <img class="izbrisiBtn" data-id="${student.id}" src="/img/trash.png" alt="Delete">
                    </td>
                `;
                tbody.appendChild(tr);
    
                // Add event listener for the newly created izbrisiBtn
                const izbrisiBtn = tr.querySelector('.izbrisiBtn');
                izbrisiBtn.addEventListener('click', this.izbrisiStudenta.bind(this));
            });
    
        } catch (error) {
            console.error('Greška prilikom dohvaćanja studenata:', error);
        }
    }
    
    connectedCallback() {
        this.prikaziStudente();
    
        this.shadowRoot.querySelector('#dodajStudentaBtn').addEventListener('click', this.dodajStudentaForma.bind(this));
    }

    async dodajStudenta() {
        const ime = this.shadowRoot.querySelector("#ime").value;
        const prezime = this.shadowRoot.querySelector("#prezime").value;
        const mail = this.shadowRoot.querySelector("#mail").value;
        const lozinka = this.shadowRoot.querySelector("#lozinka").value;
    
        try {
            await fetch("/api/studenti", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ime: ime,
                    prezime: prezime,
                    mail: mail,
                    lozinka: lozinka
                })
            });
    
            this.clearForm();
            this.prikaziStudente(); // update the table after adding a student
        } catch (error) {
            console.error('Error adding student:', error);
        }
    }

    async izbrisiStudenta(event) {
        try {
            let img = event.target;
    
            // Find the closest parent <tr> element
            let tr = img.closest('tr');
    
            // Retrieve the 'data-id' attribute from the <img> element
            let id = img.dataset.id;
    
            let url = '/api/studenti/' + id;
    
            let response = await fetch(url, { method: "DELETE" });
    
            if (response.ok) {
                this.prikaziStudente();
            } else {
                console.error('Error deleting student:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }

    // async prikaziZadace() {
    //     try {
    //         const response = await fetch('/api/zadace');

    //         if (!response.ok) {
    //             console.error('Greška prilikom dohvaćanja zadaća:', response.status, response.statusText);
    //             return;
    //         }
    
    //         console.log(response);

    //         const zadace = await response.json();

    //         const tbody = this.shadowRoot.querySelector('tbody');

    //         // Očisti trenutni sadržaj tablice
    //         tbody.innerHTML = '';

    //         // Popuni tablicu s podacima o studentima
    //         zadace.forEach(zadaca => {
    //             const tr = document.createElement('tr');
    //             tr.innerHTML = `
    //                 <td>${zadaca.id}</td>
    //                 <td>${zadaca.naziv}</td>
    //                 <td>${zadaca.rok}</td>
    //                 <td>
    //                     <img class="izbrisiBtn" data-id="${zadaca.id}" src="/img/trash.png" alt="Delete">
    //                 </td>
    //             `;
    //             tbody.appendChild(tr);

    //             // Add event listener for the newly created izbrisiBtn
    //             const izbrisiBtn = tr.shadowRoot.querySelector('.izbrisiBtn');
    //             izbrisiBtn.addEventListener('click', this.izbrisiZadacu.bind(this));
    //         });

    //     } catch (error) {
    //         console.error('Greška prilikom dohvaćanja zadaća:', error);
    //     }
    // }

    // async dodajZadacu() {
    //     const naziv = this.shadowRoot.querySelector("#naziv").value;
    //     const rok = this.shadowRoot.querySelector("#rok").value;
    
    //     try {
    //         await fetch("/api/zadace", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 naziv: naziv,
    //                 rok: rok,
    //             })
    //         });
    
    //         this.clearForm();
    //         this.prikaziZadace();
    //     } catch (error) {
    //         console.error('Error adding zadacu:', error);
    //     }
    // }

    // async izbrisiZadacu(event) {
    //     try {
    //         let img = event.target;
    
    //         // Find the closest parent <tr> element
    //         let tr = img.closest('tr');
    
    //         // Retrieve the 'data-id' attribute from the <img> element
    //         let id = img.dataset.id;
    
    //         let url = '/api/zadace/' + id;
    
    //         let response = await fetch(url, { method: "DELETE" });
    
    //         if (response.ok) {
    //             this.prikaziZadace();
    //         } else {
    //             console.error('Error deleting zadace:', response.status, response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error deleting zadace:', error);
    //     }
    // }
    

    clearForm() {
        this.shadowRoot.querySelector("#ime").value = "";
        this.shadowRoot.querySelector("#prezime").value = "";
        this.shadowRoot.querySelector("#mail").value = "";
        this.shadowRoot.querySelector("#lozinka").value = "";
    }

    renderStudent(student){
        let studentiTemplate=`
        <tr>
            <td>${student.id}</td>
            <td>${student.ime}</td>
            <td>${student.prezime}</td>
            <td>${student.mail}</td>
        </tr>`;
        return studentiTemplate
    }

    // renderDomaceZadace(domaceZadace){
    //     let domaceZadaceTemplate=`
    //     <tr>
    //         <td>${domaceZadace.id}</td>
    //         <td>${domaceZadace.naziv}</td>
    //         <td>${domaceZadace.rok}</td>
    //     </tr>`;
    //     return domaceZadaceTemplate
    // }
    render() {
        let studentiTemplate = '';
        // let domaceZadaceTemplate = '';

        for(let i of this.studenti){
            studentiTemplate += this.renderStudent(i);
        };
        // for(let i of this.zadace){
        //     domaceZadaceTemplate += this.renderDomaceZadace(i);
        // }

        const headerStudenti = `
        <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>E-mail</th>
            <th>Izbriši</th>
        </tr>
        `;

        // const headerDomaceZadace = `
        // <tr>
        //     <th>ID</th>
        //     <th>Naziv</th>
        //     <th>Rok predaje</th>
        // </tr>
        // `;

        const formDodajStudenta = `
            <label for="ime">Ime:</label>
            <input type="text" id="ime" name="ime" required>

            <label for="prezime">Prezime:</label>
            <input type="text" id="prezime" name="prezime" required>

            <label for="mail">E-mail:</label>
            <input type="email" id="mail" name="mail" required>

            <label for="lozinka">Lozinka:</label>
            <input type="password" id="lozinka" name="lozinka" required>

            <button type="button" class="dodaj" id="dodajStudentaBtn">Dodaj studenta</button>
        `;

        // const formDodajZadacu = `
        //     <label for="naziv">Naziv:</label>
        //     <input type="text" id="naziv" name="naziv" required>
            
        //     <label for="rok">Rok:</label>
        //     <input type="date" id="rok" name="rok" required>

        //     <button type="button" class="dodaj" id="dodajZadacuBtn">Dodaj zadacu</button>
        // `;

        this.shadowRoot.innerHTML = `
            <style>
                /* Stilizacija komponente */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 40px;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }

                th {
                    background-color: #f2f2f2;
                }

                button {
                    cursor: pointer;
                    padding: 5px 20px;
                }
                .dodaj{
                    margin-top: 10px;
                }
            </style>
            
            <h2>Popis studenata</h2>
            <table id="studentiTable">
                <thead>
                    ${headerStudenti}
                </thead>
                <tbody>
                    ${studentiTemplate}
                </tbody>
            </table>
            <h2>Dodaj studenta</h2>
            <form id="dodajStudentaForm">
                ${formDodajStudenta}	
            </form>

        `;
        this.setupEventListeners();
    }

}

customElements.define('studenti-component', StudentiComponent);

{/* <h2>Popis domaćih zadaća</h2>
<table id="zadaceTable">
    <thead>
        ${headerDomaceZadace}
    </thead>
    <tbody>
        ${domaceZadaceTemplate}
    </tbody>
</table>
<h2>Dodaj domaću zadaću</h2>
<form id="dodajZadacuForm">
    ${formDodajZadacu}	
</form> */}