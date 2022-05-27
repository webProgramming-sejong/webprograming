import '../style/login.css';
import '../style/login.css';

const storage = window.localStorage;

const id = document.getElementById('id');
const password = document.getElementById('Password');
const submit = document.getElementById('submit');

const id1 = localStorage.getItem('id');
const pw1 = localStorage.getItem('pw');

submit.addEventListener('click', () => {
	if (id.value == JSON.parse(id1)) {
		if (password.value == JSON.parse(pw1)) {
			window.location.href = window.location.href.replace('login.html', 'mainSection.html');
			alert('login success!');
		} else {
			alert('Please check your ID and password again!');
		}
	} else {
		alert('account does not exist.');
	}
});
