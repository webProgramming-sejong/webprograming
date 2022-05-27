import '../style/detail.css';
import SHA from 'sha256';

let scrollE = window.document.getElementById('scrollEvent');
let coverE = window.document.getElementById('headerCover');
let postE = window.document.getElementById('post');
scrollE.addEventListener('scroll', (e) => {
	if (window.innerHeight >= scrollE.scrollTop) {
		coverE.style.opacity = scrollE.scrollTop / window.innerHeight;
		postE.style.opacity = scrollE.scrollTop / window.innerHeight;
	}
});

const user = window.localStorage.getItem('id');
const clock = new Date();
/* Comments local storage */

const commentForm = document.querySelector('.commentSubmit');
const commentInput = document.querySelector('.commentInput');
const commentList = document.querySelector('.comments');
const comments_Ls = 'comments';
let comments = []; // comment를 저장한 배열
function deleteComment(event) {
	// filter를 사용해서 return 결과가 true인 것들만 추출됨

	const cleanComment = JSON.parse(window.localStorage.getItem(comments_Ls)).filter((comment1) => {
		if (comment1.id !== event.target.parentNode.id) {
			return comment1;
		} else {
			const targetDOM = document.getElementById(comment1.id);
			targetDOM.remove();
		}
	});
	window.localStorage.setItem(comments_Ls, JSON.stringify(cleanComment));
}
function saveComment(obj) {
	let currentObj = localStorage.getItem(comments_Ls);
	currentObj = JSON.parse(currentObj);
	if (currentObj) {
		console.log(obj);
		currentObj.push(obj);
	} else {
		currentObj = [obj];
	}

	localStorage.setItem(comments_Ls, JSON.stringify(currentObj)); // localStorage에 리스트 저장
}
function paintComment(text) {
	const comment = document.createElement('div');
	comment.classList.add('comment');
	const name = document.createElement('div');
	name.classList.add('name');
	const message = document.createElement('div');
	message.classList.add('message');
	const time = document.createElement('div');
	time.classList.add('time');
	const newId = SHA.x2(
		clock.getFullYear() +
			'/' +
			clock.getMonth() +
			'/' +
			clock.getDay() +
			' ' +
			clock.getHours() +
			':' +
			clock.getMinutes() +
			clock.getSeconds() +
			text
	);

	time.innerHTML =
		clock.getFullYear() +
		'/' +
		clock.getMonth() +
		'/' +
		clock.getDay() +
		' ' +
		clock.getHours() +
		':' +
		clock.getMinutes();
	message.innerHTML = text;
	name.innerHTML = user;
	comment.appendChild(name);
	comment.appendChild(message);
	comment.appendChild(time);
	comment.id = newId;
	const delBtn = document.createElement('button'); //butto태그 생성
	delBtn.innerText = 'Delete';
	delBtn.addEventListener('click', deleteComment);

	comment.appendChild(delBtn);
	commentList.appendChild(comment);

	const commentObj = {
		text,
		id: newId,
		time:
			clock.getFullYear() +
			'/' +
			clock.getMonth() +
			'/' +
			clock.getDay() +
			' ' +
			clock.getHours() +
			':' +
			clock.getMinutes(),
		name: user
	};
	return commentObj;
}
function handleSubmit(event) {
	event.preventDefault();
	const currentValue = commentInput.value;
	const obj = paintComment(currentValue);
	saveComment(obj);
	commentInput.value = '';
}
function loadComment() {
	const loadedComment = localStorage.getItem(comments_Ls);
	if (loadedComment !== null) {
		const parsedComment = JSON.parse(loadedComment);
		parsedComment.forEach(function (comment1) {
			// 객체내용 한개씩 파라미터로 넣어서 함수 실행
			const check = document.getElementById(comment1.id);
			if (!check) {
				const comment = document.createElement('div');
				comment.classList.add('comment');
				const name = document.createElement('div');
				name.classList.add('name');
				const message = document.createElement('div');
				message.classList.add('message');
				const time = document.createElement('div');
				time.classList.add('time');
				time.innerHTML = comment1.time;
				message.innerHTML = comment1.text;
				name.innerHTML = comment1.name;
				comment.appendChild(name);
				comment.appendChild(message);
				comment.appendChild(time);
				comment.id = comment1.id;
				const delBtn = document.createElement('button'); //butto태그 생성
				delBtn.innerText = 'Delete';
				delBtn.addEventListener('click', deleteComment);

				comment.appendChild(delBtn);
				commentList.appendChild(comment);
			}
		});
	}
}
function init() {
	loadComment();
	// commentForm에서 submit에 handleSubmit 이벤트를 연결
	commentForm.addEventListener('click', handleSubmit);
}
init();
