const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
//const questionCounterText = document.getElementById('questionCounter');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementsById('game'); 

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

/*fetch questions from json-file:
let questions = [];

/*fetch("questions.json").then(res => {
    console.log(res);
    return res.json();
}).then(loadedQuestions => {
    console.log(loadedQuestions);
    questions = loadedQuestions;
    startGame();
    //error-handling:
}).catch(err => {
    console.error(err);
});*/

//fetch questions from an url: 
let questions = [];
fetch(
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy'
)
.then((res) => {
    return res.json();
})
.then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });

        return formattedQuestion;
    });

    startGame();
})
.catch((err) => {
    console.error(err);
});



//Constants

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    // [...questions] takes all questions from the array above:
    availableQuestions = [...questions];
    getNewQuestion();
    /*make game visible, hide loader: */
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS){
        //save score:
        localStorage.setItem('mostRecentScore',score);
        //quiz beenden
        return window.location.assign('/end.html');
    }
    questionCounter++;
    //updating questioncount on my website:
    //questionCounterText.innerText = questionCounter + "/" + (MAX_QUESTIONS+1);
    progressText.innerText = 'Question ' + questionCounter + "/" + (MAX_QUESTIONS+1);

    //update progress-Bar: 
    
    progressBarFull.style.width = `${(questionCounter / (MAX_QUESTIONS+1)) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        //comparing the clicked answer to the real answer:
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        console.log(classToApply);

        //incrementScore defined below: Adding points to users-account:
        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        // selects css-class according weather the chosen answer is correct or not
        selectedChoice.parentElement.classList.add(classToApply);

        //removes the css-class for the next question:
        setTimeout( () => { 
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
            }, 1000);
       
        
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

//startGame(); moved up to function