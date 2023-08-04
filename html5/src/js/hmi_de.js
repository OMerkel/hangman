/**
 * @file hmi.js
 * @author Oliver Merkel <Merkel(dot)Oliver(at)web(dot)de>
 * @date 2021 May 8
 *
 * @section LICENSE
 *
 * Copyright 2021, Oliver Merkel <Merkel(dot)Oliver(at)web(dot)de>
 * All rights reserved.
 *
 * Released under the MIT license.
 *
 * @section DESCRIPTION
 *
 * @brief Class Hmi.
 *
 * Class representing the view or Hmi of Hangman.
 * Hangman is a vocabulary / word game.
 *
 */

const KEYS = [ 'qwertzuiop', 'asdfghjkl', 'yxcvbnm' ];

function Hmi() {
  this.word = 'shortsightedness';
  this.guesses = '';  
  this.panel = { x: 320, y: 460 };
  this.paper = Snap('#board').attr({viewBox: '0 0 ' + this.panel.x + ' ' + this.panel.y });
  this.resize();
  this.paper.rect( 0, 0, this.panel.x, this.panel.y ).attr({
    stroke: '#444', 'stroke-width': 0.2, 'stroke-linecap': 'round',
    fill: 'darkslategrey'
  });
  this.gallows = [
    [
      this.paper.path( 'M20,300l250,0' )
        .attr({ 'fill': 'none', stroke: 'green', 'stroke-width': 20 }),
    ], [
      this.paper.path( 'M50,80l0,220l50,0l-50,-50' )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 10 }),
    ], [
      this.paper.path( 'M110,80l-60,60l0,-60l120,0' )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 8 }),
    ], [
      this.paper.path( 'M170,80l0,60m-3,-3l6,0m-6,-3l6,0m-6,-3l6,0' )
        .attr({ 'fill': 'none', stroke: 'maroon', 'stroke-width': 3, 'stroke-linecap': 'round' }),
      this.paper.circle( 170, 150, 10 ).transform('s0.75,1')
        .attr({ 'fill': 'none', stroke: 'maroon', 'stroke-width': 2 }),
    ], [
      this.paper.circle( 170, 140, 20 )
        .attr({ 'fill': 'orange', stroke: 'black', 'stroke-width': 4 }),
      /* eyes */
      this.paper.circle( 163, 135, 2 )
        .attr({ 'fill': 'black', stroke: 'black', 'stroke-width': 4 }),
      this.paper.circle( 177, 135, 2 )
        .attr({ 'fill': 'black', stroke: 'black', 'stroke-width': 4 }),
      /* mouth */
      this.paper.circle( 170, 148, 4 )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 2 }),
    ], [
      this.paper.path( 'M140,150l30,10l0,32l-30,30l-10,-10' )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 4 }),
    ], [
      this.paper.path( 'M200,150l-30,10l0,32l30,30l10,-10' )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 4 }),
      this.paper.circle( 170, 140, 20 )
        .attr({ 'fill': 'lightgreen', stroke: 'black', 'stroke-width': 4 }),
      /* eyes */
      this.paper.path( 'M158,130l10,10m0,-10l-10,10' )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 3 }),
      this.paper.path( 'M172,130l10,10m0,-10l-10,10' )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 3 }),
      /* mouth */
      this.paper.path( 'M159,150l25,-6' )
        .attr({ 'fill': 'none', stroke: 'black', 'stroke-width': 3 }),
    ]
  ];
  this.keyboard = [];
  var keyboardPosY = 350;
  for(var r=0; r<KEYS.length; ++r) {
    for(var i=0; i<KEYS[r].length; ++i) {
      this.keyboard[this.keyboard.length] = {
        back: this.paper.circle( 15+16*r+32*i, keyboardPosY+r*30, 14 )
          .attr({ 'fill': 'lightblue', stroke: 'white', 'stroke-width': 3 }),
        text: this.paper.text( 15+16*r+32*i, 5+keyboardPosY+r*30,
          KEYS[r][i]).attr({
            'font-size': 18,
            'text-anchor': 'middle',
            'alignment-baseline': 'middle'
          }),
        button: this.paper.circle( 15+16*r+32*i, keyboardPosY+r*30, 14 )
          .attr({ 'fill': 'white', stroke: 'black',
            'stroke-width': 1 , 'fill-opacity': 0.01 }),
      }
      this.keyboard[this.keyboard.length-1].button.click( this.handler.bind(this) );
    }
  }
  this.result = this.paper.text(160, 40,
    '_ho_t_i_ht_dn___').attr({
      'font-size': 30,
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      'letter-spacing': '3px'
    })
};

Hmi.prototype.getWord = function() {
var a = [
  "Aalsuppe",
  "Aalzucht",
  "Aasfresser",
  "Aasgeier",
  "Aasgeruch",
  "Aasgestank",
  "Abakus",
  "Abalone",
  "Abbauarbeit",
  "Abbeizmittel",
  "Abbeizpaste",
  "Abbildung",
  "Abschnitt",
  "Affekt",
  "Ahnung",
  "Akrobatik",
  "Aktenordner",
  "Analyse",
  "Ananas",
  "Anatomie",
  "Anatomievorlesung",
  "Ankerplatz",
  "Anprobe",
  "Anseilknoten",
  "Ansprache",
  "Antonym",
  "Apfelwein",
  "Apotheker",
  "Aprilanfang",
  "Aprilwetter",
  "Armknochen",
  "Armlehne",
  "Armleuchter",
  "Armreif",
  "Astgabel",
  "Augenbraue",
  "Augenlicht",
  "Augenlid",
  "Augenlidzucken",
  "August",
  "Ausschnitt",
  "Aussprache",
  "Australien",
  "Auswahl",
  "Autofahrt",
  "Automobil",
  "Baiser",
  "Baiserhaube",
  "Bananenschale",
  "Barbier",
  "Bastelbogen",
  "Bauchnabel",
  "Baufirma",
  "Baumhaus",
  "Bauwagen",
  "Bayern",
  "Bedeutung",
  "Begleitung",
  "Beistelltisch",
  "Benutzer",
  "Besenstiel",
  "Bestellnummer",
  "Bestellung",
  "Bettdecke",
  "Bettpfosten",
  "Bewegung",
  "Bewerbung",
  "Bewusstsein",
  "Bienenhonig",
  "Bilderrahmen",
  "Bistrotisch",
  "Blaubeere",
  "Blumenvase",
  "Blutdruck",
  "Bohnensuppe",
  "Bohrturm",
  "Boxhandschuh",
  "Boxhieb",
  "Brandenburg",
  "Bratkartoffel",
  "Bremse",
  "Brillenetui",
  "Brustbeutel",
  "Buchbesprechung",
  "Buchhaltung",
  "Buchseite",
  "Calcitvorkommen",
  "Chakren",
  "Chakrenlehre",
  "Charakter",
  "Charakterdarsteller",
  "Chemie",
  "Chemiekasten",
  "Chemielabor",
  "Chinavase",
  "Cholesterin",
  "Chromosom",
  "Computer",
  "Damenstrumpf",
  "Damenwahl",
  "Dampfgarer",
  "Dartpfeil",
  "Definition",
  "Dezember",
  "Diagramm",
  "Diskussion",
  "Drahtseil",
  "Drahtspeiche",
  "Druidenwissen",
  "Dynamik",
  "Effekt",
  "Ehrgeiz",
  "Eidechse",
  "Eierkarton",
  "Eiersalat",
  "Einkauf",
  "Einrad",
  "Einzigartigkeit",
  "Eisdiele",
  "Eisenbahn",
  "Elektronik",
  "Elektrotechnik",
  "Ellenbogen",
  "Emotion",
  "Endeffekt",
  "Entenschnabel",
  "Entspannung",
  "Erdkruste",
  "Erwachsener",
  "Eselsohr",
  "Etymologie",
  "Evaluation",
  "Facette",
  "Fachwerkhaus",
  "Fahrrad",
  "Fahrradfelge",
  "Fahrradnabe",
  "Fahrradspeiche",
  "Faltblatt",
  "Familienvater",
  "Farbenlehre",
  "Farbschema",
  "Farbschematik",
  "Faulenzerei",
  "Faustschlag",
  "Februar",
  "Fensterbrett",
  "Fensterglas",
  "Fensterrahmen",
  "Ferkelei",
  "Fernbedienung",
  "Fernseher",
  "Fesselballon",
  "Feueralarm",
  "Feuerstein",
  "Feuerteufel",
  "Filmtheater",
  "Finanzamt",
  "Finanzminister",
  "Fingerkuppe",
  "Fingernagel",
  "Fitness",
  "Fitnessstudio",
  "Flaschenhals",
  "Fleischerei",
  "Fleischfresser",
  "Fliehkraft",
  "Flugschalter",
  "Flugzeug",
  "Flussdiagramm",
  "Frakturschrift",
  "Freundschaft",
  "Funktion",
  "Gangschaltung",
  "Garagentor",
  "Gartentor",
  "Gegenleistung",
  "Gegensatz",
  "Gegenwind",
  "Geheimhaltung",
  "Geheimnis",
  "Gehirnwindung",
  "Gehstock",
  "Geisterstunde",
  "Gelenkschmerz",
  "Gemahlin",
  "Geschichte",
  "Geschirrtuch",
  "Gewissenskonflikt",
  "Glasfenster",
  "Glasflasche",
  "Glossar",
  "Glossareintrag",
  "Grammatik",
  "Gurkenglas",
  "Gusseisen",
  "Haaransatz",
  "Haarkamm",
  "Halsband",
  "Halstuch",
  "Handfeger",
  "Handgelenk",
  "Handgelenksfraktur",
  "Handkante",
  "Handlung",
  "Handlungsbedarf",
  "Handschmeichler",
  "Handwurzel",
  "Hausstaub",
  "Headset",
  "Heilwirkung",
  "Heizung",
  "Hemdkragen",
  "Herbststurm",
  "Hersteller",
  "Herzklappe",
  "Hessen",
  "Himmelblau",
  "Hinterrad",
  "Holzklotz",
  "Hosenbein",
  "Hosenknopf",
  "Impressum",
  "Impulskauf",
  "Informatik",
  "Innovation",
  "Inselwissen",
  "Internet",
  "Irrgarten",
  "Irrtum",
  "Irrweg",
  "Jahrmarkt",
  "Jalousie",
  "Januar",
  "Jodler",
  "Jodtablette",
  "Jogging",
  "Kabelkanal",
  "Kabelrolle",
  "Kaffeebohne",
  "Kaffeefilter",
  "Kaminsims",
  "Karabiner",
  "Karaffe",
  "Karnivore",
  "Karotte",
  "Karottenkuchen",
  "Kartenleser",
  "Karussell",
  "Katastrophe",
  "Kellerraum",
  "Keramikfliese",
  "Kerzenlicht",
  "Kettenglied",
  "Kettenkarussell",
  "Kinofilm",
  "Klaviersaite",
  "Klebestreifen",
  "Kleiderschrank",
  "Kleidung",
  "Kleister",
  "Kletterknoten",
  "Kletterseil",
  "Klodeckel",
  "Klopfzeichen",
  "Klorolle",
  "Knautschzone",
  "Kniekehle",
  "Knotenkunde",
  "Koffergriff",
  "Kofferraum",
  "Kombizange",
  "Komiker",
  "Kompand",
  "Kompass",
  "Konsortium",
  "Konstruktion",
  "Konzept",
  "Kraftfahrzeug",
  "Krawattennadel",
  "Kreidestrich",
  "Kreisel",
  "Kugelschreiber",
  "Kunststofffaser",
  "Kuppeldach",
  "Kupplung",
  "Lagerfeuer",
  "Lagerregal",
  "Lampenschirm",
  "Landhaus",
  "Laufrad",
  "Lebensabschnitt",
  "Lebensfreude",
  "Leberfleck",
  "Lederjacke",
  "Leitersprosse",
  "Leitung",
  "Leitungsfunktion",
  "Lexikon",
  "Lichtschalter",
  "Liebhaber",
  "Lifestyle",
  "Locher",
  "Luftpumpe",
  "Maibowle",
  "Makellosigkeit",
  "Mantel",
  "Manteltasche",
  "Manufaktur",
  "Marketing",
  "Matratzenschoner",
  "Mausefalle",
  "Mausohr",
  "Mechanik",
  "Meditation",
  "Mengenlehre",
  "Merkzettel",
  "Messbecher",
  "Metzgerei",
  "Mietwagen",
  "Mineralien",
  "Mobiltelefon",
  "Mondschein",
  "Morgenmantel",
  "Motivation",
  "Musikbox",
  "Muskelkrampf",
  "Nasenhaar",
  "Nasenspitze",
  "Nisthilfe",
  "Nistkasten",
  "Nitrat",
  "Nordfriese",
  "Nordlicht",
  "November",
  "Nudelsieb",
  "Nummernkonto",
  "Oberarm",
  "Oberarmknochen",
  "Oberschenkel",
  "Oktober",
  "Opernglas",
  "Orangat",
  "Orangenschale",
  "Orgelmusik",
  "Ornament",
  "Osterei",
  "Ostfriese",
  "Oxymoron",
  "Pannenhilfe",
  "Papierkorb",
  "Pappplakat",
  "Parlament",
  "Parlamentswahl",
  "Pausenclown",
  "Pedelec",
  "Personalabteilung",
  "Pferdeschwanz",
  "Pflaumenmus",
  "Plaudertasche",
  "Polizei",
  "Polizeieinsatz",
  "Polizeistreife",
  "Polizeiwache",
  "Portemonnaie",
  "Porzellan",
  "Prinzip",
  "Produkt",
  "Profession",
  "Professor",
  "Prozentangabe",
  "Psychologie",
  "Pustekuchen",
  "Qualifikation",
  "Quarktasche",
  "Quatschkopf",
  "Quietscheente",
  "Quizfrage",
  "Radnabe",
  "Rasiercreme",
  "Ratschlag",
  "Rattenschwanz",
  "Rechtschreibung",
  "Referenzen",
  "Regelung",
  "Regenschirm",
  "Reihenhaus",
  "Reitstiefel",
  "Rennauto",
  "Rennrad",
  "Rennradfelge",
  "Renovierung",
  "Restaurant",
  "Revolverheld",
  "Rhabarber",
  "Rhabarberbaiser",
  "Rhinozeros",
  "Risikominimierung",
  "Ritterhelm",
  "Rohstoff",
  "Rollmops",
  "Sammelstelle",
  "Sattel",
  "Scheibenwischer",
  "Schiff",
  "Schifffahrt",
  "Schmerztablette",
  "Schnabel",
  "Schnabeltasse",
  "Schnarchen",
  "Schneeflocke",
  "Schnittblume",
  "Schnitzel",
  "Schornsteinfeger",
  "Schraubendreher",
  "Schreibschrift",
  "Schreibtisch",
  "Schuhsohle",
  "Schwung",
  "Seifenschale",
  "Seifenspender",
  "Seilbahn",
  "Sektglas",
  "September",
  "Sessellehne",
  "Sicherheitsanalyse",
  "Simulation",
  "Situation",
  "Sitzgelegenheit",
  "Sitzgurt",
  "Sitzheizung",
  "Sofakissen",
  "Sojabohne",
  "Solarplexus",
  "Solarzelle",
  "Sommeranfang",
  "Sommerloch",
  "Sommerregen",
  "Sortiment",
  "Speiche",
  "Speichenbruch",
  "Spiegelei",
  "Spiegelschrank",
  "Spielregel",
  "Sportschuh",
  "Steckdose",
  "Steckdosenleiste",
  "Sternzeichen",
  "Stimmung",
  "Stimmungsschwankung",
  "Storchenschnabel",
  "Strafvollzug",
  "Strassenbahn",
  "Strassenlaterne",
  "Streitaxt",
  "Stromkabel",
  "Stummelschwanz",
  "Substantiv",
  "Suppenteller",
  "Synonym",
  "Tangente",
  "Tapete",
  "Tapetenkleister",
  "Tatsache",
  "Teekesselchen",
  "Teenieschwarm",
  "Teetasse",
  "Tellerrand",
  "Teppichfransen",
  "Theater",
  "Theaterkarte",
  "Theaterkritiker",
  "Tierlexikon",
  "Tigertatze",
  "Tischplatte",
  "Tochter",
  "Tragetasche",
  "Trennwand",
  "Turnbeutel",
  "Uhrzeiger",
  "Umzugskarton",
  "Unsinn",
  "Unterarm",
  "Unterhaltung",
  "Unterhose",
  "Unterschrift",
  "Untersuchung",
  "Urheberrecht",
  "Veganer",
  "Vegetarier",
  "Vegetation",
  "Vehemenz",
  "Verkauf",
  "Verstand",
  "Vielfahrer",
  "Vitamin",
  "Vollbart",
  "Voltigieren",
  "Vorderrad",
  "Vorfahre",
  "Vorfahrt",
  "Vorlesung",
  "Vorrang",
  "Vorschlag",
  "Vorsorge",
  "Vorsorgeuntersuchung",
  "Vorstellung",
  "Vorteil",
  "Wagenrennen",
  "Wahnsinn",
  "Waldzwerg",
  "Walzer",
  "Walzwerk",
  "Wandelhalle",
  "Wanderstock",
  "Wanduhr",
  "Wappenkunde",
  "Warnung",
  "Wasserhahn",
  "Weihnachten",
  "Weinglas",
  "Weisheit",
  "Weitblick",
  "Werbeagentur",
  "Werkzeug",
  "Westfriese",
  "Wetterzone",
  "Whiskeyfass",
  "Wikinger",
  "Wirkung",
  "Wolljacke",
  "Xylitschokolade",
  "Yachthafen",
  "Zahnfee",
  "Zahnschmelz",
  "Zargenspanner",
  "Zargenspreizer",
  "Zeckenzange",
  "Zeitalter",
  "Zeitschleife",
  "Zeitung",
  "Zeitungsanzeige",
  "Zeitungsseite",
  "Zentrifugalkraft",
  "Zentrifuge",
  "Zettelwirtschaft",
  "Zigarrenkiste",
  "Zimmerdecke",
  "Zimmerecke",
  "Zinnfigur",
  "Zitronat",
  "Zoologe",
  "Zoologie",
  "Zwiebelschale",
];

  return a[ Math.floor( Math.random() * a.length )];
};

Hmi.prototype.getResult = function() {
  var result = '';
  var incorrect = 0;
  for (var i=0; i<this.word.length; ++i) {
    var char=this.word[i];
    if (this.guesses.includes(char.toLowerCase())) {
      result += char;
    }
    else {
      result += '_';
      incorrect++;
    }
  }
  return { 'result': result, 'incorrect': incorrect };
};

Hmi.prototype.handler = function ( ev ) {
  var guess = null;
  for(var i=0; i<this.keyboard.length && guess==null; ++i) {
    if (this.keyboard[i].button.id == ev.currentTarget.snap) {
      guess = this.keyboard[i].text.attr('text');
      if (!this.guesses.includes(guess)) {
        this.guesses += guess;
        if (!this.word.toLowerCase().includes(guess)) {
          this.falseAttempts++;
          this.keyboard[i].back.attr({ 'fill': 'red' });
        }
        else {
          this.keyboard[i].back.attr({ 'fill': 'lightgreen' });
        }
        this.update();
      }
    }
  }
};

Hmi.prototype.resize = function () {
  var offsetHeight = 132,
    offsetWidth = 48,
    availableWidth = window.innerWidth - offsetWidth,
    availableHeight = window.innerHeight - offsetHeight;
  this.size = availableWidth/availableHeight < this.panel.x/this.panel.y ?
    { x: availableWidth, y: availableWidth * this.panel.y/this.panel.x } :
    { x: availableHeight * this.panel.x/this.panel.y, y: availableHeight } ;
  $('#board').attr({ width: ''+this.size.x, height: ''+this.size.y });
  var boardMarginTop = (availableHeight - this.size.y) / 2;
  $('#board').css({ 'margin-top': boardMarginTop + 'px' });
  $('#selectmenu').css({ 'margin-top': boardMarginTop + 'px' });
  $('#game-page').css({
    'background-size': 'auto ' + (this.size.x * 9 / 6) + 'px',
  });
};

Hmi.prototype.initGame = function () {
  this.falseAttempts = 0;
  for(var i=0; i<this.keyboard.length; ++i) {
    this.keyboard[i].back.attr({ 'fill': 'lightblue' });
  }
  this.guesses = '';
  this.word = this.getWord();
  this.update();
};

Hmi.prototype.init = function () {
  this.initGame();
  var $window = $(window);
  window.addEventListener("orientationchange", this.resize.bind( this ));
  $window.resize( this.resize.bind( this ) );
  $window.resize();
  this.update();
  $('#new').on( 'click', this.initGame.bind(this) );
};

Hmi.prototype.update = function() {
  var result = this.getResult();
  this.result.attr({ text: result['result'] });
  $('#myheader').html( "Galgenmännchen - Fehlversuche: " + this.falseAttempts );
  for(var i=0; i<this.gallows.length; ++i) {
    for(var j=0; j<this.gallows[i].length; ++j) {
      var op = i<this.falseAttempts+1 ? 1 : 0;
      this.gallows[i][j].attr({ opacity: op });
    }
  }
};

var g_Hmi;
$(document).ready( function () {
  g_Hmi = new Hmi();
  g_Hmi.init();
});
