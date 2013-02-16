//if (Math.random() < 0.1) {
var babby=document.querySelectorAll("head")[0];
booty = [
  "<style type='text/css'>.john.babby{position:fixed;left:-240px;bottom:0;-webkit-transition:all 7s ease-in;} .john.babby:hover{left:-100px;}</style>",
  "<style type='text/css'>.john.babby{position: fixed;left: 120px;top: -210px;-webkit-transform: rotate(180deg);-webkit-transition: all 1s ease-in-out;} .john.babby:hover{top: -90px;-webkit-transform: rotate(160deg);}</style>"
];
babby.innerHTML = babby.innerHTML + booty[Math.floor(Math.random()*booty.length)]
babby=document.querySelectorAll("body")[0];
babby.innerHTML = babby.innerHTML+'<img src="http://images1.wikia.nocookie.net/__cb20101230092213/mspaintadventures/images/2/2a/John_Godtier_-_Hood_down.png" class="john babby" onclick="if (babby) {babby = false; booty.play();}">';
babby = true;
booty = [
  "http://a.tumblr.com/tumblr_mia5xn7HFj1r8rjvxo1.mp3", //booty
  "http://a.tumblr.com/tumblr_meetn1vdA21rmvgizo1.mp3", //doctor
  "http://a.tumblr.com/tumblr_mhg4z9l0TX1r1i0muo1.mp3", //doctor2
  "http://a.tumblr.com/tumblr_mia83hvK791qdqix8o1.mp3", //dootdoot
  "http://a.tumblr.com/tumblr_ma1fp93qjX1rvcsi4o1.mp3"  //duck
];
booty = new Audio(booty[Math.floor(Math.random()*booty.length)]);
//}
