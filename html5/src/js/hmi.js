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

const KEYS = [ 'qwertyuiop', 'asdfghjkl', 'zxcvbnm' ];

function Hmi() {
  this.word = 'shortsightedness';
  this.guesses = '';  
  this.panel = { x: 320, y: 460 };
  this.paper = Raphael( 'board', this.panel.x, this.panel.y);
  this.paper.setViewBox(0, 0, this.panel.x, this.panel.y, false );
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
        .attr({ 'fill': 'none', 'stroke-width': 10 }),
    ], [
      this.paper.path( 'M110,80l-60,60l0,-60l120,0' )
        .attr({ 'fill': 'none', 'stroke-width': 8 }),
    ], [
      this.paper.path( 'M170,80l0,60m-3,-3l6,0m-6,-3l6,0m-6,-3l6,0' )
        .attr({ 'fill': 'none', stroke: 'maroon', 'stroke-width': 3, 'stroke-linecap': 'round' }),
      this.paper.circle( 170, 150, 10 ).transform('s0.75,1')
        .attr({ 'fill': 'none', stroke: 'maroon', 'stroke-width': 2 }),
    ], [
      this.paper.circle( 170, 140, 20 )
        .attr({ 'fill': 'orange', 'stroke-width': 4 }),
      /* eyes */
      this.paper.circle( 163, 135, 2 )
        .attr({ 'fill': 'black', 'stroke-width': 4 }),
      this.paper.circle( 177, 135, 2 )
        .attr({ 'fill': 'black', 'stroke-width': 4 }),
      /* mouth */
      this.paper.circle( 170, 148, 4 )
        .attr({ 'fill': 'none', 'stroke-width': 2 }),
    ], [
      this.paper.path( 'M140,150l30,10l0,32l-30,30l-10,-10' )
        .attr({ 'fill': 'none', 'stroke-width': 4 }),
    ], [
      this.paper.path( 'M200,150l-30,10l0,32l30,30l10,-10' )
        .attr({ 'fill': 'none', 'stroke-width': 4 }),
      this.paper.circle( 170, 140, 20 )
        .attr({ 'fill': 'lightgreen', 'stroke-width': 4 }),
      /* eyes */
      this.paper.path( 'M158,130l10,10m0,-10l-10,10' )
        .attr({ 'fill': 'none', 'stroke-width': 3 }),
      this.paper.path( 'M172,130l10,10m0,-10l-10,10' )
        .attr({ 'fill': 'none', 'stroke-width': 3 }),
      /* mouth */
      this.paper.path( 'M159,150l25,-6' )
        .attr({ 'fill': 'none', 'stroke-width': 3 }),
    ]
  ];
  this.keyboard = [];
  var keyboardPosY = 350;
  for(var r=0; r<KEYS.length; ++r) {
    for(var i=0; i<KEYS[r].length; ++i) {
      this.keyboard[this.keyboard.length] = {
        back: this.paper.circle( 15+16*r+32*i, keyboardPosY+r*30, 14 )
          .attr({ 'fill': 'lightblue', stroke: 'white', 'stroke-width': 3 }),
        text: this.paper.text(15+16*r+32*i, keyboardPosY+r*30,
          KEYS[r][i]).attr({ 'font-size': 20}),
        button: this.paper.circle( 15+16*r+32*i, keyboardPosY+r*30, 14 )
          .attr({ 'fill': 'white', stroke: 'black',
            'stroke-width': 1 , 'fill-opacity': 0.01 }),
      }
      this.keyboard[this.keyboard.length-1].button.click( this.handler.bind(this) );
    }
  }
  this.result = this.paper.text(160, 40,
    '_ho_t_i_ht_dn___').attr({ 'font-size': 30, 'letter-spacing': 3 })
};

Hmi.prototype.getWord = function() {
var a = [
  "account",
  "action",
  "addition",
  "adjustment",
  "advantage",
  "advertisement",
  "agreement",
  "amount",
  "amusement",
  "animal",
  "answer",
  "appearance",
  "application",
  "apprentice",
  "approval",
  "argument",
  "armpit",
  "assistance",
  "association",
  "attack",
  "attempt",
  "attention",
  "attraction",
  "authority",
  "autumn",
  "avenue",
  "backpack",
  "backscratcher",
  "backstage",
  "bagpipe",
  "balance",
  "banana",
  "barrier",
  "basket",
  "beginner",
  "behaviour",
  "belief",
  "bicycle",
  "booklet",
  "bottle",
  "branch",
  "breath",
  "bridge",
  "brother",
  "bucket",
  "building",
  "business",
  "butter",
  "button",
  "calendar",
  "camera",
  "canvas",
  "carriage",
  "chance",
  "change",
  "cheese",
  "chemical",
  "children",
  "circle",
  "coffee",
  "collar",
  "collective",
  "colour",
  "comfort",
  "command",
  "committee",
  "community",
  "company",
  "comparison",
  "competition",
  "complex",
  "computer",
  "condition",
  "connection",
  "constant",
  "continent",
  "contribution",
  "control",
  "copper",
  "costume",
  "cotton",
  "country",
  "craftsman",
  "craftsmanship",
  "credit",
  "croquet",
  "curtain",
  "cushion",
  "customization",
  "damage",
  "danger",
  "daughter",
  "decision",
  "definition",
  "degree",
  "design",
  "desire",
  "desktop",
  "dessous",
  "destruction",
  "detail",
  "development",
  "dictionary",
  "digestion",
  "direction",
  "discovery",
  "discussion",
  "disease",
  "distance",
  "distribution",
  "district",
  "division",
  "document",
  "domain",
  "drawer",
  "driving",
  "dwarve",
  "education",
  "effect",
  "electron",
  "elephant",
  "engine",
  "engineering",
  "establishment",
  "example",
  "exception",
  "exchange",
  "execution",
  "exercise",
  "existence",
  "expansion",
  "experience",
  "expert",
  "explorer",
  "expression",
  "family",
  "father",
  "feather",
  "feeble",
  "feeling",
  "female",
  "feminist",
  "fiction",
  "finger",
  "fishhook",
  "flight",
  "flower",
  "frequency",
  "friend",
  "future",
  "garden",
  "general",
  "government",
  "grandchild",
  "grandchildren",
  "grandma",
  "growth",
  "hammer",
  "handle",
  "harbour",
  "harmony",
  "harness",
  "hearing",
  "history",
  "holiday",
  "hollow",
  "horizon",
  "hospital",
  "hostel",
  "household",
  "housesitter",
  "humour",
  "hyphen",
  "images",
  "immunity",
  "impulse",
  "increase",
  "independence",
  "individual",
  "industry",
  "insect",
  "instruction",
  "instrument",
  "insurance",
  "integration",
  "interest",
  "invention",
  "island",
  "journal",
  "journey",
  "jukebox",
  "kettle",
  "knight",
  "knowledge",
  "landscape",
  "language",
  "learning",
  "leather",
  "length",
  "letter",
  "library",
  "lingerie",
  "liquid",
  "living",
  "location",
  "machine",
  "magazine",
  "manager",
  "marine",
  "market",
  "marriage",
  "material",
  "matter",
  "maximum",
  "measure",
  "measurement",
  "medicine",
  "meeting",
  "memory",
  "middle",
  "military",
  "minimum",
  "minute",
  "misunderstanding",
  "moment",
  "monastery",
  "monkey",
  "morning",
  "mother",
  "motion",
  "mountain",
  "multiplication",
  "muscle",
  "narrow",
  "nation",
  "nature",
  "necessaire",
  "necessity",
  "needle",
  "newspaper",
  "normal",
  "nugget",
  "number",
  "observation",
  "office",
  "operation",
  "opinion",
  "opposite",
  "orange",
  "organization",
  "ornament",
  "oxygen",
  "oxymoron",
  "painter",
  "pajama",
  "parallel",
  "parcel",
  "payment",
  "pencil",
  "periode",
  "person",
  "personality",
  "phonebook",
  "physics",
  "picture",
  "pleasure",
  "plough",
  "pocket",
  "poison",
  "polish",
  "politics",
  "porter",
  "portrait",
  "position",
  "possibility",
  "potato",
  "powder",
  "presence",
  "printmedia",
  "prison",
  "probability",
  "process",
  "producer",
  "product",
  "profession",
  "professor",
  "profit",
  "program",
  "property",
  "protection",
  "protest",
  "punishment",
  "purpose",
  "puzzle",
  "quality",
  "question",
  "reaction",
  "reading",
  "reason",
  "receipt",
  "recipe",
  "recipient",
  "record",
  "reference",
  "regret",
  "relation",
  "religion",
  "request",
  "resident",
  "respect",
  "responsibility",
  "reward",
  "rhinoceros",
  "rhythm",
  "rookie",
  "safety",
  "schnapps",
  "school",
  "science",
  "scissors",
  "scratch",
  "search",
  "season",
  "second",
  "secret",
  "secretary",
  "selection",
  "sentence",
  "separation",
  "servant",
  "service",
  "shadow",
  "shortsightedness",
  "silver",
  "simplicity",
  "sister",
  "slackline",
  "sneeze",
  "society",
  "speciality",
  "spelling",
  "sphinx",
  "sponge",
  "sportsman",
  "sportsmanship",
  "spring",
  "square",
  "squareroot",
  "stalemate",
  "statement",
  "station",
  "sticker",
  "stitch",
  "stocking",
  "stomach",
  "stranger",
  "street",
  "strength",
  "stretch",
  "stronghold",
  "structure",
  "substance",
  "substraction",
  "suggestion",
  "summer",
  "support",
  "surprise",
  "swashbuckler",
  "sweets",
  "swimsuit",
  "swimwear",
  "swordsman",
  "system",
  "tattoo",
  "teacher",
  "teaching",
  "telephone",
  "tendency",
  "theory",
  "thought",
  "thread",
  "threat",
  "throat",
  "thumbscrew",
  "thunder",
  "ticket",
  "tomorrow",
  "tongue",
  "transaction",
  "translation",
  "transmission",
  "transplant",
  "transport",
  "treasure",
  "triangle",
  "trouble",
  "trousers",
  "umbrella",
  "university",
  "update",
  "vehicle",
  "vessel",
  "victory",
  "violence",
  "waiter",
  "weather",
  "weight",
  "whistle",
  "window",
  "winter",
  "witchcraft",
  "worker",
  "worthlessness",
  "wristwatch",
  "writing",
  "yellow",
  "yesterday",
  "zigzag",
  "zombie"
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
    if (this.keyboard[i].button.id == ev.currentTarget.raphaelid) {
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
  var offsetHeight = 64,
    availableWidth = window.innerWidth - 64,
    availableHeight = window.innerHeight - offsetHeight;
  this.size = availableWidth/availableHeight < this.panel.x/this.panel.y ?
    { x: availableWidth, y: availableWidth * this.panel.y/this.panel.x } :
    { x: availableHeight * this.panel.x/this.panel.y, y: availableHeight } ;
  this.paper.setSize( this.size.x, this.size.y );
  this.paper.setViewBox( 0, 0, this.panel.x, this.panel.y, false );
  var boardMarginTop = (availableHeight - this.size.y) / 2;
  $('#board').css({ 'margin-top': boardMarginTop + 'px' });
  $('#selectmenu').css({ 'margin-top': boardMarginTop + 'px' });
  $('#game-page').css({
    'background-size': 'auto ' + (this.size.x * 9 / 6) + 'px',
  });
  var size = (this.size.x + this.size.y) / 2 / 9;
  var minSize = 60;
  var iconSize = size < minSize ? minSize : size;
  var maxSize = 120;
  iconSize = maxSize < iconSize ? maxSize : iconSize;
  $('#customMenu').css({
    'width': iconSize+'px', 'height': iconSize+'px',
    'background-size': iconSize+'px ' + iconSize+'px',
  });
  var backAttributes = {
    'width': iconSize+'px', 'height': iconSize+'px',
    'background-size': iconSize+'px ' + iconSize+'px',
  };
  $('#customBackRules').css(backAttributes);
  $('#customBackAbout').css(backAttributes);
};

Hmi.prototype.initGame = function () {
  this.falseAttempts = 0;
  for(var i=0; i<this.keyboard.length; ++i) {
    this.keyboard[i].back.attr({ 'fill': 'lightblue' });
  }
  this.guesses = '';
  this.word = this.getWord();
  this.update();
  $('#left-panel').panel('close');
};

Hmi.prototype.init = function () {
  this.initGame();
  var $window = $(window);
  window.addEventListener("orientationchange", this.resize.bind( this ));
  $window.resize( this.resize.bind( this ) );
  $window.resize();
  this.update();
  $('#restart').on( 'click', this.initGame.bind(this) );
};

Hmi.prototype.update = function() {
  var result = this.getResult();
  this.result.attr({ text: result['result'] });
  $('#myheader').html( "Hangman - incorrect guesses: " + this.falseAttempts );
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
