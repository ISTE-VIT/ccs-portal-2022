var initialTimeValue = 45
var currentTimerValue = 45
let responsesBody = {
  mgm: [],
  des: [],
  cse: [],
  elec: [],
  general: [],
  aptitude: [],
}

var mergedques = [].concat.apply([], test);
console.log(mergedques)


const timerCount = document.querySelector('.timer_sec')
const nextButton = document.querySelector('.next_btn')
const quiz_box = document.querySelector('.quiz_box')
const que_text = document.querySelector('.que_text')
const optionList = document.querySelector('.option_list')
const subjectiveAnswer = document.querySelector(
  '.subjective-answer textarea',
)
const questionCount = document.querySelector('.question .question-count')

const showQuestion = async (index) => {
   
    if (index == mergedques.length) {
      finishExam()
    } else {
      nextButton.style.display = 'block'
      if(index === mergedques.length-1){
        nextButton.style.display = 'none'

    }
      currentTimerValue = initialTimeValue
      const questionBody = mergedques[index]
      questionCount.innerHTML = index + 1
      que_text.innerHTML = questionBody.que
      subjectiveAnswer.value = ''
      if (questionBody.domain === 'aptitude') {
        optionList.style.display = 'block'
        subjectiveAnswer.style.display = 'none'
        const optionA = optionList.querySelector('.optionA')
        const optionB = optionList.querySelector('.optionB')
        const optionC = optionList.querySelector('.optionC')
        const optionD = optionList.querySelector('.optionD')
        optionA.innerHTML = questionBody.optionA
        optionB.innerHTML = questionBody.optionB
        optionC.innerHTML = questionBody.optionC
        optionD.innerHTML = questionBody.optionD

        if(questionBody.image){
            document.querySelector('.que_image').style.display = 'block'
            document.querySelector('.que_image').src = questionBody.image
        }

        

        const interval = setInterval(() => {
          timerCount.innerHTML = ": " + --currentTimerValue
        }, 1000)
        const timeout = setTimeout(() => {
          manageCurrentQuestionResponse()
        }, initialTimeValue * 1000)
        const manageCurrentQuestionResponse = () => {
          clearInterval(interval)
          clearTimeout(timeout)
          console.log(questionBody)
          const response = getSelectedOption()
          // console.log(questionBody.domain)
          responsesBody[questionBody.domain].push({
            id: questionBody._id,
            questi: questionBody.que,
            correct: questionBody.correct,
            response,
          })
          console.log(responsesBody)
          deselectOptions()
          nextButton.removeEventListener(
            'click',
            manageCurrentQuestionResponse,
          )
          showQuestion(index + 1)
        }
        nextButton.addEventListener('click', manageCurrentQuestionResponse)
      } else {
        optionList.style.display = 'none'
        subjectiveAnswer.style.display = 'block'
        timerCount.innerText = 'No Time Limit'
        const manageCurrentNonAptitudeResponse = () => {
          responsesBody[questionBody.domain].push({
            id: questionBody._id,
            questi: questionBody.que,
            correct: questionBody.correct,
            response: subjectiveAnswer.value,
          })
          console.log(responsesBody)
          nextButton.removeEventListener(
            'click',
            manageCurrentNonAptitudeResponse,
          )
           showQuestion(index + 1)
        }
        nextButton.addEventListener('click', manageCurrentNonAptitudeResponse)
      }
    }
  }

const startTest = () => {
    showQuestion(0)
    document.querySelector('.loader').style.display = 'none'

}

startTest()

const finishExam = async () => {
    $.ajax({
        type:"POST",
        cache:false,
        url:"/thankyou",
        data:responsesBody,   
        success: function () {
        console.log(responsesBody);
        window.location.href = "/thankyou";    
        }
      });
  }


  document.querySelector('.end_button').addEventListener('click', () => {
    nextButton.click()
    finishExam()
  })



  const deselectOptions = () => {
    const selectedOption = document.querySelector('.option input:checked')
    if (selectedOption) {
      selectedOption.checked = false
    }
  }

  const getSelectedOption = () => {
    const selectedOption = document.querySelector('.option input:checked')
    return selectedOption ? selectedOption.value : null
  }

  window.addEventListener('DOMContentLoaded', () => {})

  function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
          finishExam()
        }
    }, 1000);
}

window.onload = function () {
    var fMinutes = 60 * 45,
        display = document.querySelector('#ttime');
    startTimer(fMinutes, display);
};