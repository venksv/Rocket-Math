

const EASY = 0,
      HARD = 1;

var operation = {
    "+" : add,
    "-" : subtract,
    "*" : multiply,
    "÷" : divide
};

var randLimit = 50; //Default
var timeLimit = 20, quesAttempt = 0,
    corrAnswers = 0, userName = '', sign = '+',
    difficultyLevel = HARD;
var startTime, opList, secondsLeft = 0;
var myTimer;

//FUNCTIONS
function Timer() {
    var currTime = new Date();
    var timeDiff = Math.floor((currTime - startTime)/1000);
    secondsLeft = timeLimit - timeDiff;

    if (secondsLeft <= 0) {
        clearInterval(myTimer);
        //$("#message").text("00:00");
        $("#message").text("Time's Up!!")
        $("li #answer").last().prop("disabled", "disabled");
        $("#run").prop("disabled", "");

        // $("#results").scrollIntoView();
        $('html, body').animate({
            scrollTop: $("#results").offset().top
        }, 1000);

        if (corrAnswers === quesAttempt) {
            $("#results").text("CONGRATULATIONS " + userName + "!! You answered all " + corrAnswers.toString() + " questions correctly!! Well done!!");
        } else {
            $("#results").text("UH-OH " + userName + "!! You only answered " + corrAnswers.toString() + " out of " + quesAttempt.toString() + " questions correctly. Keep at it!!");
        }
        // $("#corrAns").text(corrAnswers.toString());
        // $("#quesAttempt").text(quesAttempt.toString());

    } else {
        if (secondsLeft < 10) {
            $("#message").text("00:0"+secondsLeft.toString());
        } else {
            $("#message").text("00:"+secondsLeft.toString());
        }
    }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function add(op1, op2) {
    return (op1 + op2);
}

function subtract(op1, op2) {
    return (op1 - op2);
}

function multiply(op1, op2) {
    return (op1 * op2);
}

function divide(op1, op2) {
    return (round(op1/op2, 2));
}

function isDupe(op1, op2, opPairs) {
// Check if exists in Set. If exists, return True.
// If not exists, add to Set. Return False.
    if (opPairs.has(JSON.stringify([op1, op2]))) {
        // Dupe found.
        console.log("Dupe found - " + op1.toString() + ", " + op2.toString());
        return true;
    }
    else {
        //New pair.
        console.log("New pair - " + op1.toString() + ", " + op2.toString());
        opPairs.add(JSON.stringify([op1, op2]));
        return false;
    }
}

function generateNumbers() {

    op1 = Math.floor(Math.random() * randLimit);
    op2 = Math.floor(Math.random() * randLimit);

    // For EASY setting, ensure subtraction and division have +ve, >1
    // answers respectively.
    if ((op1 < op2) && difficultyLevel === EASY) {
        //Swap variables
        [op1, op2] = [op2, op1];
    }

    // Check for 0 for division
    if (op2 === 0 && sign === '/') {
        console.log("0 found for op2 ... skipping");
        return(generateNumbers());
    }

    // Check for dupes.
    if (isDupe(op1, op2, opList)) {
        return(generateNumbers());
    } else {
        return {op1: op1, op2: op2};
    }
}

function setDifficultyParams(diffLevel) {
    difficultyLevel = diffLevel;

    if (sign === "+" || sign === "-")
        if (difficultyLevel === EASY)
            randLimit = 10;
        else
            randLimit = 50;
    else
        if (difficultyLevel === EASY)
            randLimit = 5;
        else
            randLimit = 20;
}

function isCorrect(op1, op2, answer, operation) {
    console.log("Op1: " + op1.toString() + ", Op2: " + op2.toString() + ", Answer: " + answer.toString() + ", Opn: " + operation);
    if (answer === operation(op1, op2)) {
        return true;
    } else {
        return false;
    }
}

function resetRun() {
    quesAttempt = 0;
    corrAnswers = 0;
    secondsLeft = 0;
    opList = new Set();

    clearInterval(myTimer);
    myTimer = 0;
    $("#message").text("");
    $("#results").text("");
}

function resetGame() {
    resetRun();

    timeLimit = 20;
    userName = '';
    sign = '+';

    $("ul").html("");
    $("#run").prop("disabled", "");
    $("#name").val("");
    $("#name").focus();
    $("#opn").val("+");
    $("#time").val("20");
    $("#hard").trigger("click");
}

//EVENT HANDLERS
$("#name").on("focusout", function(){
    userName = $(this).val();
    // console.log("Name: " + userName);
});

$("#opn").on("change", function(){
    sign = $(this).val();
});

$("#time").on("focusout", function(){
    //TBD: Check for no value.
    timeLimit = parseInt($(this).val());
    // console.log("Time: " + timeLimit);
});

$("#easy").on("click", function() {
    $(this).addClass("selected");
    $("#hard").removeClass("selected");
    setDifficultyParams(EASY);
});

$("#hard").on("click", function() {
    $(this).addClass("selected");
    $("#easy").removeClass("selected");
    setDifficultyParams(HARD);
});

$("#run").on("click", function(){
    console.log("In run click event handler ...");

    resetRun();
    var numbers = generateNumbers();
    // $("li #num1").last().text(numbers.op1);
    // $("li #num2").last().text(numbers.op2);
    // $("li #sign").last().text(sign);

    var htmlString = "<li><span id='num1'>" + numbers.op1 + "</span> <span id='sign'>" + sign + "</span> <span  id='num2'>" + numbers.op2 + "</span> = <input id='answer' type='text'><span> <i id='status'></i></span></li>";

    // $("ul").append(htmlString);
    $("ul").html(htmlString);

    $("li #answer").last().focus();
    $(this).prop("disabled", "disabled");

    startTime = new Date();
    myTimer = setInterval(Timer, 1000);
});

$("#reset").on("click", function(){
    resetGame();
});

$("ul").on("keypress", "input[type='text']", (function(event) {
    if (event.which === 13) {
        // console.log("In input text event.");
        ++quesAttempt;
        var answer = parseInt($(this).val(), 10);
        var op1 = parseInt($("li #num1").last().text(), 10);
        var op2 = parseInt($("li #num2").last().text(), 10);
        // var sign = $("li #sign").last().text();
        // console.log("Num1: " + op1.toString() + ", Num2: " + op2.toString() + ", Sign: " + sign);
        $(this).prop("disabled", "disabled");

        var status = isCorrect(op1, op2, answer, operation[sign]);
        if (status) {
            $("li #status").last().addClass("fa fa-check fa-lg");
            ++corrAnswers;
        } else {
            $("li #status").last().addClass("fa fa-times fa-lg");
        }

        // console.log("Answer is correct: " + status);

        //Create a new li and add to ol only if more than 1s is left.
        // if (secondsLeft >= 1) {
            var newNumbers = generateNumbers();
            var htmlString = "<li><span id='num1'>" + newNumbers.op1 + "</span> <span id='sign'>" + sign + "</span> <span  id='num2'>" + newNumbers.op2 + "</span> = <input id='answer' type='text'><span> <i id='status'></i></span></li>";
            $("ul").append(htmlString);

            $("li #answer").last().focus();
        // }
    }
})
)

resetGame();
