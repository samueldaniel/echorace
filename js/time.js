var minutes_holder = 0;
var hours_holder = 0;
var start = 0;

function incrementMinutesAndHours()
{
  console.log("increment minutes and hours")
  minutes_holder++;
  $("#counter-mins").flipCounter("setNumber",minutes_holder);
  $("#counter-secs").flipCounter("setNumber",0);
  $("#counter-secs").flipCounter("startAnimation",
  {
                      number: 0, // the number we want to scroll from
                      end_number: 60, // the number we want the counter to scroll to
                      duration: 60000, // number of ms animation should take to complete
                      easing: false
                    });
  if (minutes_holder == 60)
  {
    minutes_holder = 0;
    hours_holder++;
    $("#counter-hrs").flipCounter("setNumber", hours_holder);
  } 
}

var timerInit = function() {

  $("#counter-secs").flipCounter({
          number:0, // the initial number the counter should display, overrides the hidden field
          format:".##",locale:"us",
          numIntegralDigits:2, // number of places left of the decimal point to maintain
            numFractionalDigits:0, // number of places right of the decimal point to maintain
            digitClass:"counter-digit", // class of the counter digits
            counterFieldName:"counter-value", // name of the hidden field
            digitHeight:40, // the height of each digit in the flipCounter-medium.png sprite image
            digitWidth:30, // the width of each digit in the flipCounter-medium.png sprite image
            imagePath:"img/flipCounter-medium.png", // the path to the sprite image relative to your html document
            easing: false, // the easing function to apply to animations, you can override this with a jQuery.easing method
            duration: 1000,
            onAnimationStarted:false, // call back for animation upon starting
            onAnimationStopped:incrementMinutesAndHours, // call back for animation upon stopping
            onAnimationPaused:false, // call back for animation upon pausing
            onAnimationResumed:false // call back for animation upon resuming from pause
          });

    $("#counter-mins").flipCounter({
          number:0, // the initial number the counter should display, overrides the hidden field
            format:".##",locale:"us",
            numIntegralDigits:2, // number of places left of the decimal point to maintain
            numFractionalDigits:0, // number of places right of the decimal point to maintain
            digitClass:"counter-digit", // class of the counter digits
            counterFieldName:"counter-value", // name of the hidden field
            digitHeight:40, // the height of each digit in the flipCounter-medium.png sprite image
            digitWidth:30, // the width of each digit in the flipCounter-medium.png sprite image
            imagePath:"img/flipCounter-medium.png", // the path to the sprite image relative to your html document
            easing: false, // the easing function to apply to animations, you can override this with a jQuery.easing method
            onAnimationStarted:false, // call back for animation upon starting
            duration: 1000,
            onAnimationStopped:false, // call back for animation upon stopping
            onAnimationPaused:false, // call back for animation upon pausing
            onAnimationResumed:false // call back for animation upon resuming from pause
          });

    $("#counter-hrs").flipCounter({
          number:0, // the initial number the counter should display, overrides the hidden field
            numIntegralDigits:2, // number of places left of the decimal point to maintain
            numFractionalDigits:0, // number of places right of the decimal point to maintain
            digitClass:"counter-digit", // class of the counter digits
            counterFieldName:"counter-value", // name of the hidden field
            digitHeight:40, // the height of each digit in the flipCounter-medium.png sprite image
            digitWidth:30, // the width of each digit in the flipCounter-medium.png sprite image
            imagePath:"img/flipCounter-medium.png", // the path to the sprite image relative to your html document
            easing: false, // the easing function to apply to animations, you can override this with a jQuery.easing method
            duration: 1000,
            onAnimationStarted:false, // call back for animation upon starting
            onAnimationStopped:false, // call back for animation upon stopping
            onAnimationPaused:false, // call back for animation upon pausing
            onAnimationResumed:false // call back for animation upon resuming from pause
          });
}


$(document).ready(function() { timerInit(); })
