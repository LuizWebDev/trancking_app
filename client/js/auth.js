const loginForm = document.getElementById("login")
loginForm.addEventListener('submit', requestLogin)


async function requestLogin(e){
    e.preventDefault();
    const loginData = new FormData(loginForm)
    const formDataSerialised = Object.fromEntries(loginData)
    console.log(formDataSerialised)
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify((formDataSerialised))
        }
        const r = await fetch(`http://localhost:3000/users/login/`, options)
        const data = await r.json()
        if (data.err){ throw Error(data.err); }
        login(data);
    } catch (err) {
        console.log('error 3')
        console.warn(`Error: ${err}`);
    }
}

function login(data){
    localStorage.setItem('username', data.username);
    //location.hash = `#${data.username}/`;
    location.href = 'userHome.html';
    console.log('YOURE IN')
}



function currentUser(){
    const username = localStorage.getItem('username')
    return username;
}





const registerForm = document.getElementById("register")
registerForm.addEventListener('submit', registerUser)

async function registerUser(e){
    e.preventDefault();
    const registerData = new FormData(registerForm)
    const formDataSerialised = Object.fromEntries(registerData)
    console.log(formDataSerialised)

    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify((formDataSerialised))
        }
        const r = await fetch(`http://localhost:3000/users/register/`, options)
        const data = await r.json()
        if (data.err){ throw Error(data.err); }
        console.log('new user created');
   /*      const newUserConfirm = document.createElement('p')
        newUserConfirm.textContent = 'new user created'
         */
    } catch (err) {
        console.warn(`Error: ${err}`);
    }
}

