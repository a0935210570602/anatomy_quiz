const questions = []; // Array to store questions
let currentQuestionIndex = 0;
let score = 0;
const userAnswers = []; // Array to store user answers

// Load questions from JSON file
fetch('data/M104-anatomy-mid/image_data.json')
    .then(response => response.json())
    .then(data => {
        questions.push(...shuffle(data).slice(0, 50)); // Select 17 random questions
        loadQuestions();
    });

// Shuffle function to randomize questions
function shuffle(array) {
    // for (let i = 16; i > 0; i--) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load 5 questions at a time
function loadQuestions() {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; // Clear previous questions

    for (let i = 0; i < 5; i++) {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            console.log(question);
            const questionHTML = `
                <div class="question-item">
                    <div class="question-header">
                        <span class="question-number">Question ${currentQuestionIndex + 1}:</span>
                        <input type="text" class="user-answer" placeholder="Enter your answer">
                    </div>
                    <img src="data/M104-anatomy-mid/images/${question.image}" alt="Question" class="question-image">
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
    // userAnswers.length = 0; // Clear previous answers
    let correctAnswersCount = 0;

    userAnswersElements.forEach((input, index) => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = questions[currentQuestionIndex - 5 + index].answer.toLowerCase();

        userAnswers.push({
            question: questions[currentQuestionIndex - 5 + index].image,
            userAnswer: input.value.trim(), // 确保用户回答被记录
            correctAnswer: questions[currentQuestionIndex - 5 + index].answer,
            isCorrect: userAnswer === correctAnswer
        });
        console.log(userAnswers);
        if (userAnswer === correctAnswer) {
            correctAnswersCount++;
        }
    });

    score += correctAnswersCount;

    if (currentQuestionIndex >= questions.length) {
        // All questions answered
        document.getElementById('questions-container').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'none'; // Hide Submit button
        document.getElementById('retry-btn').style.display = 'block'; // Show Retry button
        document.getElementById('download-btn').style.display = 'block'; // Show Download button
        document.getElementById('score-container').innerHTML = `
            <p>Your score: ${score}/${questions.length}</p>
        `;
        // generateDownloadLink(); // Generate download link
    } else {
        loadQuestions(); // Load next set of questions
    }
}

// 生成下载链接的功能
function generateDownload() {
    console.log('生成下载链接');
    const { jsPDF } = window.jspdf;

    if (!jsPDF) {
        console.error('jsPDF 库未加载。');
        return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;

    let currentQuestionIndex = 0;

    function processQuestion() {
        if (currentQuestionIndex >= userAnswers.length) {
            // 如果所有题目都处理完毕，保存 PDF
            doc.save('result.pdf');
            return;
        }

        const answer = userAnswers[currentQuestionIndex];
        const questionNumberText = `Question ${currentQuestionIndex + 1}`;
        const userAnswerText = `Your Answer: ${answer.userAnswer || 'No Answer'}`;
        const correctAnswerText = `Correct Answer: ${answer.correctAnswer}`;

        
        // 添加用户作答
        if (!answer.isCorrect || answer.userAnswer === '') {
            // 错误的或未回答的答案显示为红色
            doc.setTextColor(255, 0, 0); // 红色
        } else {
            doc.setTextColor(0, 0, 0); // 黑色
        }
        // 添加题号
        doc.text(questionNumberText, margin, margin + 10);
        doc.text(userAnswerText, margin, margin + 30);

        // 添加正确答案
        doc.setTextColor(0, 0, 0); // 恢复颜色
        if (!answer.isCorrect) {
            doc.setTextColor(255, 0, 0); // 错误答案显示为红色
        }
        doc.text(correctAnswerText, margin, margin + 40);

        // 处理题目图片
        const imageUrl = `data/M104-anatomy-mid/images/${answer.question}`;
        const img = new Image();
        img.src = imageUrl;

        img.onload = function() {
            const imgWidth = contentWidth;
            const imgHeight = (img.height * imgWidth) / img.width;

            // 如果图片高度加上当前内容超出页面高度，则调整位置
            let imageY = margin + 50;
            if (imageY + imgHeight > pageHeight - margin) {
                doc.addPage();
                imageY = margin; // 重置图片 Y 位置
            }

            doc.addImage(img, 'JPEG', margin, imageY, imgWidth, imgHeight); // 添加图片
            // 更新 Y 位置，为下一个问题准备
            currentQuestionIndex++;
            doc.addPage(); // 添加新页面以准备下一个问题
            processQuestion(); // 递归调用处理下一个问题
        };
    }

    // 开始处理问题
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
    loadQuestions(); // Reload the questions
}
