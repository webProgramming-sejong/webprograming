const init = () => {
	removeCover();
};
const removeCover = () => {
	const cover = document.querySelector('.cover');

	cover.addEventListener('animationend', (e) => {
		cover.parentNode.removeChild(cover);
	});
};

if (scriptState === 'mainSection') {
	init();
}
