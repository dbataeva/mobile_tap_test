const main = document.querySelector("main");
const controls = [ "./controls/arrow1.png",
				  "./controls/arrow2.png",
				  "./controls/arrow3.png",
				  "./controls/arrow4.png",
				  "./controls/hand.png"];
const whiteScopes = ["./timer/left-scope1.png",
					"./timer/left-scope2.png",
					"./timer/right-scope1.png",
					"./timer/right-scope2.png"];
const redScopes = ["./timer/red-left-scope1.png",
				   "./timer/red-left-scope2.png",
				   "./timer/red-right-scope1.png",
				   "./timer/red-right-scope2.png"];
const videoArray = ["./video/video1.mp4", "./video/video2.mp4", "./video/video3.mp4"];
const intervalStamp = [];
const timeoutStamp = [];
const maxControlsWidth = 82.38;
const maxControlsHeight = 86.39;
let iterator = 0;

mainFunction(main, iterator, videoArray);

function mainFunction(main, iterator, videoArray) {

	let video = addVideo(main, iterator, videoArray);

	if (video) {
		video.addEventListener("click", playOnClick);
	}
}

function addVideo(main, iterator, videoArray) {
	let video;
	
	main.innerHTML = "";
	if (iterator >= videoArray.length) {
		let p = document.createElement("p");

		p.innerHTML = "done!";
		main.appendChild(p);
	} else {
		main.innerHTML = `<video src="${videoArray[iterator]}" preload="metadata"></video>`;
		video = document.querySelector("video");

		video.addEventListener("loadedmetadata", () => {
			let htmlHeightWidthCoefficient = window.innerHeight / window.innerWidth;
			let videoWidthHeightCoefficient = video.videoWidth / video.videoHeight;
			let videoHeightWidthCoefficient = video.videoHeight / video.videoWidth;

			if (videoWidthHeightCoefficient < 1) {
				if (videoHeightWidthCoefficient > htmlHeightWidthCoefficient) {
					video.style.height = "99.6vh";
				} else {
					video.style.width = "99.6vw";
				}
			} else {
				if (videoHeightWidthCoefficient > htmlHeightWidthCoefficient) {
					video.style.height = "99.6vh";
				} else {
					video.style.width = "99.6vw";
				}
			}
		});
	}
	
	return (video);
}

function playOnClick() {
	this.style.cursor = "auto";
	this.currentTime = 0;
	this.play();
	addTimer(main, this);
	this.removeEventListener("click", playOnClick);
}

function addTimer(main, video) {
	let scopesElements = [];
	let controlsLastPosition = {};

	// let appearTime = randomInteger(0, video.duration - 10);
	let appearTime = 2;

	timeoutStamp.push(setTimeout(() => {
		let secondsElements = createTimer(main, scopesElements, appearTime, video.duration);
		let controlsElement = createControls(main, controls, secondsElements, controlsLastPosition);

		goTimer(secondsElements);
		setTimerForChangeColor(scopesElements, secondsElements);
		moveButton(controlsElement, secondsElements, main, controlsLastPosition);
	}, appearTime * 1000));
}

function setTimerForChangeColor(scopesElements, secondsElements) {
	let currentTime = secondsElements[0].innerHTML;

	timeoutStamp.push(setTimeout(() => {
		let i = 0;

		secondsElements.forEach(second => {
			second.style.color = "#FF0059";
		});
		scopesElements.forEach(scope => {
			scope.src = redScopes[i];
			++i;
		});
	}, currentTime / 2 * 1000));
	
	timeoutStamp.push(setTimeout(() => {
		timeoutStamp.forEach(stamp => {
			clearTimeout(stamp);
		});
		timeoutStamp.length = 0;
		intervalStamp.forEach(stamp => {
			clearInterval(stamp);
		});
		intervalStamp.length = 0;
		mainFunction(main, iterator, videoArray);
	}, currentTime * 1000));
}

function goTimer(secondsElements) {
	intervalStamp.push(setInterval(() => {
		changeTime(secondsElements);
	}, 1000));
}

function changeTime(secondsElements) {
	secondsElements.forEach(second => {
		let currentTime = second.innerHTML;
		--currentTime;
		second.innerHTML = "";
		second.innerHTML = currentTime.toString();
	});
}

function randomInteger(min, max) {
	return (Math.floor((max + 1 - min) * Math.random() + min));
}

function createTimer(main, scopesElements, appearTime, videoDuration) {
	let containers = [];

	createScopes(main, scopesElements, containers);
	return (addSeconds(appearTime, videoDuration, containers));
}

function createScopes(main, scopesElements, containers) {
	containers.push(createScopesInContainer(scopesElements, "left-timer-container", 0, 2),
					createScopesInContainer(scopesElements, "right-timer-container", 2, 4));
	containers.forEach(container => {
		main.appendChild(container);
	});
}

function createScopesInContainer(scopesElements, containerName, from, to) {
	let container = document.createElement("div");

	container.className = containerName;
	for (let i = from; i < to; ++i) {
		let elem = document.createElement("img");
		let className = whiteScopes[i].substring(whiteScopes[i].lastIndexOf("/") + 1, whiteScopes[i].lastIndexOf("."));

		elem.src = whiteScopes[i];
		elem.classList.add(className);
		container.appendChild(elem);
		scopesElements.push(elem);
	}

	return (container);
}

function createControls(main, controls, secondsElements, controlsLastPosition) {
	let freeHeight = [(window.innerHeight - main.clientHeight) / 2 + main.clientHeight * 0.125 + maxControlsHeight / 2,
					  (window.innerHeight - main.clientHeight) / 2 + main.clientHeight * 0.875 - maxControlsHeight / 2];
	let freeWidth = [(window.innerWidth - main.clientWidth) / 2 + main.clientWidth * 0.15 + secondsElements[0].clientWidth + maxControlsWidth / 2, (window.innerWidth - main.clientWidth) / 2 + main.clientWidth * 0.85 - secondsElements[1].clientWidth - maxControlsWidth / 2];
	let xElem = randomInteger(freeWidth[0], freeWidth[1]);
	let yElem = randomInteger(freeHeight[0], freeHeight[1]);
	let parent = document.createElement("div");

	parent.className = "controls";
		controls.forEach(control => {
		let elem = document.createElement("img");
		let className = control.substring(control.lastIndexOf("/") + 1, control.lastIndexOf("."));
		
		elem.src = control;
		elem.classList.add(className);
		elem.addEventListener("click", goToTheNextVideo);
		parent.appendChild(elem);
	});

	parent.style.top = `${yElem}px`;
	parent.style.left = `${xElem}px`;
	controlsLastPosition.x = xElem;
	controlsLastPosition.y = yElem;
	main.appendChild(parent);

	return (parent);
}

function goToTheNextVideo() {
	timeoutStamp.forEach(stamp => {
		clearTimeout(stamp);
	});
	timeoutStamp.length = 0;
	intervalStamp.forEach(stamp => {
		clearInterval(stamp);
	});
	intervalStamp.length = 0;
	++iterator;
	mainFunction(main, iterator, videoArray);
}

function addSeconds(appearTime, videoDuration, containers) {
	let elements = [];
	let howMuchSeconds = randomInteger(5, videoDuration - appearTime)
	
	createSeconds(containers, "left-timer", howMuchSeconds, elements, 0);
	createSeconds(containers, "right-timer", howMuchSeconds, elements, 1);

	return (elements);
}

function createSeconds(containers, className, howMuchSeconds, elements, containerIndex) {
	let element = document.createElement("p");

	element.classList = className;
	element.innerHTML = howMuchSeconds;
	containers[containerIndex].appendChild(element);
	elements.push(element);
}

function moveButton(controlsElement, secondsElements, main, controlsLastPosition) {
	let freeHeight = [(window.innerHeight - main.clientHeight) / 2 + main.clientHeight * 0.125 + maxControlsHeight / 2,
					  (window.innerHeight - main.clientHeight) / 2 + main.clientHeight * 0.875 - maxControlsHeight / 2];
	let freeWidth = [(window.innerWidth - main.clientWidth) / 2 + main.clientWidth * 0.15 + secondsElements[0].clientWidth + maxControlsWidth / 2, (window.innerWidth - main.clientWidth) / 2 + main.clientWidth * 0.85 - secondsElements[1].clientWidth - maxControlsWidth / 2];

	console.log(maxControlsWidth);

	timeoutStamp.push(setTimeout( () => {
		changeButtonsCoordinates(freeHeight, freeWidth, controlsElement, controlsLastPosition);
		intervalStamp.push(setInterval( () => {
			changeButtonsCoordinates(freeHeight, freeWidth, controlsElement, controlsLastPosition);
		}, 5 * 1000));
	}, 0));
}

function changeButtonsCoordinates(freeHeight, freeWidth, controlsElement, controlsLastPosition) {
	let newCoordinates = [randomInteger(freeWidth[0], freeWidth[1]), randomInteger(freeHeight[0], freeHeight[1])];
	let xDifference = newCoordinates[0] - controlsLastPosition.x;
	let yDifference = newCoordinates[1] - controlsLastPosition.y;
	
	controlsElement.style.transform = `translate(${xDifference}px, ${yDifference}px)`;
}
