import * as PIXI from 'pixi.js';
import { Point } from '@pixi/math';
const canvas = document.getElementById('canvas');

document.head.children[17].remove();
document.head.children[16].remove();
document.head.children[13].remove();
document.head.children[12].remove();
console.dir(document.head.children);
window.onload = () => {
	setTimeout(() => init(), 3000);
};

let isCircleClick = false;
const init = () => {
	const container = document.querySelector('.landing');
	const circleSvg = document.getElementsByClassName('helper_circle')[0];
	const helperPath = document.getElementsByClassName('helper_path')[0];

	let brushWidth = (window.innerHeight / window.innerWidth) * 100;
	let brushHeight = (window.innerHeight / window.innerWidth) * 120;

	const unCover = new PIXI.Graphics();
	unCover.beginFill(0x000000);
	unCover.drawCircle(0, 0, 100);
	unCover.endFill();
	const app = new PIXI.Application({
		width: container.clientWidth,
		height: container.clientHeight,
		resolution: window.devicePixelRatio,
		autoDensity: true,
		view: canvas
	});

	// document.body.appendChild(app.view);

	app.loader
		.add('background', '/jpeg/city.jpeg')
		.add('bristle1', '/png/brush6.png')
		.add('bristle2', '/png/bristle2.png')
		.load(() => {
			setup();
		});

	const setup = () => {
		const brushTexture = app.loader.resources.bristle1.texture;

		const brush = new PIXI.Sprite(brushTexture);

		brush.width = brushWidth;
		brush.height = brushHeight;
		brush.anchor.set(0.5, 0.5);

		const backgroundTexture = app.loader.resources.background.texture;

		const background = new PIXI.Sprite(backgroundTexture);

		background.width = container.clientWidth;
		background.height = container.clientHeight;

		background.x = app.renderer.screen.width / 2;
		background.y = app.renderer.screen.height / 2;

		background.anchor.x = 0.5;
		background.anchor.y = 0.5;
		// background.position.set(0,0);

		const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
		mask.width = app.renderer.screen.width;
		mask.height = app.renderer.screen.height;
		mask.x = app.renderer.screen.width / 2;
		mask.y = app.renderer.screen.height / 2;
		mask.anchor.x = 0.5;
		mask.anchor.y = 0.5;

		const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

		const renderTextureSprite = new PIXI.Sprite(renderTexture);

		app.stage.addChild(renderTextureSprite);
		app.stage.addChild(mask);
		app.stage.addChild(background);

		background.mask = renderTextureSprite;

		app.stage.interactive = true;
		app.stage.on('pointerdown', pointerDown);
		app.stage.on('pointerup', pointerUp);
		app.stage.on('pointermove', pointerMove);

		let dragging = false;
		let startErase = false;

		const originVector = new Point(1, 0);
		let vector;

		const positionHistory = {
			start: {
				x: null,
				y: null
			},
			end: {
				x: null,
				y: null
			}
		};
		function pointerMove(event) {
			if (dragging && isCircleClick) {
				brush.position.copyFrom(event.data.global);
				brush.width = brushWidth;
				brushWidth = brushWidth < 150 ? brushWidth + 0.2 : brushWidth;
				const originPos = {
					x: event.data.global.x - window.innerWidth / 2,
					y: -(event.data.global.y - window.innerHeight / 2)
				};

				const vx = originPos.x;
				const vy = originPos.y;

				vector = new Point(vx, vy);
				vector = normalizeVector(vector);

				const dotProd = vector.x * originVector.x + vector.y * originVector.y;

				const angle = Math.acos(dotProd);

				const rotationMatrix = new PIXI.Matrix();
				rotationMatrix.rotate(angle);
				brush.rotation = angle;

				app.renderer.render(
					brush,
					{
						renderTexture,
						clear: false
					},
					false,
					null,
					false
				);
			}

			if (
				endPos.x - 5 <= event.data.global.x &&
				endPos.y + 5 >= event.data.global.y &&
				endPos.y - 5 <= event.data.global.y &&
				!isHit &&
				dragging
			) {
				isHit = true;
				const scripts = document.getElementsByTagName('script');

				const xhr = new XMLHttpRequest();
				document.body.children[3].removeChild(helperPath);

				const newScript = document.createElement('script');
				newScript.src = '/section.bundle.js';
				xhr.onload = () => {
					if (xhr.status === 200) {
						document.body.innerHTML += xhr.responseText;

						scriptState = 'mainSection';
						reArrangeDomElement({
							scriptToRemove: scripts[1],
							scriptToAdd: newScript,
							garbageElement: [document.body.children[2]]
						});
					} else {
						console.warn('erroor');
					}
				};
				xhr.open('get', './mainSection.html');
				xhr.send();
			}
		}

		function pointerDown(event, x, y) {
			if (isCircleClick) {
				dragging = true;
				startErase = false;
				positionHistory.start.x = event ? event.data.global.x : x;
				positionHistory.start.y = event ? event.data.global.y : y;
				helperPath.classList.add('show_up');
			}
		}

		function pointerUp(event) {
			if (isCircleClick) {
				dragging = false;
				brush.width = brushWidth;
				positionHistory.end.x = event.data.global.x;
				positionHistory.end.y = event.data.global.y;

				positionHistory.start.x = null;
				positionHistory.start.y = null;
				positionHistory.end.x = null;
				positionHistory.end.y = null;
			}
		}

		window.addEventListener('click', (e) => {
			pointerDown(null, e.x, e.y);
		});

		canvas.style.display = 'block';
	};

	const getMagnitude = (x, y) => {
		return Math.sqrt(x * x + y * y);
	};

	const normalizeVector = (vector) => {
		const magnitude = getMagnitude(vector.x, vector.y);
		vector.x /= magnitude;
		vector.y /= magnitude;

		return vector;
	};

	//// terminator

	let isHit = false;

	const endPos = {
		x: container.clientWidth / 6 + (container.clientWidth * 1) / 2,
		y: container.clientHeight / 2
	};
	circleSvg.addEventListener('click', (_) => {
		helperPath.classList.add('show_up');
		isCircleClick = true;
		container.style.cursor = "url('/assets/svg/paint-brush.svg') 2 2 , auto";
		// document.body.children[2].children[2].remove();
		document.body.children[3].children[1].remove();
	});
};

const reArrangeDomElement = (target) => {
	console.dir(target);
	document.body.children[4].classList.add('load');
	document.body.children[3].remove();
	document.body.children[0].remove();

	target.scriptToRemove.parentNode.removeChild(target.scriptToRemove);
	document.body.appendChild(target.scriptToAdd);

	setTimeout(() => {
		const imgToRemove = document.querySelector('div');
		const svgToRemove = document.querySelector('svg');
		imgToRemove.parentNode.removeChild(imgToRemove);
		svgToRemove.parentNode.removeChild(svgToRemove);
		target.garbageElement[0].remove();
	}, 2000);
};
