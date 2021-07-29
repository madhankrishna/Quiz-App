const startBtn=document.querySelector('.start_btn button');
const infoBox=document.querySelector('.info_box');
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");
const optionList = document.querySelector(".option_list");
const timeLine = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

const restartQuiz = resultBox.querySelector(".buttons .restart");
const quitQuiz = resultBox.querySelector(".buttons .quit");
 
const nextBtn = document.querySelector("footer .next_btn");
const bottomQuesCounter = document.querySelector("footer .total_que");

const queText = document.querySelector(".que_text");

const scoreText = resultBox.querySelector(".score_text");

const baseUrl="https://opentdb.com/api.php?amount=3";

let question, answer;
let index=0;
let options = [];
let timeValue =  15;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
let questionslength;

startBtn.addEventListener('click' , ()=>{
    infoBox.classList.add("activeInfo");
});

exitBtn.addEventListener('click' , ()=>{
    infoBox.classList.remove("activeInfo");
});

continueBtn.addEventListener('click', ()=>{
    quizBox.classList.add("activeQuiz");
    infoBox.classList.remove("activeInfo");
    startTimer(timeValue); //calling startTimer function
    startTimerLine(0)
    queCounter(que_numb);
})
window.addEventListener("DOMContentLoaded", () => {
     fetchQuiz(index,que_numb);
  });


function fetchQuiz(index,que_numb){
    fetch(baseUrl)
  .then(response => response.json())
  .then(data => {
        
                 questionslength= data.results.length;
                 question = data.results[index].question;
                 options = [];
                 answer = data.results[index].correct_answer;
                 data.results[index].incorrect_answers.map((item) => options.push(item));
                 options.splice(Math.floor(Math.random() * options.length + 1), 0, answer);
                //  console.log(answer);

                 generateTemplate(question, options, answer,que_numb);
                 checkQuiz(answer);
                 
  });
    
}

function generateTemplate(question, options, answer,que_numb) {
       optionList.innerHTML=" ";
       queText.innerHTML=" ";          
       let queTag=document.createElement("span");
       queTag.innerHTML=`${que_numb}. ${question}`;
       queText.appendChild(queTag);
    
    // diplay the options
    options.map((option) => {
        const item = document.createElement("div");
        item.classList.add("option");
        item.innerHTML=`${option}`;
        optionList.appendChild(item);

    });  
}

function checkQuiz(answer){
    const allchoices=document.querySelectorAll('.option');

    allchoices.forEach((opt)=>{
        opt.addEventListener('click',e=>{
            let userelment=e.target;
            let useropt=e.target.textContent;
            // console.log(useropt);
            if (useropt == answer) {
                userScore += 1;
                console.log('ok');
                userelment.classList.add("correct");
                clearInterval(counterLine);
                clearInterval(counter);
                   
            }else{
                userelment.classList.add("incorrect")
                for(i=0; i < allchoices.length; i++){
                    if (allchoices[i].textContent==answer) {
                        allchoices[i].classList.add("correct")
                        
                    }
                }
                clearInterval(counterLine);
                clearInterval(counter);
 
            }
            allchoices.forEach((choice)=>{
                choice.classList.add("disabled");
            })
            nextBtn.classList.add("show")

        })
    })

 
   
}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off
            const allchoices=document.querySelectorAll('.option');
            for(i=0; i < allchoices.length; i++){
                if (allchoices[i].textContent==answer) {
                    allchoices[i].classList.add("correct")
                    
                }
            }
            allchoices.forEach((choice)=>{
                choice.classList.add("disabled");
            })
            nextBtn.classList.add("show"); //show the next button if user selected any option
        }
    }
}
function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1; //upgrading time value with 1
        timeLine.style.width = time + "px"; //increasing width of time_line with px by time value
        if(time > 549){ //if time value is greater than 549
            clearInterval(counterLine); //clear counterLine
        }
    }
}

nextBtn.addEventListener('click',nextQue)
function nextQue(){
    if(index < questionslength-1){
    index++;
    que_numb++;
    fetchQuiz(index,que_numb);
    queCounter(que_numb);
    clearInterval(counter); //clear counter
    startTimer(timeValue); //calling startTimer function
    clearInterval(counterLine); //clear counterLine
    timeText.textContent = "Time Left"; //change the timeText to Time Left
    startTimerLine(widthValue);    
    nextBtn.classList.remove("show");
    }
    else{
        clearInterval(counterLine); //clear counterLine
        clearInterval(counter); //clear counter
        showResult();
    }
}

function showResult(){
    infoBox.classList.remove("activeInfo"); //hide info box
    quizBox.classList.remove("activeQuiz"); //hide quiz box
    resultBox.classList.add("activeResult"); //show result box
    const scoreText = resultBox.querySelector(".score_text");
    if (userScore > 3){ // if user scored more than 3
        //creating a new span tag and passing the user score number and total question number
        let scoreTag = '<span>and congrats! , You got <p>'+ userScore +'</p> out of <p>'+ questionslength +'</p></span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if(userScore > 1){ // if user scored more than 1
        let scoreTag = '<span>and nice , You got <p>'+ userScore +'</p> out of <p>'+ questionslength +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{ // if user scored less than 1
        let scoreTag = '<span>and sorry , You got only <p>'+ userScore +'</p> out of <p>'+ questionslength+'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

function queCounter(index){
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ questionslength +'</p> Questions</span>';
    bottomQuesCounter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}

quitQuiz.onclick = ()=>{
    window.location.reload(); 
}
restartQuiz.onclick = ()=>{
    quizBox.classList.add("activeQuiz"); 
    resultBox.classList.remove("activeResult"); 
     index=0;
     options = [];
     timeValue =  15;
     que_numb = 1;
     userScore = 0;
     counter;
     counterLine;
     widthValue = 0;
     questionslength;
    fetchQuiz(index,que_numb);
    queCounter(que_numb); 
    clearInterval(counter); 
    clearInterval(counterLine); 
    startTimer(timeValue); 
    startTimerLine(widthValue); 
    timeText.textContent = "Time Left"; 
    nextBtn.classList.remove("show");
}





