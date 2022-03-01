const buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var soundToPlay; //keeps track of what sound needs to play
var level = 0; //keeps track of the level;
var userClickIndex = 0; //used for comparing the correct index in gamePattern and userClickedPattern

var sequenceCounter = 0; //only used for flashing the colors in the correct order

//detects user clicked colours
$(".btn").click(function(){

  //get button colour and add to the user pattern
  var userChosenColor = $(this).attr("id");
  //animate
  $(this).fadeOut(100).fadeIn(100);
  animatePress(userChosenColor);

  //add chosen colour to array
  userClickedPattern.push(userChosenColor);

  //audio play
  soundToPlay = new Audio("sounds/" + userChosenColor + ".mp3");
  soundToPlay.play();

  userClickIndex += 1;

  checkAnswer(userClickIndex  - 1);
});

//chososes next colour in sequence
function nextSequence(){
  var randomNumber = (Math.floor(Math.random() * 4)); //number between  0 and 3

  //use the random number to choose a colour
  var randomChosenColor = buttonColors[randomNumber];
  //add to the array
  gamePattern.push(randomChosenColor);

  sequenceCounter = 0;
  animateSelection(randomChosenColor);

  //increment level and update h1
  level += 1;
  $("h1").text("Level " + level);

  //reset user clicks
  userClickIndex = 0;
  userClickedPattern = [];
}

function animateSelection(currentColor) {         //"loop function" to flash the game sequence
  setTimeout(function() {   //  call a 500ms timeout

    //flash button
    $("#" + gamePattern[sequenceCounter]).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100); //currentcolor
    animatePress(gamePattern[sequenceCounter]);

    //audio play
    soundToPlay = new Audio("sounds/" + gamePattern[sequenceCounter] + ".mp3");
    soundToPlay.play();

    sequenceCounter++;
    if (sequenceCounter < gamePattern.length) {
      animateSelection(gamePattern[sequenceCounter]);
    }
  }, 500)
}

function animatePress(currentColor){
  $("." + currentColor).addClass("pressed").delay(100).queue(function(next){
    $(this).removeClass("pressed");
    next();
  });
}

function checkAnswer(currentClick){
  if(gamePattern[currentClick] === userClickedPattern[currentClick]){
    console.log("YES");
    if(currentClick === (level - 1)){
      setTimeout(function () {
                nextSequence();
              }, 1000);
    }
  }
  else{
    console.log("NO");
    //ADD logic for losing - reset game
    $("body").addClass("game-over").delay(200).queue(function(next){
      $(this).removeClass("game-over");
      next();
    });
    $("h1").text("Game Over, Press Any Key to Restart");
    //reset all the values and arrays for game logic
    level = 0;
    sequenceCounter = 0;
    gamePattern = [];
    userClickedPattern = [0];
  }
}

//wait for user to start game the start of the game
$(document).keypress(function(){
  if(level === 0){
    nextSequence();
  }

});
