/************************************************************
 *                                                            *
 *                        VARIABLES                           *
 *                                                            *
 **************************************************************/

var copyright = "Juanma Moreno Sanchez, 2018";
var moreInfo = "Press 'i' for more information";

var weatherData, stockData;

var windRad, windSpeed;
var nasdaqPerf;

var bg;
var headGirl, headAngel, head;

var canvas;
var system;
var spawnpoint;

var showMoreText = false;

var startTime;
var timeToRestart = 60000;

var weatherUrl = 'https://api.apixu.com/v1/current.json?key=29481937a1154bc9a1a93413181407&q=ALEPPO';
var wallStreetUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NDX&apikey=MGC0QST0RZCWJ2QC';

/************************************************************
 *                                                            *
 *                            SETUP                           *
 *                                                            *
 **************************************************************/

function preload(){
	spawnpoint = [windowWidth/2, windowHeight/2]; //[windowWidth*0.7, windowHeight*0.35];
	var size = "md";
	var sizeAsset = "md";
	if (windowWidth > windowHeight) {
		if (windowWidth <= 1400 && windowWidth > 800) {
			size = "sm";
		} else if (windowWidth < 800) {
			size = "xs";
			sizeAsset = "sm";
		}
		bg = loadImage("assets/background_"+size+".jpg");
		headGirl = loadImage("assets/head-girl_"+size+".png");
		
	} else {
		if (windowHeight <= 1400 && windowHeight > 800) {
			size = "sm";
		} else if (windowHeight < 800) {
			size = "xs";
			sizeAsset = "sm";
		}
		bg = loadImage("assets/background_movil_"+size+".jpg");
		headGirl = loadImage("assets/head-girl_"+sizeAsset+".png");
	}
	
	headAngel = loadImage("assets/head-angel.png");
	head = loadImage("assets/head.png");
} 
 
function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	
	loadData();
	
	pixelDensity(0.5);
	frameRate(40);
	
	system = new ParticleSystem(createVector(spawnpoint[0], spawnpoint[1]));
	startTime = millis();
	
	//image(bg, 0, 0, windowWidth, windowHeight);
}

/************************************************************
 *                                                            *
 *                            DRAW                            *
 *                                                            *
 **************************************************************/

function draw() {
	clear();
	background(bg);
	
	if (weatherData && stockData){	
		windRad = weatherData.current.wind_degree;
		windSpeed = weatherData.current.wind_kph;
		nasdaqPerf = getGrow(stockData["Time Series (Daily)"][Object.keys(stockData["Time Series (Daily)"])[0]]["1. open"], stockData["Time Series (Daily)"][Object.keys(stockData["Time Series (Daily)"])[0]]["4. close"]);	
		
		//background(bg);
		
		getTexts();
		
		if(!particleImg){
			if (Math.sign(nasdaqPerf) == 1){
				particleImg = headAngel;
			} else {
				particleImg = head;
			}
		} 
		
		system.addParticle(particleImg);
		system.run();
		
		if (Math.sign(nasdaqPerf) == 1){
			tint(180, 255, 220, 120+round(random(-10,10)));
		} else {
			tint(255, 220, 180, 120+round(random(-10,10)));
		}
		
		image(headGirl, 0+round(random(-2,2)), 0+round(random(-2,2)));
		image(headGirl, windowWidth/2+round(random(-2,2)), 0+round(random(-2,2)));
		image(headGirl, windowWidth/1.3+round(random(-2,2)), 0+round(random(-2,2)));
		rotate(PI / 180 * 180);
		image(headGirl, windowWidth/-1.5+round(random((windowWidth/3)*-1,(windowWidth/3))), windowHeight*-1+round(random(-2,2)));
		noTint();
	} 
	
	if (hasFinished()) {
		loadData();
		startTime = millis();
	}
}


/************************************************************
 *                                                            *
 *                            EVENTS                          *
 *                                                            *
 **************************************************************/

function keyPressed() {
	if (key == 'I' || keyCode == 73){
		showMoreText = ! showMoreText
	}
	background(bg);
	drawTopElements();
	getTexts()
}
/*
function mousePressed() {
  //background(bg);
  getTexts()
  drawTopElements();
}*/


/************************************************************
 *                                                            *
 *                           FUNCTIONS                        *
 *                                                            *
 **************************************************************/

function loadData() {
	particleImg = null;
	loadJSON(weatherUrl, getWeather);
	loadJSON(wallStreetUrl, getStock);
    frameCount = -1;
}
/*
function drawTopElements(){
	rotate(PI / 180 * 180);
	tint(255, 120);
	image(headGirl, windowWidth/-1.5+round(random(-80,80)), windowHeight*-1+round(random(-2,2)));
	noTint();
}*/

function hasFinished() {
	if(millis() - startTime >= timeToRestart){
		return true;
	}
}

function getWeather(weather){
	weatherData = weather;
}

function getStock(stock){
	stockData = stock;
}

function getGrow(openValue, closeValue){
    return parseFloat(((closeValue - openValue) / closeValue) * 100).toFixed(2);
}

function getTexts() {
	fill(200);
	if (windowWidth > windowHeight) {
		textSize(18);
	} else {
		textSize(24);
	}
	text(copyright, 10, 20);
	
	if (!showMoreText) {
		text(moreInfo, 10, 40)
	}
	else {
		if (weatherData){
			text("Wind direction in "+weatherData.location.name+" :"+weatherData.current.wind_dir+" (direction: "+windRad+"). Wind speed: "+windSpeed+" KPH (Last update on local time: "+weatherData.current.last_updated+")", 10, 70);
		} else {
			text("Loading weather data...", 10, 70);
		}
		
		if (stockData){
			text("Nasdaq Index performed "+nasdaqPerf+"% (Last update: "+Object.keys(stockData["Time Series (Daily)"])[0]+")", 10, 90);
		} else {
			text("Loading Nasdaq data...", 10, 90);
		}
		
		//text(nasdaqPerf, 10, 120);
		/*
		nasdaqPerf
		
		var time = millis() - startTime;
		text("Time to update: " + Math.floor((timeToRestart - time)/1000), 10, 120);
		
		var fps = frameRate();
		text("FPS: " + fps.toFixed(2), 10, 140);
		
		var pixelDensity = displayDensity();
		text("Pixel density: " + pixelDensity, 10, 160);*/
	}
}