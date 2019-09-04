
var
//zamieszczany stałe, których użyjemy w grze
COLS = 26,
ROWS = 26,
EMPTY = 0,
SNAKE = 1,
FRUIT = 2,
LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,
KEY_LEFT  = 37,
KEY_UP    = 38,
KEY_RIGHT = 39,
KEY_DOWN  = 40,

//takie będą obiekty w grze

canvas,	  //HTML canvas
ctx,	  // CanvasRenderingContext2d 
keystate, //do klawiszy
frame,   //do animacji
punkty;	  // ilość punktów

//tworzymy grid - przestrzeń naszej gry

grid = {
	//plasza ma następujące wartości:
	width: null,  //szerokość
	height: null, //wysokość
	_grid: null,  //tablica, której komórki składają się na planszę


	// inicjujemy pole gry
	// c -> szerokość pola, r-> wysokość pola d -> domyślna wartość dla pola gry
	init: function(d, c, r) {
		this.width = c;
		this.height = r;
		this._grid = [];
		for (var x=0; x < c; x++) {
			this._grid.push([]);
			for (var y=0; y < r; y++) {
				this._grid[x].push(d);
			}
		}
	},
	

	// w polu o współrzędnych (x, y) ustawiamy wartość "w"
	set: function(w, x, y) {
		this._grid[x][y] = w;
	},
	

	// funkcja zwracająca wartość pola o współrzędnych (x, y)
	get: function(x, y) {
		return this._grid[x][y];
	}
}

//snake - czyli nasz wąż to kolejka FIFO (first in first out)

snake = {
	direction: null, //liczba - kierunek naszego węża
	last: null,		 //wskaźnik na ostatni element kolejki
	_queue: null,	 //tablica - nasz wąż
	


	//tworzy nowego węża w miejscu o współrzędnych (x, y),ustawionego w kierunku "d"
	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x, y);
	},
	

	//wydłużanie węża - dodanie elementu do tablicy i aktualizacja wskaźnika
	insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},
	

	//usuwanie i zwracanie ostatniego elementu tablicy
	remove: function() {
		return this._queue.pop();
	}
};

//funkcja wstawiająca jedzonko w losowe miejsce
function setFood() {
	var empty = []; //tablica na wolne komórki
	//iteruję po komórkach i zbieram wolne komórki
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	//wybranie losowego miejsca
	var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	grid.set(FRUIT, randpos.x, randpos.y);//wstawiam jedzonko na wylosowaną pozycję
}


//główna funkcja
function main() {
	//tworzenie elementów "canvas"
	canvas = document.createElement("canvas");
	canvas.width = COLS*20;
	canvas.height = ROWS*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	//tutaj będą wypisywane punkty
	ctx.font = "20px Helvetica";
	frame = 0;
	keystate = {};
	//śledzenie klawiszy
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});
	//inicjuję i zapętlam grę
	init();
	loop();
}


//resetowanie i inicjowanie obiektów gry
function init() {
	punkty = 0;
	grid.init(EMPTY, COLS, ROWS);
	var sp = {x:Math.floor(COLS/2), y:ROWS-1}; //wybieranie miejsca startowego dla węża
	snake.init(UP, sp.x, sp.y); //twożę węża
	grid.set(SNAKE, sp.x, sp.y); //wstawiam weża na moją planszę
	setFood(); //wstawiam jedzonko
}


//główna pętla gry - aktualizuję stan gry i rysuję zaktualizowaną sytuację
function loop() {
	update();
	draw();
	window.requestAnimationFrame(loop, canvas);
}


//aktualizacja stau gry
function update() {
	frame++;
	//ustalamy kierunek węża
	if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
		snake.direction = LEFT;
	}
	if (keystate[KEY_UP] && snake.direction !== DOWN) {
		snake.direction = UP;
	}
	if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
		snake.direction = RIGHT;
	}
	if (keystate[KEY_DOWN] && snake.direction !== UP) {
		snake.direction = DOWN;
	}
	// zmmieniamy stan gry co 5 klatek
	if (frame%5 === 0) {
		// oglądamy położenie przedniego elementu naszego węża
		var pozycja_x = snake.last.x;
		var pozycja_y = snake.last.y;
		// i ustalamy dla niego nową pozycję w zależności od kierunku
		switch (snake.direction) {
			case LEFT:
				pozycja_x--;
				break;
			case UP:
				pozycja_y--;
				break;
			case RIGHT:
				pozycja_x++;
				break;
			case DOWN:
				pozycja_y++;
				break;
		}

/* miejsce na 
   nowy kod
             */



	}
}


//projekcja gry
function draw() {
	//obliczanie rozmiaru jednej komórki gry
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;
	//pętla po wszystkich komórkach pola gry
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			//kolorowanie komórek w zależności od zawartosci
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#F5D783";
					break;
				case SNAKE:
					ctx.fillStyle = "#0ff";
					break;
				case FRUIT:
					ctx.fillStyle = "#f00";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
	//wypisywanie punktów
	ctx.fillStyle = "#000";
	ctx.fillText("punkty: " + punkty, 10, canvas.height-10);
}
// odpalamy grę
main();