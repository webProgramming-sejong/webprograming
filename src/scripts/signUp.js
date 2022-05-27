import '../style/SignUpStyle.css';

const storage = window.localStorage;
const Email=document.getElementById("Email");
const Password1=document.getElementById("Password");
const Password2=document.getElementById("password");
const submit = document.getElementById("submit");

function CheckValue(){
    if(Password1.value == Password2.value){
        alert("SignUp Success");
        localStorage.setItem('id',JSON.stringify(Email.value));
        localStorage.setItem('pw',JSON.stringify(Password1.value));
    }
    else {
        alert("Wrong");
    }
}

function init(){
    submit.addEventListener("click", CheckValue);
}

init(); 