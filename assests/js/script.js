// modal pattern

var Accesslocal = (function(){

/* storing data locally */
let AccessLocalStorage = {
    SetLocalStorage: function(para){
       localStorage.setItem("QuestionCollections", JSON.stringify(para));
    },
    GetLocalStorage: function(){
        return JSON.parse(localStorage.getItem("QuestionCollections"));
    },
    removeLocalStorage: function(){
        localStorage.removeItem("QuestionCollections");
    }
};

/* monitoring the quiz progress */
var quizProgress = {
   questionIndex:0
}

/* setting a default empty array to the local storage if localstorage is null */
if(AccessLocalStorage.GetLocalStorage() === null){
   AccessLocalStorage.SetLocalStorage([]);
}

/* function that creates new instances of a question */
function QuestionTest(id, question, options, correAns){
   this.id = id;
   this.question = question;
   this.optAnswer = options;
   this.correctAnswer = correAns;
}

return {
   /* accesses the quizprogress property from AccessLocal return object */
    getQuizProgress: quizProgress,

   accessLoc:AccessLocalStorage,

    addLocal: function(questionsText, opt){

     let optArr, newQuestion, correctAnswer, questionId, getStored, isChecked;
     optArr = [];
     isChecked = false;

     if(AccessLocalStorage.GetLocalStorage().length > 0){
       questionId = AccessLocalStorage.GetLocalStorage()[AccessLocalStorage.GetLocalStorage().length - 1].id + 1;
     } else{
       questionId = 0;
     }

        for(let i=0;i<opt.length;i++){
            if(opt[i].value !== ""){
            optArr.push(opt[i].value);
	            if(opt[i].value !== "" && opt[i].previousElementSibling.checked){
	            correctAnswer = opt[i].value;
	            isChecked = true;
	            }
            }
         }


        if(questionsText.value !== ""){

           if(optArr.length > 1){

              if(isChecked){

                 newQuestion = new QuestionTest(questionId, questionsText.value, optArr,  correctAnswer);
                 getStored = AccessLocalStorage.GetLocalStorage();
                 getStored.push(newQuestion);
                 AccessLocalStorage.SetLocalStorage(getStored);
                 questionsText.value = "";

                 for(let x = 0;x<opt.length;x++){

                  opt[x].value = "";
                  opt[x].previousElementSibling.checked = false;

                 }
                 return true;

              }else{

                 alert("you missed to check the correct answer or you checked answer without value");
                 return false;

              }
           }else{
              alert("You must insert at least two options");
              return false;
           }
        }else{
           alert("Please insert Question");
           return false;
        }
    },
   
    checkAnswer: function(answer){
      console.log();
      if(AccessLocalStorage.GetLocalStorage()[quizProgress.questionIndex].correctAnswer === answer.textContent){
         // console.log("correct");
         return true;
      } else {
         return false;
         // console.log("wrong");
      }
    },

    isFinished: function(){
      return quizProgress.questionIndex + 1 == AccessLocalStorage.GetLocalStorage().length;
    }
};
})();


var Dom = (function(){

let DomElements = {

    Question: document.getElementById("new-question-text"),
    option: document.querySelectorAll(".admin-option"),
    insertBtn: document.getElementById("question-insert-btn"),
    adminoptionsContainer: document.querySelector(".admin-options-container"),
    insertedquestionswrapper: document.querySelector(".inserted-questions-wrapper"),
    questionUpdateBtn: document.querySelector("#question-update-btn"),
    questionDeleteBtn: document.querySelector("#question-delete-btn"),
    questionsClearBtn: document.querySelector("#questions-clear-btn"),
    //*************** Quiz Section Elements ************** */
    askedQuestText: document.getElementById("asked-question-text"),
    quizOptionWrapper: document.querySelector(".quiz-options-wrapper"),
    progressBar: document.querySelector('progress'),
    progressParagraph: document.getElementById("progress"),
    instantAnswerContainer: document.querySelector(".instant-answer-container"),
    instantText: document.getElementById("instant-answer-text"),
    instantClass: document.getElementById("instant-answer-wrapper"),
    emotion: document.getElementById("emotion"),
    nextButton: document.getElementById("next-question-btn")

};

return {

   DomaccessGlobal: DomElements,
   addInputDynamically: function(){

     function addInputs(){
       var z, inputHtml;
       z = document.querySelectorAll(".admin-option").length;
       inputHtml = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-`${z}`" name="answer" value="`${z}`"><input type="text" class="admin-option admin-option-`${z}`" value=""></div>';
       DomElements.adminoptionsContainer.insertAdjacentHTML("beforeend", inputHtml);
       DomElements.adminoptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener("focus", addInputs);
       DomElements.adminoptionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInputs, false);
     }
     DomElements.adminoptionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInputs, false);

   },

   createQuestionList:function(getquestion){

       var questionsList, numbering;
       numbering = [];
       DomElements.insertedquestionswrapper.innerHTML = "";
       for(var i = 0;i < getquestion.GetLocalStorage().length;i++){
           numbering.push(i+1);
           questionsList = "<p><span>" + numbering[i] + ". " + getquestion.GetLocalStorage()[i].question + ' </span><button id="question-' + getquestion.GetLocalStorage()[i].id + '">Edit</button></p>';
           DomElements.insertedquestionswrapper.insertAdjacentHTML("beforeend", questionsList);
       }

   },

   editQuestsList:function(event, storageList, inputAdd, updateList){

       var getId, foundItem, placeInArr, optHtml;
       DomElements.questionUpdateBtn.style.visibility = "visible";
       DomElements.questionDeleteBtn.style.visibility = "visible";
       DomElements.insertBtn.style.visibility = "hidden";
       DomElements.questionsClearBtn.style.pointerEvents = "none";

       if("question-".indexOf(event.target.id)){

          getId = parseInt(event.target.id.split("-")[1]);
          questionList = storageList.GetLocalStorage();

          for(let i=0;i<questionList.length;i++){
              if(getId === questionList[i].id){
                 foundItem = questionList[i];
                 placeInArr = i;
              }
              
          }

          optHtml = "";
          DomElements.Question.value = foundItem.question;
          DomElements.adminoptionsContainer.innerHTML = "";

          for(let x = 0;x<foundItem.optAnswer.length;x++){
             optHtml += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + ' name="answer" value="0"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.optAnswer[x] + '"></div>';
             DomElements.adminoptionsContainer.innerHTML = optHtml;
          
          }
          
         var backDefaultview = function(){
             var updatedContent;
             
             DomElements.Question.value = "";
             updatedContent = options = document.querySelectorAll(".admin-option");
             for(var i=0;i<options.length;i++){
             options[i].value = "";
             options[i].previousElementSibling.checked = false;
             }
             
             DomElements.questionUpdateBtn.style.visibility = "hidden";
             DomElements.questionDeleteBtn.style.visibility = "hidden";
             DomElements.insertBtn.style.visibility = "visible";
             DomElements.questionsClearBtn.style.pointerEvents = "";
             updateList(storageList);
         
         }
          
          var UpdateQuestion = function(){
             var optans, options;
             optans = [];
             options = document.querySelectorAll(".admin-option");
             foundItem.correctAnswer = "";
             foundItem.question = DomElements.Question.value;
             
             for(var i=0;i<options.length;i++){
                 if(options[i].value !== ""){
                    optans.push(options[i].value);
                    if(options[i].previousElementSibling.checked){
                       foundItem.correctAnswer = options[i].value
                    }
                 }
                 
             }
             
             foundItem.optAnswer = optans;
             
             
             if(foundItem.question !== ""){

               if(foundItem.optAnswer.length > 1){

                  if(foundItem.correctAnswer !== ""){

                     questionList.splice(placeInArr, 1, foundItem);
                     storageList.SetLocalStorage(questionList);
                     
                     backDefaultview();
                     
                  }else{
                     alert("you missed to check the correct answer or you checked answer without value");
                  }
               }else{
                  alert("You must insert at least 2 options");
               }
             }else{
                alert("Please,  Insert Question");
             }
            
          }
          inputAdd();
          DomElements.questionUpdateBtn.onclick = UpdateQuestion;
          
          var deleteQuestion = function(){
               questionList.splice(placeInArr, 1);
               storageList.SetLocalStorage(questionList);
               backDefaultview();
          
          }
          DomElements.questionDeleteBtn.onclick = deleteQuestion;
            
       }
       
   },

   clearQuestionList: function(storage){
       if(storage.GetLocalStorage() !== null){
          if(storage.GetLocalStorage().length > 0){
              var conf = confirm("warning: you will lose the entire question List");
              if(conf){
                 storage.removeLocalStorage();
                 DomElements.insertedquestionswrapper.innerHTML = "";
              }
          }
       }
   },

   displayQuestion: function(storage, progress){
      var newOptionHtml, characterArray;
      characterArray = ["A", "B", "C", "D", "E", "F"];
      if(storage.GetLocalStorage().length > 0){
         DomElements.askedQuestText.textContent = storage.GetLocalStorage()[progress.questionIndex].question;
         // console.log(storage.GetLocalStorage());

         DomElements.quizOptionWrapper.innerHTML = "";

         for(var i = 0; i < storage.GetLocalStorage()[progress.questionIndex].optAnswer.length; i++){
            newOptionHtml = '<div class="choice-' + i + '"><span class="choice-'+ i +'">'+ characterArray[i] +'</span><p  class="choice-'+ i +'">' + storage.GetLocalStorage()[progress.questionIndex].optAnswer[i] +'</p></div>';

            DomElements.quizOptionWrapper.insertAdjacentHTML('beforeend', newOptionHtml);

         }
      }
      
   },

   displayProgress: function(storage, progress){
      DomElements.progressBar.max = storage.GetLocalStorage().length;
      DomElements.progressBar.value = progress.questionIndex + 1;
      DomElements.progressParagraph.textContent = (progress.questionIndex + 1) + "/" + storage.GetLocalStorage().length;
   }, 

   newDesign: function(answerResults, selectedAnswer){
      var twoOption = {
         instAnswerText: ["This is a wrong answer", "This is a correct answer"],
         class: ['red', 'green'],
         emotion: ["assests/img/sad.png", "assests/img/happy.png"],
         spanBgColor: ["rgba(200, 0, 0, .7)", "rgba(0, 250, 0, .2)"]
      }, index = 0;

      if(answerResults){
         index = 1;
      }

      DomElements.quizOptionWrapper.style.cssText = "opacity:0.6; pointer-events:none;";
      DomElements.instantAnswerContainer.style.opacity = "1";
      
      DomElements.instantText.textContent = twoOption.instAnswerText[index];
      DomElements.instantClass.className = twoOption.class[index];
      DomElements.emotion.setAttribute("src", twoOption.emotion[index]);

      selectedAnswer.previousElementSibling.style.backgroundColor = twoOption.spanBgColor[index];

      console.log(selectedAnswer.previousElementSibling);

   },

   oldDesign: function(){
      DomElements.quizOptionWrapper.style.cssText = "";
      DomElements.instantAnswerContainer.style.opacity = "0";
   }
   
};
})();


var controller = (function(AccessDom, AccessLoc){

   AccessDom.createQuestionList(AccessLoc.accessLoc);
   AccessDom.addInputDynamically();

   AccessDom.DomaccessGlobal.insertBtn.addEventListener("click", function(e){
      e.preventDefault();
      var adimOption = document.querySelectorAll(".admin-option");
      var checkboolean = AccessLoc.addLocal(AccessDom.DomaccessGlobal.Question, adimOption);
      if(checkboolean){
         AccessDom.createQuestionList(AccessLoc.accessLoc);
      }
   });

   AccessDom.DomaccessGlobal.insertedquestionswrapper.addEventListener("click", function(e){
      AccessDom.editQuestsList(e, AccessLoc.accessLoc, AccessDom.addInputDynamically, AccessDom.createQuestionList);
   });
   
   AccessDom.DomaccessGlobal.questionsClearBtn.addEventListener("click", function(){
         AccessDom.clearQuestionList(AccessLoc.accessLoc)
   });

   AccessDom.displayQuestion(AccessLoc.accessLoc, AccessLoc.getQuizProgress);

   AccessDom.displayProgress(AccessLoc.accessLoc, AccessLoc.getQuizProgress);

   AccessDom.DomaccessGlobal.quizOptionWrapper.addEventListener("click", function(e){
      var options = AccessDom.DomaccessGlobal.quizOptionWrapper.querySelectorAll("div");

      for(var i = 0; i < options.length; i++) {
         if(e.target.className === "choice-" + i){
            var answer = document.querySelector(".quiz-options-wrapper div p." + e.target.className);
            // console.log(answer);
            var answerResult = AccessLoc.checkAnswer(answer);
            AccessDom.newDesign(answerResult, answer);

            if(Accesslocal.isFinished()){
               Dom.DomaccessGlobal.nextButton.textContent = "Finished";
            }

            var nextQuestion = function(progress, question){
               if(Accesslocal.isFinished()){
                  console.log("finished");
               } else {
                  Dom.oldDesign();
                  Accesslocal.getQuizProgress.questionIndex++;

                   AccessDom.displayQuestion(AccessLoc.accessLoc, AccessLoc.getQuizProgress);
                   AccessDom.displayProgress(AccessLoc.accessLoc, AccessLoc.getQuizProgress);
               }
            }

            AccessDom.DomaccessGlobal.nextButton.onclick = function(){

               nextQuestion(Accesslocal.getQuizProgress.questionIndex, Accesslocal.accessLoc.GetLocalStorage());
               // console.log(Accesslocal.getQuizProgress.questionIndex, Accesslocal.accessLoc.GetLocalStorage());
            }
               
         }
      }
      
      
   });
     
})(Dom, Accesslocal);


// debuging
// console.log(Accesslocal.accessLoc.GetLocalStorage()[0].optAnswer );

// window.onload = function(){
// var wrapper = document.querySelector(".wrapper");
// console.log(wrapper.offsetHeight);
// console.log(wrapper.clientHeight);
// }


