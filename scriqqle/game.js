// letters and the frequency they should show up in
$letterBag = "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ     ";

function letterScore(letter) {
  if (letter == ' ') return 0;
  return [1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10][letter.charCodeAt(0)-65];
}

$tileSize = 54;

// store info about game
$tinybrowser = false;
$score = 0;
$timer = 0;
$wordScore = 0;
$highScore = 0;
$wordCount = 0;
$word = '';
$highWord = '';

$isTouchDevice = 'ontouchstart' in document.documentElement;

function initGame() {
  // Use space efficiently on small screens
  var screen;
  screen = [$('body').width(),$('body').height()];
  if (screen[0] < 8*$tileSize || screen[1] < 6*$tileSize) {
    // Really tiny screens like the 3DS
    $('body').addClass('tinybrowser');
    // Make the game easier for tiny boards
    $letterBag += "  ";
    $wordList += " A I";
    screen = [$('body').width(),$('body').height()];
  }
  var width = Math.floor(screen[0]/$tileSize);
  if (width > 14) width = 14;
  if (width < 6) width = 6;
  var height = Math.floor(screen[1]/$tileSize)-2;
  if (height > 8) height = 8;
  if (height < 4) height = 4;
  if ($('h1').outerHeight(true)+(height+2)*$tileSize > screen[1]) {
    $('h1').hide();
  }
  resetBoard(width,height);
  //$('#play_area').delegate('.tile','click',tileClick);
  if ($isTouchDevice) {
    $('#play_area').on({
      'touchstart':tileClick
    },'.tile');
    $('#word').on({
      'touchstart':submitWord
    });
  } else {
    $('#play_area').on({
      'click':tileClick
    },'.tile');
    $('#word').on({
      'click':submitWord
    });
  }
  $('#game').fadeIn(2000);
  setInterval(updateTimer,1000);
}

function resetBoard(cols,rows) {
  var play_area = $('#play_area');
  play_area.html('').css({'height':rows*$tileSize});
  $('#game').css({'width':cols*$tileSize});
  $score = 0;
  $timer = 0;
  $highScore = 0;
  $wordScore = 0;
  $word = '';
  $highWord = '';
  for (var x=0; x<cols; x++) {
    var col = $("<div class='col'></div>");
    var col_tiles = [];
    play_area.append(col);
    for (var y=0; y<rows; y++) {
      var tile = randomTile();
      col.append(tile);
    }
  }
  updateWord();
  updateScore();
}

function flash(elem) {
  elem.addClass('error');
  setTimeout(function(){elem.removeClass('error');},100);
}

function tileClick() {
  var tile = $(this);
  if (!tile.hasClass('selected') && !tile.hasClass('killm8')) {
    tile.addClass('selected');
    var letter = tile.data('letter');
    $word = $word + letter;
    $wordScore = $wordScore + letterScore(letter);
    updateWord();
  }
}

function connectedGraph() {
  // Oh boy! a graph traversal!
  var unvisited = [];
  var queue = [];
  $('#play_area .col').each(function(x,col) {
    $(col).children('.tile').each(function(y,tile) {
      if ($(tile).hasClass('selected')) unvisited.push(x + ' ' + y);
    });
  });
  if (unvisited.length == 0) return false;
  queue.push(unvisited.pop());
  while (queue.length > 0) {
    var n = queue.shift().split(' ');
    var x = parseInt(n[0]);
    var y = parseInt(n[1]);
    for (var i=-1;i<=1;i++) {
      for (var j=-1;j<=1;j++) {
        n = unvisited.indexOf((x+i) + ' ' + (y+j));
        if (n != -1) queue.push(unvisited.splice(n,1)[0]);
      }
    }
  }
  // Queue is empty. No unvisited nodes means traversed the whole graph
  return unvisited.length == 0;
}

function validateWord() {
  var re = new RegExp('\\b'+$word.replace(/ /g,'\\w')+'\\b', 'im');
  $word = $wordList.match(re);
  if ($word) {
    $word = $word[0].toUpperCase();
  } else {
    $word = '';
  }
  updateWord();
  return $word.length > 0;
}

function submitWord() {
  $('#word').addClass('selected');
  var valid = true;
  if (!validateWord()) {
    flash($('#word'));
    valid = false;
  }
  if (!connectedGraph()) {
    flash($('#play_area .selected.tile'));
    valid = false;
  }
  if (valid) {
    $wordScore *= $word.length;
    $score += $wordScore;
    if ($wordScore > $highScore) {
      $highScore = $wordScore;
      $highWord = $word;
    }
    $wordCount += 1;
    updateScore();
    var newTiles = [];
    $('.selected.tile')
      .removeClass('selected')
      .addClass('killm8')
      .each(function(i,e){
        var tile = randomTile().css('display','none');
        newTiles.push(tile[0]);
        $(e).parent().append(tile);
      })
      .slideUp(500,function(){
        $('.killm8').remove();
        $(newTiles).fadeIn(500);
      });
    $('#history')
      .css({'margin-top':-1*$tileSize})
      .animate({'margin-top':0},500)
      .prepend('<div class="item">'+$('#word')[0].innerHTML+'</div>');
  }
  $('.selected.tile').removeClass('selected');
  $word = '';
  $wordScore = 0;
  updateWord();
  $('#word').removeClass('selected');
}

function updateWord() {
  $('#word .text').text($word.replace(/ /g,'?'));
  if ($word.length > 0) {
    $('#word .score').text($wordScore * $word.length);
  } else {
    $('#word .score').text('');
  }
  if ($highWord.length > 0) {
    $('#high_score .tooltip').text($highWord);
  } else {
    $('#high_score .tooltip').text('High Score');
  }
}

function updateScore() {
  $('#score .value').text($score);
  $('#high_score .value').text($highScore);
  $('#word_count .value').text($wordCount);
}

function updateTimer() {
  $timer += 1;
  $('#timer .value').text(Math.floor($timer/60) + ':' + ($timer%60<10 ? '0'+($timer%60) : ($timer%60)));
}

function randomTile() {
  var n = Math.floor(Math.random()*$letterBag.length);
  var letter = $letterBag.substring(n,n+1);
  if (letter == 'Q') letter = 'Qu';
  var elem = $('\
<div class="tile grey_div">\
  <span class="text">' + letter + '</span>\
  <span class="score">' + letterScore(letter) + '</span>\
</div>');
  elem.data('letter', letter);
  return elem;
}

$(initGame);
