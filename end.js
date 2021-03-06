const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES = 5;



finalScore.innerText = mostRecentScore + ' von 40 Punkten';

//enable save-button after typing in a username:
username.addEventListener('keyup', () =>{
    saveScoreBtn.disabled = !username.value;
});


//Saving the 5 best results in an order:
saveHighScore = e => {
    console.log("clicked the save-button");
    e.preventDefault();

    const score = {
        score: Math.floor(Math.random() * 100),
        name: username.value
    };
    highScores.push(score);
   /* highScores.sort((a,b)=> {
        return b.score - a.score;
    }); in one line: */
    highScores.sort((a,b)=> b.score - a.score);
    highScores.splice(5);
    
    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("/");


};