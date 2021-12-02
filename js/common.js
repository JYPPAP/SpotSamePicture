document.addEventListener("DOMContentLoaded", function () {
  /*###################
      버튼관련 변수
  ###################*/
  var buttons = document.getElementById("btn_wrap");
  var button = buttons.children;
  var startBtn = button[0];
  var stopBtn = button[1];
  var pauseBtn = button[2];
  var restartBtn = button[3];
  var mixBtn = button[4];

  var playInfo = document.getElementById("playInfo");
  var playTime = document.getElementById("playTime");

  /*###################
      카드관련 변수
  ###################*/
  var cards = document.getElementById("cards");
  var card = cards.getElementsByClassName("card");
  var backFace = cards.getElementsByClassName("face_back");

  /*###################
      점수관련 변수    
  ###################*/
  var board = document.getElementById("scoreBoard");
  // var scoreWrap = board.getElementsByTagName("tr");
  // {
  //   // scoreWrap.appendChild("tr");
  // console.log("    "+scoreWrap[0].cells[0].textContent+"     |   "+scoreWrap[0].cells[1].textContent+
  // "   |  "+scoreWrap[0].cells[2].textContent);
  // console.log(scoreWrap[1].cells[0].textContent+" | "+scoreWrap[1].cells[1].textContent+
  // " | "+scoreWrap[1].cells[2].textContent);
  // }

  /*##################
      LocalStorage    
  ##################*/
  /* 여기에서 로그만 쌓으면 되는 것 같고 혹시나 랭킹?
  값이 여러개일 때 어떻게 처리할 것 인지. 값 삽입은 동일하게 하고, push를 통해서 뒤에 값을 추가하는 방법으로 만들기.
  
  prompt에서 input에 입력할 때 ,가 입력되는것 막아야 함.

  가져온 값이 많을 때를 생각해서 넘치지는 않게, 스크롤을 추가하면 좋을 것 같음.
  CSS를 이용해서 양이 늘어난다면 스크롤 될 수 있도록 만들기.

  ####
  게임이 끝나면 저장하는 부분은 그 쪽으로 옮기면 되고.
  현재 가져온 값을 분리해서 집어넣는 부분을 제작해야 한다.
  저장할 때 새롭게 추가된 값 뒤에 기존의 값을 push한 다음 저장하는 형태로 만드는 것이 좋을 것 같음. 그래야 이전 기록은 아래로 없어지고, 새로운 기록이 보기쉽게 되기 때문.
   */
  // localStorage.setItem("score", 추가될 값(배열 형태로 저장해야 함.));
  /* prompt로 값 입력받을 때 파싱해서 ","가 들어있으면 다시 작성하라고 하기. 가능하다면 alert를 띄워서 특수문자 입력하면 안된다고 퉁쳐도 괜찮을 것 같음. 아니면 영어, 한국어, 숫자만 입력할 수 있도록 확인 후 다시 입력하도록 만드는 것도 나쁘진 않을 것 같음. */

  var score = localStorage.getItem("score");
  var splitScore = score.split(/\,/g);
  var total = splitScore.length / 3;
  var scoreText = "";
  for (var i = 0; i < total; i++) {
    scoreText += "<tr><th>" + splitScore[(i * 3)] + "</th><th>" + splitScore[(i * 3) + 1] + "</th><th>" + splitScore[(i * 3) + 2] + "</th></tr>"
  }
  board.innerHTML += scoreText;
  /*###############
      랜덤 배열
  ###############*/
  {
    /* 내부에 0-15까지의 랜덤한 숫자가 중복없이 위치한 배열 생성.
    목적 : 카드의 위치 조정용.
    위치변경을 어떻게 하려고 했더라??
    for문을 이용해서 i번째에 있는걸 랜덤Array의 i번째로 옮기려고 했었나?
    그러면 어떻게 옮기지?

    i번째의 이미지값을 
     */
  }

  /* 0-15까지 중복없이 랜덤한 숫자가 들어있는 배열 */
  var basicArray = [];

  for (var i = 0; i < 16; i++) basicArray[i] = i;

  /* 배열을 섞어주는 함수. 다시섞기 부분에서 재사용하면 될 것 같음. */
  // function mixArray(array) {
  //   if (array.length < 0) return;

  //   for (var i = 0; i < array.length * 5; i++) {
  //     var randomNum = Math.floor(Math.random() * 16);
  //     var tempArray = array[randomNum];

  //     array.splice(randomNum, 1);
  //     array.push(tempArray);
  //   }
  // }
  function shuffle(array) {
    for (var index = array.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      var randomPosition = Math.floor(Math.random() * (index + 1));
      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다. 
      var temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
  }
  /*##################
      텍스트 함수
  ##################*/
  /* 현재 변경방법 : innerHTML을 사용해서 내부에 문자열 형태의 값을 입력하는 방식 > 가져와서 만들고 다시 새롭게 만드는 방법을 이용해서 제작.
  이거보다 더 간단명료하고 명확한 방식에 대해서 찾아보기.
  HTML에 태그로 존재하고, JSON으로 가져온 값은 css에서 배경이미지로 넣어주기. 값을 입력할 때 클래스값으로 추가적으로 저장하기
  배열할 때도 클래스가 적용된 태그를 통째로 움직이기.
  CSS를 적용할 때 for문을 이용해서 집어넣기?
   */
  // function storeText(idx) {
  // multiText = '<div class="card"><div class="face face_front">?</div><div class="face face_back"><img class="image' + ((idx % 8) + 1) + '" src="images/0' + ((idx % 8) + 1) + '.jpg"></div></div>'
  // return multiText;
  // }
  /*##################
      랜덤 배치
  ##################*/
  function mixImage() {
    shuffle(basicArray);
    console.log(basicArray);
    mixText = "";
    for (var i = 0; i < basicArray.length; i++) {
      /* 여기서 카드의 위치를 옮겨야지, 배경이미지를 옮기는건 아닌 것 같음. */
      conso
      mixText += card[basicArray[i]].innerHTML;
    }
    console.log("####");
    console.log("mixText");
    console.log(mixText);
    // cards.innerHTML = mixText;
    shuffle(card);

    showImage();
  }

  function shuffle(array) {
    for (var index = array.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      var randomPosition = Math.floor(Math.random() * (index + 1));
      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다. 
      var temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
  }

  function showImage() {
    /* 다시섞기를 했을 때 clear 된 것들은 이미지를 삭제하기? */
    for (var i = 0; i < card.length; i++) {
      card[i].className = "card active";
    }
    setTimeout(() => {
      for (var i = 0; i < card.length; i++) {
        card[i].className = "card";
      }
      console.log("Work Here?");
    }, 1000);

  }
  var checkFlag = false;
  var prevImage;
  cards.addEventListener("click", function (e) {
    // console.log(this);
    var target = e.target
    var targetImage = target.nextElementSibling;
    var targetCard = target.parentNode;
    console.log("");
    console.log("targetImage");
    console.log(targetImage.style.backgroundImage);
    console.log("target");
    console.log(target);
    console.log("card");
    console.log(card);
    targetCard.className += " active";

    if (checkFlag) {

      console.log("#################");
      console.log("checkTrue");
      if (targetImage.className == prevImage.className) {
        console.log("#################");
        console.log("sameImage");
        targetImage += " clear";
        prevImage += " clear";
        prevImage = "";
        checkFlag = false;
      } else {
        console.log("#################");
        console.log("diffImage");
        targetCard.className += " active";
        checkFlag = false;
        setTimeout(function () {
          targetCard.className = "card";
          prevImage.className = "card"
          prevImage = "";
        }, 1000);
      }
    }
    console.log("clickFlag");
    console.log(clickFlag);
    console.log("prevImage");
    console.log(prevImage);
    checkFlag = true;
    prevImage = targetImage;
    // select.
    // prevImage = select;
    // if(checkFlag) {
    //   if(prevImage.cl)
    // }
  });

  /* 카드 뒤집기 */
  function turnCard() {
    // this.className = "card active";
    // if(checkFlag) {
    //   if(prevImage === this.className) {
    //     prevImage.className = "card open";
    //     this.className = "card open";
    //   }
    // }
    // checkFlag = true
    // var prevImage = this.className;
  }
  /*##################
      button Click
  ##################*/

  startBtn.onclick = function () {
    /* 버튼 숨기고 보여주기 */
    for (var i = 0; i < card.length; i++) {
      card[i].style.display = "block";
    }
    for (var i = 0; i < button.length; i++) {
      button[i].style.display = "inline";
    }
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    // console.log("playInfo.textContent");
    // console.log(playInfo.textContent);

    /*##########
        AJAX
    ##########*/
    /* 목적 : JSON에서 제한시간과 이미지 배치 */
    /* 이미지 배치의 경우 초기 정렬만 할 것이며 나중에 랜덤배열을 이용하여 만들 것. */
    /* 시작하기 버튼을 클릭했을 시점으로 옮겨야 함. */
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'json/setPlay.json');
    xhr.send();

    xhr.onreadystatechange = function () {
      console.log("[" + xhr.status + "] : " + xhr.statusText);
      // 서버 응답 완료 && 정상 응답
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      if (xhr.status === 200) {
        var parseValue = JSON.parse(xhr.responseText);
        playTime.textContent = "제한시간 : " + parseValue.time + " 초";
        console.log(parseValue.images);
        for (var i = 0; i < parseValue.images.length * 2; i++) {
          backFace[i].style.backgroundImage = "url(../" + parseValue.images[(i % 8)] + ")";
        }
        console.log("Work1");
        mixImage();
      } else {
        console.log("[" + xhr.status + "] : " + xhr.statusText);
      }
    }

    /* 아래에 시작시 호출될 함수 작성하기 */
    /* 초기화 */
    // initPlay();

    /* 시간같은 경우는 setInterval을 이용하고 게임이 종료되었을 때 clearInterval 한 뒤 값을 가져오면 될 것 같음.
    아니면 시계표시 관련해서 찾아본 뒤 값을 가져오는 방법으로 작성해도 괜찮을 것 같음.
     */
  };

  // function initPlay() {
  //   for (var i = 0; i < card.length; i++) {
  //     card[i].className = "card";
  //     card[i].style.display = "block";
  //   }
  // }

  stopBtn.onclick = function () {
    /* 게임을 종료하고 초기화면으로 돌아가기. */
    initPlay();
  };

  pauseBtn.onclick = function () {
    pauseBtn.style.display = "none";
    restartBtn.style.display = "inline"
    /* 타이머 중지, 모든 게임 동작이 중지 */
    /* 다시시작 버튼 노출 */
  };

  restartBtn.onclick = function () {
    /* 타이머가 재동작하며, 게임을 다시 시작할 수 있다. */
  };

  mixBtn.onclick = function () {
    /* Score에서 -5점 차감, 이미 찾은 카드를 제외한 나머지 카드들을 재배치 */
    /* 재배치된 카드를 3초간 보여준 후 다시 뒤집는다. */
    /* 일시정지 중에는 실행될 수 없다. */
  };
  cards.onclick = cardClick();

  /* 카드를 클릭했을 때 어떤 동작을 하도록 할 것인지 구현하기 */
  /* 
  1. 뒤집기
  2. 클릭한 요소의 인덱스 가져오기
  3. 그 다음 클릭한 요소의 인덱스 가져오기
  값이 2개가 되었으면 두 인덱스에서 동일한 카드임을 확인할 수 있는 방법을 찾아서 확인하기.
  */
  function cardClick() {
    // console.log("Hi");
    // this.className = "card active";
  }


});