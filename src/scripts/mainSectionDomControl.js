const init = () => {
	removeCover();
};
const removeCover = () => {
	const cover = document.querySelector('.cover');

	cover.addEventListener('animationend', (e) => {
		cover.parentNode.removeChild(cover);
		console.log('hit');
	});
};

if (scriptState === 'mainSection') {
	console.log('123123');
	init();
}
