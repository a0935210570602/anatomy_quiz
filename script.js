const questions = []; // Array to store 30 questions
let currentQuestionIndex = 0;
let score = 0;

// Load questions from JSON file
fetch('data/questions.json')
    .then(response => response.json())
    .then(data => {
        questions.push(...shuffle(data).slice(0, 30)); // Select 30 random questions
        loadQuestion();
    });

// Shuffle function to randomize questions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load the current question
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        console.log(question.image);
        document.getElementById('question-image').src = `images/${question.image}`;
    } else {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('score-container').innerText = `Your score: ${score}/${questions.length}`;
    }
}

// Submit answer and check correctness
function submitAnswer() {
    const userAnswer = document.getElementById('user-answer').value.trim().toLowerCase();
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    document.getElementById('user-answer').value = ''; // Clear the input
    loadQuestion();
}
