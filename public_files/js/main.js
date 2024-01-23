window.onload=(e)=>{
    let btnPost=document.querySelector("#postbutton");
    btnPost.addEventListener("click",async (e)=>{
        const url="/users"
        const data={ime:"Jozo", prezime:"Jozić"};
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    })

    let delbutton=document.querySelector("#delbutton");
    delbutton.addEventListener("click",async (e)=>{
        const url="/users/0"
        const response = await fetch(url, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        });
    })

    let getbutton=document.querySelector("#getbutton");
    getbutton.addEventListener("click",async (e)=>{
        const url="/users"
        const response = await fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
        });
    })

    let putbutton=document.querySelector("#putbutton");
    putbutton.addEventListener("click",async (e)=>{
        const url="/users/0"
        const data={ime:"Monika", prezime:"Mokić"};
        const response = await fetch(url, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    })
    
}