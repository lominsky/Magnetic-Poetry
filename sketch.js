var poems;
var menu;
function preload() {
  var url = './poems.json';
  poems = loadStrings(url);
}

var words = [];
var margin = 100;
var poet = null;
var defaultText = "I met a traveller from an antique land Who said Two vast and trunkless legs of stone Stand in the desert Near them on the sand Half sunk, a shattered visage lies whose frown And wrinkled lip and sneer of cold command Tell that its sculptor well those passions read Which yet survive, stamped on these lifeless things The hand that mocked them and the heart that fed And on the pedestal these words appear My name is Ozymandias king of kings Look on my works ye Mighty and despair Nothing beside remains Round the decay Of that colossal wreck boundless and bare The lone and level sands stretch far away";


function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#abcdef")

  menu = createSelect();
  menu.position(10, 10);

  poems = JSON.parse(poems);

  for(i in poems) {
    menu.option(i);
  }

  menu.changed(getWords);
 
  sample = defaultText.split(" ");
  getWords();
}

function getWords() {
  poet = poems[menu.value()];
  poet = JSON.parse(poet);
  createMagnets();
}

function logResults(json){
  console.log(json);
}

function getText() {
  var word = "";
  while(word == "") {
    var poemIndex = floor(random(poet.length));
    var poem = poet[poemIndex];
    var lineIndex = floor(random(poem.lines.length));
    var line = poem.lines[lineIndex];
    var line = line.replace(/[^a-zA-Z ]/g, "");
    console.log(line);
    line = line.split(" ");
    var wordIndex = floor(random(line.length));
    word = line[wordIndex];
  }
  words.push(createMagnet(random(margin, width-margin), random(margin, height-margin), word));
}

function createMagnets() {
  words = [];
  for(var i = 0; i < 20; i++) {
    getText();
  }
}

function draw() {
  background(240);
  for(i in words)
    words[i].display();
}

function mousePressed() {
  for(var i = words.length-1; i >= 0; i--) {
    if(words[i].containsMouse()) {
      var mouse = createVector(mouseX, mouseY);
      words[i].relativeMouse = createVector(words[i].pos.x, words[i].pos.y);
      words[i].relativeMouse.sub(mouse);
      var temp = words[i];
      words.splice(i, 1);
      words.push(temp);
      break;
    }
  }
}

function mouseReleased() {
  for(i in words) {
    words[i].relativeMouse = null;
  }
}

function mouseDragged() {
  for(i in words) {
    if(words[i].relativeMouse != null) {
      var mouse = createVector(mouseX, mouseY);
      mouse.add(words[i].relativeMouse);
      words[i].pos = mouse;
    }
  }
}

function createMagnet(x, y, word) {
  var obj = {}
  obj.word = word.toUpperCase();
  obj.fontSize = 26;
  obj.pos = createVector(x, y);
  obj.width = obj.word.length * 25;
  obj.height = obj.fontSize * 1.4;
  obj.relativeMouse = null;
  obj.display = function() {
    textSize(obj.fontSize);
    textAlign(CENTER);
    rectMode(CENTER);
    fill(0);
    rect(obj.pos.x+2, obj.pos.y - 10, obj.width, obj.height);
    obj.relativeMouse == null ? fill(255) : fill(250);
    rect(obj.pos.x, obj.pos.y - 12, obj.width, obj.height);
    fill(0);
    text(obj.word, obj.pos.x, obj.pos.y);
  }
  obj.containsMouse = function() {
    var top = obj.pos.y - obj.height/2;
    var bottom = top + obj.height;
    var left = obj.pos.x - obj.width/2;
    var right = left + obj.width;
    if(mouseX < left || mouseX > right || mouseY < top || mouseY > bottom)
      return false;
    return true;
  }

  return obj;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}