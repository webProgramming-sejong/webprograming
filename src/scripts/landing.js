import * as PIXI from 'pixi.js';
import { Point } from '@pixi/math';

let currentVector = new Point(1, 0);

currentVector = currentVector.set(1, 0);
const screenSize = {
	width: window.innerWidth,
	height: window.innerHeight
};
let brushWidth = (window.innerHeight / window.innerWidth) * 150;
let brushHeight = (window.innerHeight / window.innerWidth) * 200;

const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	resolution: window.devicePixelRatio,
	autoDensity: true
});

document.body.appendChild(app.view);

app.loader
	.add('background', '/jpeg/mask.jpeg')
	.add('mask', '/png/effel-gray.png')
	.add('bristle1', '/png/brush6.png')
	.add('bristle2', '/png/bristle2.png')
	.load(() => {
		setup();
	});

const setup = () => {
	const brushTexture = app.loader.resources.bristle1.texture;
	const brushTexture2 = app.loader.resources.bristle2.texture;

	const brush = new PIXI.Sprite(brushTexture);
	// const brush2 = new PIXI.Sprite(brushTexture2);

	brush.width = brushWidth;
	brush.height = brushHeight;
	brush.anchor.set(0.5, 0.5);

	// brush2.width = brushWidth;
	// brush2.height = brushHeight;

	const backgroundTexture = app.loader.resources.background.texture;
	const maskTexture = app.loader.resources.mask.texture;
	const background = new PIXI.Sprite(backgroundTexture);
	background.x = app.renderer.screen.width / 2;
	background.y = app.renderer.screen.height / 2;
	background.anchor.x = 0.5;
	background.anchor.y = 0.5;
	background.width = window.innerWidth;
	background.height = window.innerHeight;

	const Mask = new PIXI.Sprite(maskTexture);
	Mask.width = app.renderer.screen.width;
	Mask.height = app.renderer.screen.height;
	Mask.x = app.renderer.screen.width / 2;
	Mask.y = app.renderer.screen.height / 2;
	Mask.anchor.x = 0.5;
	Mask.anchor.y = 0.5;
	Mask.width = window.innerWidth;
	Mask.height = window.innerHeight;

	app.stage.addChild(Mask);
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
	let bristle2Render = false;

	let vector;
	function pointerMove(event) {
		if (dragging) {
			brush.position.copyFrom(event.data.global);

			brush.width += 1;

			// const vx = event.data.global.x - currentVector.x;
			// const vy = event.data.global.y - currentVector.y;
			// vector = new Point(vx, vy);
			// vector = vector.set(vx, vy);

			// const dotProd = vector.x;
			// const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
			// const angle = Math.acos(dotProd / magnitude);
			// currentVector = currentVector.set(event.data.global.x, event.data.global.y);

			// if (!bristle2Render) {
			// 	setTimeout(() => (bristle2Render = true), 500);
			// }

			app.renderer.render(
				brush,
				{
					renderTexture,
					transform: new PIXI.Matrix(),
					clear: false
				},
				false,
				null,
				false
			);

			// if (bristle2Render) {
			// 	brush2.position.copyFrom(event.data.global);
			// 	app.renderer.render(brush2, renderTexture, false, null, false);
			// }

			// if (brush.width === 100) {
			// 	dragging = false;
			// 	brushWidth = 0;
			// }
		}
	}

	function pointerDown(event) {
		dragging = true;
		pointerMove(event);
	}

	function pointerUp(event) {
		dragging = false;
		bristle2Render = false;
		brush.width = brushWidth;
	}

	window.addEventListener('resize', () => {
		screenSize.width = window.innerWidth;
		screenSize.height = window.innerHeight;

		app.renderer.resize(window.innerWidth, window.innerHeight);
		app.renderer.stage.width = window.innerWidth;
		app.renderer.stage.height = window.innerHeight;
	});
};
