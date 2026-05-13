let timeLeft = 40;
let timerInterval;
let isTimerHiddenByUser = false;

const timerDisplay = document.getElementById('timerDisplay');
const toggleTimerBtn = document.getElementById('toggleTimerBtn');
const answerInput = document.getElementById('answerInput');
const nextBtn = document.getElementById('nextBtn');

// 1. Timer Logic
function updateTimer() {
    timerDisplay.textContent = timeLeft + 's';

    // Force show timer when 6 seconds remain
    if (timeLeft <= 6) {
        timerDisplay.style.visibility = 'visible';
        timerDisplay.classList.add('warning'); // Turns text red
    } else if (isTimerHiddenByUser) {
        timerDisplay.style.visibility = 'hidden';
    }

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitAndProceed(); // Auto-submit when time expires
    }
}

function startTimer() {
    updateTimer(); // Initial call
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
    }, 1000);
}

// 2. Hide/Show Button Logic
toggleTimerBtn.addEventListener('click', () => {
    isTimerHiddenByUser = !isTimerHiddenByUser;
    
    if (isTimerHiddenByUser) {
        timerDisplay.style.visibility = 'hidden';
        toggleTimerBtn.textContent = 'Show Timer';
    } else {
        timerDisplay.style.visibility = 'visible';
        toggleTimerBtn.textContent = 'Hide Timer';
    }
});

// 3. Submission and Data Storage Logic
function submitAndProceed() {
    clearInterval(timerInterval);
    
    const rawAnswer = answerInput.value;
    
    // Using Regex to remove ALL whitespace, ensuring " 1 7 " becomes "17"
    const sanitizedAnswer = rawAnswer.replace(/\s+/g, '');
    const isCorrect = (sanitizedAnswer === '17');

    // Package the data
    const questionData = {
        rawInput: rawAnswer,
        isCorrect: isCorrect,
        timeRemaining: timeLeft
    };

    // Store in sessionStorage (persists until the browser tab is closed)
    sessionStorage.setItem('iq_test_seq_1', JSON.stringify(questionData));

    // Redirect to the next page of your test
    // window.location.href = 'next-question.html'; 
    
    console.log('Saved Data:', questionData);
    alert('Answer submitted. Check the console to see the stored object!');
}

nextBtn.addEventListener('click', submitAndProceed);

// Allow pressing 'Enter' to submit
answerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitAndProceed();
    }
});

// Initialize
startTimer();