const question = document.getElementById('question')
const choices = Array.from(document.getElementsByClassName('choice-text'))
const questionCounterText = document.getElementById('questionCounter')
const scoreText = document.getElementById('score')

let currentQuestion = {}
let acceptingAnswers = false
let score = 0
let questionCounter = 0
let availableQuestions = []

let questions = []

fetch("https://joseuribeh.github.io/quiz-app/questions.json")
    .then( res => {
        return res.json()
    }).then( loadedQuestions => {
        questions = loadedQuestions
        startGame()
    })
    .catch ( err => {
        console.error(err)
    }) 

//CONSTANTS
const CORRECT_BONUS = 20
const MAX_QUESTIONS = 5

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('finalScoreText', score)
        return window.location.assign('https://joseuribeh.github.io/quiz-app/end.html')
    }
    questionCounter++
    questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS
    const questionIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex]
    question.innerText = currentQuestion.question

    choices.forEach((choice) => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionIndex, 1)
    acceptingAnswers = true
}

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']
        const classToApply =
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect"
        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS)
        }
        selectedChoice.parentElement.classList.add(classToApply)
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 200)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score
}