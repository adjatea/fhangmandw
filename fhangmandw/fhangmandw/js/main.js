var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var words = ["fhdw", "informatik", "bwl", "dual", "studium", "finanzmathematik", "bilanz", "guv", "gewinn", "javascript", "java", "software", "wirtschaft", "klausur", "praesentation", "office", "praxis"];
var usedWords = [];
var usedLetters = [];
var word;
var lives = 4;
var tries = 6;
var points = 0;
var pick; //Buchstaben Wahl des Nutzers
var picks = []; //Alle ausgewählten Buchstaben des Nutzers
var correct = []; //Richtige picks
var gameover;
var letterFound = 0;

//Local Highscores TEST; könnte komfortabeler sein; am Ende dann einblenden statt Seitenwechsel
var schoolname;
var highscores = [];

//Sounds
var button = AudioFX('sounds/BounceYoFrankie.mp3', { pool: 10 });
var rightLetter = AudioFX('sounds/110390__soundscalpel-com__cartoon-siren-whistle-001.wav', { pool: 10 });
var rightWord = AudioFX('sounds/109663__grunz__success-low.wav', { pool: 10 });
var wrong = AudioFX('sounds/142608__autistic-lucario__error.wav', { pool: 10 });
var fail = AudioFX('sounds/242503__gabrielaraujo__failure-wrong-action.wav', { pool: 10 });
var end = AudioFX('sounds/133283__fins__game-over.wav', { pool: 10 });

//var a = result[Object.keys(result)[0]];
//var b = result[Object.keys(result)[1]];
//console.log("a: " + a);
//console.log("b: " + b);

//Ausgabe der Keys und Values eines Objects
/*
Object.keys(result).forEach(function (key) {
    var val = result[key];
    console.log("val|key: " + val + "|" + key);
});
*/


//var result = {school:"", score:""};

//Waehle zufaelliges Wort aus Woerterarray und entferne Wort aus Array in "Papierkorb-Array" usedWords
function randomWord() {
    word = words[Math.floor(Math.random() * (words.length))];
    usedWords.push(word);

    if (words.length > 0) {
        for (var i = 0; i < words.length; i++) {
            if (words[i] == word) {
                words.splice(i, 1);
                console.log(words.length);
            }
        }
    }
    else {
       	//Alert erfolgte in Methode fillSecret bei Array-Länge 0
    }
    console.log(word);
    return word;
}

//Erzeugen der Buttons mit Buchstaben
function createButtons() {
	jQuery(function($){
		for(var i = 0; i < letters.length; i++) {
			//Umbruch bzw. einstellen der Tastatur
			if(i % 13 == 0) {
				var br = $('<br/>');
				$("#buttons ul").append(br);
			}
			//Einsetzen aller Buchstaben in Variable
			var letter = letters[i];
			//Erzeugen von li Elementen mit Buchstaben
			var abcEl = $('<li>' + letter + '</li>');
			//Vergabe einer id für spätere Identifizierung bei checkLetter()
			$(abcEl).attr('id', 'abc');
			//Klasse für Keyboards.js
			$(abcEl).addClass(letters[i]);
			//Anhängen der Elemente an ul
			$("#buttons ul").append(abcEl);
		}
	});
}

function removeActive() {
	jQuery(function($){
		for(var i = 0; i < letters.length; i++) {
			$("#buttons ul li#abc").removeClass("active");
		}
	});
}

//Befüllen des Ratefelders mit Elementen in Abhängigkeit der Wortlänge
function fillSecret() {
	jQuery(function($){
	//Reset fuer "nächstes Wort"
	    $("#area ul").empty();

	    if (words.length > 0) {
	        for (var j = 0; j < word.length; j++) {
	        	//Unterstrich li Elemente
	        	var secretEl = $('<li>_</li>')
	        	//Vergabe einer id für spätere Prüfung
				$(secretEl).attr('id', word[j]);
	            //Erstelle so viele Unterstriche wie die Wortlänge
	            $("#area ul").append(secretEl);
	        }
	    }
	    else {
	    	checkEndgame();
	    }
	});
}

function getPick() {
	jQuery(function($){
		$('ul#letterButton li#abc').click(function() {
			//button.play();
			$(this).addClass("active");
			var pick = $(this).text();
			//console.log("Picked " + pick);
			checkLetter(pick);
			return pick;
		});
	});
}

//Pruefen ob der Benutzer einen richtigen Buchstaben gewählt hat
//Wenn richtig dann decke auf und tausche _ durch richtigen Buchstaben
function checkLetter(userPick) { //Geht ohne, weil per onclick Funktion das aktuelle Element angetriggert wird, der gewählte Buchstabe ist jeweils in "pick" drinnen
		jQuery(function($){
				if(userPick != null && $.inArray(userPick, usedLetters) == -1) {
				usedLetters.push(userPick);

				for (var i = 0; i < word.length; i++) {
				    if (userPick === word[i]) {
				        letterFound = 1;
				        console.log("letterFound " + letterFound);
			          //Nur einmalig eintragen
			          if(jQuery.inArray(userPick, correct) == -1) {
			          	correct.push(userPick);
			          	console.log("correct: " + correct);
			          	//Unterstrich durch richtigen Buchstaben aufdecken
			          	for(var a = 0; a < correct.length; a++) {
			          		$('ul#secretField li#'+correct[a]).text(correct[a]);
							rightLetter.play();
			          	}
			          	wordComplete();
			          }
			          var position = ++i;
			          console.log("Position " + position);
			          //Array picks mit Funden füllen
			          picks.push(userPick);
			          console.log(picks);
				    }
			     }
				    if (letterFound == 0) {
				        tries--;
				        wrong.play();
				        $('#tplaceholder').html(tries);
				        console.log("Tries: " + tries);

				        //Eigene Funktion daraus machen?
				        if (tries === 0) {
				            lives--;
				            removeActive();
				            fhdwLife();
				            revealWord();
				            $('#lplaceholder').html(lives);
				            tries = 6;
				            $('#tplaceholder').html(tries);
				            console.log("Lives: " + lives);
				            checkEndgame();
				        }
				    }
			     letterFound = 0;
				}
				else {
				    console.log("Bereits ausprobierter Buchstabe wurde nochmal probiert.");
				}
		});
	}

//Aufdecken des Wortes wenn man keine Tries mehr hat; noch nicht eingesetzt, weil noch an richtiger Stelle resetet werden muss
function revealWord() {
	for(var i = 0; i < word.length; i++) {
		$('ul#secretField li#'+word[i]).text(word[i]);
	}
}

//Entweder Inhalt der Unterstrich li Elemente auf noch vorhanden sein prüfen (Alternativ word mit correct gegenchecken (String vs Array))
function wordComplete() {
	var counter = 0;
	jQuery(function($){
		for(var i = 0; i < word.length; i++) {
			if($('ul#secretField li#'+word[i]).text() == '_') {
				counter++;
			}
		}
		//Wort ist vollständig
		if (counter == 0) {
            //picks und correct Array leeren
			picks.length = 0;
			correct.length = 0;
			usedLetters.length = 0;

            //neues Wort + Striche generieren
			tries = 6;
			$('#tplaceholder').html(tries);
			randomWord();
			removeActive();
			fillSecret();

		    //Punktevergabe
			points++;
			$('#pplaceholder').html(points);
		}
	});
}

//Steuerung des FHDW Logos als Lebensanzeige
function fhdwLife() {
	//Von Anfang an alle spans bzw. das ganze div disablen
	if(lives == 3) {
		$("#fhdwLogo span#f" ).toggle( "fade" );
		fail.play();
	}
	else if(lives == 2) {
		$("#fhdwLogo span#h" ).toggle( "fade" );
		fail.play();
	}
	else if(lives == 1) {
		$("#fhdwLogo span#d" ).toggle( "fade" );
		fail.play();
	}
	else if(lives == 0) {
		console.log("fhdwLife togglet");
		$("#fhdwLogo span#w" ).toggle( "fade" );
	}	
}

//Muss ueber checkNewHighscore()
function highscorePrompt() {
	schoolname = prompt("Neuer Highscore! Gib den Namen deiner Schule ein!");
	points = points;
	//addScore(pos);
}

//Laden der bisherigen Highscores
function loadHighscores() {
		//Standardinhalt
		result = {"1":9, "2":8, "3":6, "4":4, "5":2};
		var i = 0;
		//store (localStorage) einlesen
		// TODO

		//Ausgabe der Keys und Values eines Objects
		Object.keys(result).forEach(function (key) {
		    var val = result[key];
		    //console.log("val|key: " + val + "|" + key)
		    //Einfuegen in die Highscoreliste
		    highscores.push(result[Object.keys(result)[i]]);
		    i++;
		});
		console.log("loadHighscores()");
		createHighscorelist(result, highscores);
}

//Aufbauen der Liste mit bestehenden Highscores
function createHighscorelist(r, h) {
	jQuery(function($){
		$("#highscores").empty();

		/* Statische Art
		for(var i = 0; i < 5; i++) {
			var entry = $('<li id="entry"><span id="score">' + 0 + '</span> <span id="schoolname">' + "noch keiner" + '</span></li><br/>');
			$("#highscores").append(entry);
		}
		*/		

		Object.keys(r).forEach(function (key) {
		    var val = r[key];
			var entry = $('<li id="entry"><span id="score">' + key + '</span> <span id="schoolname">' + val + '</span></li><br/>');
			$("#highscores").append(entry);
		});
	});
	console.log("createHighscorelist()");
}

//Pruefen ob der neue Score in die Highscoreliste gehoert
function checkNewHighscore(achievedPoints) {
	//Durchlaufen der Highscoreliste und Points gegenchecken
	var pos = 4;
	var i = 0;
	var achievedPoints = 3;
	console.log(result[Object.keys(result)[4]]);

	//Wenn Wert groeßer als der kleinste in der Liste also highscores[4]
	if(achievedPoints > result[Object.keys(result)[4]]) {
		//Suchen der position
		console.log("Punkte groeßer als ein Ergebnis der Highscoreliste");
		console.log(result[Object.keys(result)[pos]]);
		while(points > result[Object.keys(result)[pos]]) {
			pos--;
		}
		//highscorePrompt(pos);   Muss davor Namen holen
		//addScore(pos);	TODO wieder aktivieren wenn addScore laeuft
	}
	console.log("checkNewHighscore(achievedPoints)");
}

//Hinzufuegen eines neuen Scores zur Highscoreliste
function addScore(position) {
	//Hole Punktestand und Namen
	var punkte = points;
	var name = schoolname;

	//Fuege ins result Object ein : TODO auf object schreibweise umstellen
	result.school = schoolname;
	result.score = punkte;

	//Fuege Ergebnis an ermittelte Position und verschiebe
	highscores.splice(position, 0, result);
    highscores.pop();

    //Update highscoreList() Eintraege
    jQuery(function($){
    	var realPos = --position;
		for(var i = position; i < 5; i++) {
			//Wahrscheinlich Probleme mit der richtigen Reihe; Loesung zusaetzliche classes mit ids vergeben
			$('span #score').html(highscores[realPos].score);
    		$('span #schoolname').html(highscores[realPos].schoolname);
		}
	});
	console.log("addScore(" + position + ")");
}

//Abspeichern in localStorage via store.js
function saveToStore() {
	//store.set('id', points);
	//console.log("store get: " + store.get('id', points));
}

function checkEndgame() {
    if (lives === 0 || words.length <= 0) {
        $('#tplaceholder').html('0'); //schafft er so schnell nicht, deshalb Timeout in der Folge
        setTimeout('', 1000);
        alert("Game Over");
        highscorePrompt();
        //createHighscorelist();
        //checkNewHighscore(points); // oder points oder newPoints
        //window.location.href = 'gameover.html'; //fuer localHighscore erstmal ausgemacht
    }
    else {
			picks.length = 0;
			correct.length = 0;
			usedLetters.length = 0;
			randomWord();
			fillSecret();
    }
}

//eventListener bzw. onclick Event für die Buchstaben Buttons -> ausführen von checkLetters()


//Funktionsaufrufe: TODO alles in init() oder start()
/*
randomWord();
createButtons();
fillSecret();
checkLetter(getPick());
loadHighscores();
checkNewHighscore(points);
*/

/*
function start() {
	picks.length = 0;
	correct.length = 0;
	usedLetters.length = 0;

	randomWord();
	createButtons();
	fillSecret();
	createHighscorelist();
	checkLetter(getPick());
}
*/