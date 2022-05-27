import * as PIXI from 'pixi.js';
import { Point } from '@pixi/math';
const canvas = document.getElementById('canvas');



window.onload = () => {

	// fuction execution delay, to wait for css animation finishes.
	setTimeout(() => init(), 3000);
};


let isCircleClick = false;  //if true, scratch effect available


const init = () => {
	const container = document.querySelector('.landing');
	const circleSvg = document.getElementsByClassName('helper_circle')[0];
	const helperPath = document.getElementsByClassName('helper_path')[0];


	// size configuration of brush = bristle
	let brushWidth = (window.innerHeight / window.innerWidth) * 100;
	let brushHeight = (window.innerHeight / window.innerWidth) * 120;


	// this part is Pixi.js part, so I'll roughly describe it
	const unCover = new PIXI.Graphics();
	unCover.beginFill(0x000000);
	unCover.drawCircle(0, 0, 100);
	unCover.endFill();



	// initialize canvas & pixi application
	const app = new PIXI.Application({
		width: container.clientWidth,
		height: container.clientHeight,
		resolution: window.devicePixelRatio,
		autoDensity: true,
		view: canvas
	});


	// load images to use images as texture , because of this, I added lots of animations when start,
	// cuz it takes time to load image , so for better UX, its better to earn some time for reload by animation
	app.loader
		.add('background', '/jpeg/city.jpeg')
		.add('bristle1', '/png/brush6.png')
		.add('bristle2', '/png/bristle2.png')
		.load(() => {
			// when all loading finishes, execute setup
			setup();
		});

	const setup = () => {

		// get texture of brush 
		const brushTexture = app.loader.resources.bristle1.texture;

		// declare brush sprite , which may be considered as a particle which has initial form of brush
		const brush = new PIXI.Sprite(brushTexture);
		// size config
		brush.width = brushWidth;
		brush.height = brushHeight;
		// to set transform origin as center
		brush.anchor.set(0.5, 0.5);


		//background image also passes same process as brush 
		const backgroundTexture = app.loader.resources.background.texture;
		const background = new PIXI.Sprite(backgroundTexture);

		background.width = container.clientWidth;
		background.height = container.clientHeight;

		background.x = app.renderer.screen.width / 2;
		background.y = app.renderer.screen.height / 2;

		background.anchor.x = 0.5;
		background.anchor.y = 0.5;


		// mask will be white plane, so I want to cover background image with mask, and whenever 
		// white color renders on mask, transparent that point
		// it may sound odd, that white color on mask reveals mask? 
		// its because mask's basic princlple is to visualize only white part in the image.
		// so what im talking about is that white plane below, which is mask is recognized as black plane to computer, so if I draw white sprite on it, behind part will be revealed
		const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
		mask.width = app.renderer.screen.width;
		mask.height = app.renderer.screen.height;
		mask.x = app.renderer.screen.width / 2;
		mask.y = app.renderer.screen.height / 2;
		mask.anchor.x = 0.5;
		mask.anchor.y = 0.5;



		const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);
		const renderTextureSprite = new PIXI.Sprite(renderTexture);
		// so load below stuffs to app
		app.stage.addChild(renderTextureSprite);
		app.stage.addChild(mask);
		app.stage.addChild(background);

		// set renderTextureSprite, which is white plane as mask of background img
		background.mask = renderTextureSprite;


		app.stage.interactive = true;

		// this event handler is supported by pixi.js so it isn't es6's event handler
		app.stage.on('pointerdown', pointerDown);
		app.stage.on('pointerup', pointerUp);
		app.stage.on('pointermove', pointerMove);

		let dragging = false;




		// origin Vector is set as below because I want to use X-axis as base 
		const originVector = new Point(1, 0);
		let vector;



		// not used
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
			// the actual part of scratch effect , will be available, if helperCircle is clicked , and dragging is true
			if (dragging && isCircleClick) {

				// get the position of cursor
				brush.position.copyFrom(event.data.global);

				// set brush width, and increase it
				brush.width = brushWidth;
				brushWidth = brushWidth < 150 ? brushWidth + 0.2 : brushWidth;

				// transform cursor position's origin to center of screen , default is top left
				const originPos = {
					x: event.data.global.x - window.innerWidth / 2,
					y: -(event.data.global.y - window.innerHeight / 2)
				};


				// below part is to rotate sprite image depending on users movement.
				// imagine you are drawing, and you are moving brush from right to left.
				//  by physics, the bristles continuously changes their directions
				// below part is about that

				// since the angle between two vector is defined as inverse cosine theta of two vector,

				// divide and conqure , lets get cosine theta(angle)
				const vx = originPos.x;
				const vy = originPos.y;



				vector = new Point(vx, vy);
				// normalize Vector to compute cos(theta) easily
				vector = normalizeVector(vector);

				// if we have two points, by changing aspects, we can think two vector are vectors from origin point

				// if we have two vector, we can get cosine theta by using dot product 
				// dot product is defined as multiplications of magnitude of vectors and cosine theta
				const dotProd = vector.x * originVector.x + vector.y * originVector.y;

				// arcosine has inverse relation with cosine so we can get angle
				const angle = Math.acos(dotProd);

				// On computer graphics, all kinds of rotations, even camera's position is handled by multiplications of Matrix
				// we use Matrix to handle transformations because of time complexity
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

			// if cursor is at endPosition area, execute process to pass user to main Section
			if (
				endPos.x - 5 <= event.data.global.x &&
				endPos.y + 5 >= event.data.global.y &&
				endPos.y - 5 <= event.data.global.y &&
				!isHit &&
				dragging
			) {
				isHit = true;
				document.body.children[3].removeChild(helperPath);
				const cover = document.querySelector('div.cover');
				cover.style.transform = 'translateY(-100vh)';
				setTimeout(() => {
					window.location.href += 'mainSection.html'
				},2500)
				
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

	// is user entered to endpos area?
	let isHit = false;

	// end position , if user enters this position when executing scratch effect, pass user to main Section
	const endPos = {
		x: container.clientWidth / 6 + (container.clientWidth * 1) / 2,
		y: container.clientHeight / 2
	};

	// click event handler, when user clicks helper circle, terminate helper circle, 
	//change cursor image to brush , visualize helper path
	circleSvg.addEventListener('click', (_) => {
		helperPath.classList.add('show_up');
		isCircleClick = true;
		container.style.cursor = "url('/assets/svg/paint-brush.svg') 2 2 , auto";
		// document.body.children[2].children[2].remove();
		document.body.children[3].children[1].remove();
	});
};

const reArrangeDomElement = (target) => {
	// console.dir(document.body.children[8])
	const mainSection = document.querySelector('.main-section')
	mainSection.classList.add('load');
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
