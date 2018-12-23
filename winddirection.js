/************************************************************
 *                                                            *
 *                        VARIABLES                           *
 *                                                            *
 **************************************************************/

var copyright = "Copyright Juanma Moreno Sanchez, 2018";
var moreInfo = "Press 'i' to get more information";

var weatherData, stockData;

var windRad, windSpeed;
var nasdaqPerf;

var bg;
var headAngel, head;

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
	var size;
	if (windowWidth > windowHeight) {
		if (windowWidth > 1200){
			size = "md";
		} else if (windowWidth <= 1200 && windowWidth > 640) {
			size = "sm";
		} else if (windowWidth < 640) {
			size = "xs";
		}
		spawnpoint = [windowWidth*0.75, windowHeight*0.7];
		bg = loadImage("assets/background_"+size+".jpg");
		
	} else {
		if (windowHeight > 1200){
			size = "md";
		} else if (windowHeight <= 1200 && windowHeight > 640) {
			size = "sm";
		} else if (windowHeight < 640) {
			size = "xs";
		}
		spawnpoint = [windowWidth*0.7, windowHeight*0.3];
		bg = loadImage("assets/background_movil_"+size+".jpg");
	}
	headAngel = loadImage("assets/head-angel.png");
	head = loadImage("assets/head.png");
} 
 
function setup() {
	loadData();
	
	frameRate(45);

	canvas = createCanvas(windowWidth, windowHeight);
	system = new ParticleSystem(createVector(spawnpoint[0], spawnpoint[1]));
	startTime=millis();
}

/************************************************************
 *                                                            *
 *                            DRAW                            *
 *                                                            *
 **************************************************************/

function draw() {
	background(bg);
	//background(0);
	
	getTexts();
	
	if (weatherData && stockData){
		windRad = weatherData.current.wind_degree;
		windSpeed = weatherData.current.wind_kph;
		nasdaqPerf = getGrow(stockData["Time Series (Daily)"][Object.keys(stockData["Time Series (Daily)"])[0]]["1. open"], stockData["Time Series (Daily)"][Object.keys(stockData["Time Series (Daily)"])[0]]["4. close"]);	
		
		if(!particleImg){
			if (Math.sign(nasdaqPerf) == 1){
				particleImg = headAngel;
			} else {
				particleImg = head;
			}
		} 
		
		system.addParticle(particleImg);
		system.run();
	} else {
		
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
}


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
	textSize(14);
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
			text("Loading Nasdaq data...", 10, 70);
		}
		
		var time = millis() - startTime;
		text("Time to update: " + Math.floor((timeToRestart - time)/1000), 10, 120);
		
		var fps = frameRate();
		text("FPS: " + fps.toFixed(2), 10, 140);
	}
}