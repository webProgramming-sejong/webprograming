import * as PIXI from 'pixi.js';
import { Point } from '@pixi/math';

window.onload = () => {
	const canvas = document.getElementById('canvas');

	const circleSvg = document.getElementsByClassName('helper_circle')[0];
	const helperPath = document.getElementsByClassName('helper_path')[0];

	const screenSize = {
		width: window.innerWidth,
		height: window.innerHeight
	};
	let brushWidth = (window.innerHeight / window.innerWidth) * 100;
	let brushHeight = (window.innerHeight / window.innerWidth) * 120;

	const unCover = new PIXI.Graphics();
	unCover.beginFill(0x000000);
	unCover.drawCircle(0, 0, 100);
	unCover.endFill();
	const app = new PIXI.Application({
		width: (window.innerWidth * 2) / 3,
		height: window.innerHeight,
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
		// background.alpha = 0;
		background.x = app.renderer.screen.width / 2;
		background.y = app.renderer.screen.height / 2;
		background.anchor.x = 0.5;
		background.anchor.y = 0.5;

		const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
		mask.width = app.renderer.screen.width;
		mask.height = app.renderer.screen.height;
		mask.x = app.renderer.screen.width / 2;
		mask.y = app.renderer.screen.height / 2;
		mask.anchor.x = 0.5;
		mask.anchor.y = 0.5;

		app.stage.addChild(mask);
		app.stage.addChild(background);

		const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

		const renderTextureSprite = new PIXI.Sprite(renderTexture);

		app.stage.addChild(renderTextureSprite);

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
			if (dragging) {
				brush.position.copyFrom(event.data.global);

				brush.width += 0.1;
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
			} else {
				if (startErase) {
					unCover.position.copyFrom(event.data.global);

					app.renderer.render(
						unCover,
						{
							renderTexture,
							clear: false
						},
						false,
						null,
						false
					);
				}
			}
			if (
				endPos.x - 50 <= event.data.global.x &&
				(endPos.y + 50 >= event.data.global.y || endPos.y - 50 <= event.data.global.y) &&
				!isHit &&
				dragging
			) {
				isHit = true;
				// window.removeEventListener('mousemove' , exitLanding)
				const target = document.head.children[4];

				const xhr = new XMLHttpRequest();
				const section = document.getElementsByClassName('landing')[0];

				document.body.children[2].removeChild(helperPath);
				console.dir(document.body);
				xhr.onload = () => {
					if (xhr.status === 200) {
						document.body.innerHTML += xhr.responseText;
						document.body.children[3].classList.add('load');
						document.body.children[2].remove();
						document.head.children[4].remove();

						console.dir(document);
					} else {
						console.warn('erroor');
					}
				};
				xhr.open('get', './mainSection.html');
				xhr.send();
			}
		}

		function pointerDown(event, x, y) {
			dragging = true;
			startErase = false;
			positionHistory.start.x = event.data.global.x ? event.data.global.x : x;
			positionHistory.start.y = event.data.global.y ? event.data.global.y : y;
			helperPath.classList.add('show_up');

			pointerMove(event);
		}

		function pointerUp(event) {
			dragging = false;
			brush.width = brushWidth;
			console.dir(app);
			positionHistory.end.x = event.data.global.x;
			positionHistory.end.y = event.data.global.y;

			positionHistory.start.x = null;
			positionHistory.start.y = null;
			positionHistory.end.x = null;
			positionHistory.end.y = null;
		}

		window.addEventListener('click', (e) => {
			pointerDown(null, e.x, e.y);
		});

		window.addEventListener('resize', () => {
			screenSize.width = window.innerWidth;
			screenSize.height = window.innerHeight;

			app.renderer.resize(window.innerWidth, window.innerHeight);
			app.renderer.stage.width = window.innerWidth;
			app.renderer.stage.height = window.innerHeight;
		});
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
		x: window.innerWidth / 6 + (window.innerWidth * 1) / 2,
		y: window.innerHeight / 2
	};
	circleSvg.addEventListener('click', (_) => {
		console.dir(document.body);
		helperPath.classList.add('show_up');

		document.body.children[2].children[2].remove();
		document.body.children[2].children[1].remove();
	});
};
