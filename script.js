const questions = []; // Array to store questions
let currentQuestionIndex = 0;
let score = 0;
const userAnswers = []; // Array to store user answers
let selectedGroup = ''; // Variable to store selected group

// Select mode and load questions
function selectMode(group) {
    selectedGroup = group; // Store the selected group
    const modeSelection = document.getElementById('mode-selection');
    const questionsContainer = document.getElementById('questions-container');
    const buttonGroup = document.querySelector('.button-group');

    modeSelection.style.display = 'none'; // Hide mode selection
    questionsContainer.style.display = 'block'; // Show questions container
    buttonGroup.style.display = 'block'; // Show button group

    loadQuestions(selectedGroup); // Load questions based on selected group
}

// Load questions based on selected group
function loadQuestions(group) {
    questions.length = 0; // Clear previous questions
    currentQuestionIndex = 0; // Reset current question index
    score = 0; // Reset score

    let dataFilePath = '';

    switch (group) {
        case 'group1':
            dataFilePath = 'data/group1/image_data.json'; // Replace with actual path
            break;
        case 'group2':
            dataFilePath = 'data/group2/image_data.json'; // Replace with actual path
            break;
        case 'group3':
            dataFilePath = 'data/group3/image_data.json'; // Replace with actual path
            break;
        case 'group4':
            dataFilePath = 'data/group4/image_data.json'; // Replace with actual path
            break;
        case 'all':
            dataFilePath = 'data/all.json'; // Replace with actual path for all questions
            break;
    }

    fetch(dataFilePath)
        .then(response => response.json())
        .then(data => {
            questions.push(...shuffle(data)); // Select questions from the selected group
            loadQuestionsBatch();
        });
}

// Shuffle function to randomize questions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load 5 questions at a time
function loadQuestionsBatch() {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; // Clear previous questions

    for (let i = 0; i < 5; i++) {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            const questionHTML = `
                <div class="question-item">
                    <div class="question-header">
                        <span class="question-number">Question ${currentQuestionIndex + 1}:</span>
                        <input type="text" class="user-answer" placeholder="Enter your answer">
                    </div>
                    <img src="data/${selectedGroup}/images/${question.image}" alt="Question" class="question-image">
                </div>
            `;
            questionsContainer.innerHTML += questionHTML;
            currentQuestionIndex++;
        }
    }
}

// Submit answers and check correctness
function submitAnswers() {
    const userAnswersElements = document.querySelectorAll('.user-answer');
    let correctAnswersCount = 0;

    userAnswersElements.forEach((input, index) => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = questions[currentQuestionIndex - 5 + index].answer.toLowerCase();

        userAnswers.push({
            question: questions[currentQuestionIndex - 5 + index].image,
            userAnswer: input.value.trim(),
            correctAnswer: questions[currentQuestionIndex - 5 + index].answer,
            isCorrect: userAnswer === correctAnswer
        });

        if (userAnswer === correctAnswer) {
            correctAnswersCount++;
        }
    });

    score += correctAnswersCount;

    if (currentQuestionIndex >= questions.length) {
        document.getElementById('questions-container').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'none'; // Hide Submit button
        document.getElementById('retry-btn').style.display = 'block'; // Show Retry button
        document.getElementById('download-btn').style.display = 'block'; // Show Download button
        document.getElementById('score-container').innerHTML = `
            <p>Your score: ${score}/${questions.length}</p>
        `;
    } else {
        loadQuestionsBatch(); // Load next set of questions
    }
}

// Generate download link
function generateDownload() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    let currentQuestionIndex = 0;

    function processQuestion() {
        if (currentQuestionIndex >= userAnswers.length) {
            doc.save('result.pdf');
            return;
        }

        const answer = userAnswers[currentQuestionIndex];
        const questionNumberText = `Question ${currentQuestionIndex + 1}`;
        const userAnswerText = `Your Answer: ${answer.userAnswer || 'No Answer'}`;
        const correctAnswerText = `Correct Answer: ${answer.correctAnswer}`;

        // Add user answer
        doc.setTextColor(answer.isCorrect ? 0 : 255, 0, 0); // Red if incorrect
        doc.text(questionNumberText, 10, 10 + currentQuestionIndex * 30);
        doc.text(userAnswerText, 10, 20 + currentQuestionIndex * 30);
        doc.text(correctAnswerText, 10, 30 + currentQuestionIndex * 30);

        currentQuestionIndex++;
        processQuestion(); // Call to process the next question
    }

    // Start processing questions
    processQuestion();
}

// Retry the quiz
function retryQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers.length = 0; // Clear user answers
    document.getElementById('questions-container').style.display = 'block';
    document.getElementById('score-container').innerHTML = '';
    document.getElementById('submit-btn').style.display = 'block'; // Show Submit button again
    document.getElementById('retry-btn').style.display = 'none'; // Hide Retry button
    document.getElementById('download-btn').style.display = 'none'; // Hide Download button
    loadQuestions(selectedGroup); // Reload the questions for the same selected group
}
