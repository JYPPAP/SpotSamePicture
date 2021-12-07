document.addEventListener("DOMContentLoaded", function () {

  // 버튼관련 변수
  var doc = document;
  var buttons = doc.getElementById("btn_wrap");
  var button = buttons.children;
  var startBtn = button[0];
  var stopBtn = button[1];
  var pauseBtn = button[2];
  var restartBtn = button[3];
  var mixBtn = button[4];
  var btnArray = [];

  var score = doc.getElementById("score");
  var playCount = doc.getElementById("playCount");
  var playTimeWrap = doc.getElementsByClassName("playTimeWrap")[0];
  var playTime = doc.getElementById("playTime");

  // 카드관련 변수
  var cards = doc.getElementById("cards");
  var card = cards.getElementsByClassName("card");
  var frontFace = cards.getElementsByClassName("face_front");
  var backFace = cards.getElementsByClassName("face_back");
  var playInfo = doc.getElementById("playInfo");
  // 점수관련 변수

  var scoreBoard = doc.getElementById("scoreBoard");

  /*##################
      LocalStorage    
  ##################*/
  /* 
  1. 기존의 값은 불러오고, 새로운 값이 입력되면, 그 값은 가장 상단에 위치할 수 있도록 기존의 값을 임시배열에 저장하고 새로운 값을 push한 다음 기존의 값을 추가하는 방향.
  일단 가장 상단에 최근 기록이 등록되면 됨.
  
  2. prompt에서 input에 입력할 때 ,가 입력되는것 막아야 함.

  3. 가져온 값이 많을 때를 생각해서 넘치지는 않게, 스크롤을 추가하면 좋을 것 같음.
    - CSS를 이용해서 양이 늘어난다면 스크롤 될 수 있도록 만들기.

  4. localStorage.setItem("score", 추가될 값(배열 형태로 저장해야 함.));
    - prompt로 값 입력받을 때 파싱해서 ","가 들어있으면 다시 작성하라고 하기. 가능하다면 alert를 띄워서 특수문자 입력하면 안된다고 퉁쳐도 괜찮을 것 같음. 아니면 영어, 한국어, 숫자만 입력할 수 있도록 확인 후 다시 입력하도록 만드는 것도 나쁘진 않을 것 같음.
  @ 나중에 추가하고 싶은 기능
  1. 버튼 중 로그 초기화 버튼 만들기
    - 저장된 로그 초기화
  2. 로그 옆에 x버튼 생성 후 클릭시 해당 로그 삭제.
  */
  // localStorage.clear();
  function setScoreBoard() {
    var scoreItem = localStorage.getItem("score");
    var scoreHeader = "<tr><th>이름</th><th>Score</th><th>소요시간</th></tr>"
    console.log(scoreItem);
    if (typeof (scoreItem) === "string") {
      // console.log("score has value");
      var splitScore = scoreItem.split(/\,/g);
      if ((splitScore.length % 3) === 0) {
        var total = splitScore.length / 3;
        var scoreText = "";
        for (var i = 0; i < total; i++) {
          scoreText += "<tr><td>" + splitScore[(i * 3)] + "</td><td>" + splitScore[(i * 3) + 1] + "</td><td>" + splitScore[(i * 3) + 2] + "</td></tr>"
        }
        scoreBoard.innerHTML = scoreHeader + scoreText;
      } else {
        console.log("가져온 값에 오류가 있습니다.");
      }
    } else {
      scoreBoard.innerHTML = scoreHeader;
      console.log("저장된 score가 없음.");
    }
  };

  setScoreBoard();

  /* 0-15까지 중복없이 랜덤한 숫자가 들어있는 배열 */
  var basicArray = [];

  for (var i = 0; i < 16; i++) basicArray[i] = i;

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

  /* 랜덤 배치 */
  function mixImage() {
    /* 
    다시 섞기를 했을 때, 일치한 카드에 대해서 어떻게 처리할 것인지 관련된 내용을 추가해야 함.
    - 배열을 생성하고, 일치할 경우 배열에서 제거하고 그 배열을 셔플해서 이미지를 믹스 후 보여주는 방향?
    - 일치한 카드를 확인하는 방법은 뭐가 있을까?
    - 
     */
    shuffle(basicArray);
    console.log("basicArray");
    console.log(basicArray);
    for (var i = 0; i < basicArray.length; i++) {
      backFace[basicArray[i]].style.backgroundImage = "url(../images/0" + ((i % 8) + 1) + ".jpg)";
    }
    /* 이대로 했을 경우 일치한 이미지와 섞어야 할 이미지가 섞이는 문제가 발생한다. */
    showImage();
  }

  function showImage() {
    for (var i = 0; i < card.length; i++) {
      frontFace[i].className = "face face_front active";
      setTimeout(function () {
        for (var i = 0; i < card.length; i++) {
          frontFace[i].className = "face face_front";
        }
      }, 3000);
    }

    for (var i = 3; i < 0; i--) {
      setTimeout(function () {
        playCount.textContent = i;
      }, i * 1000);
    }

  }
  var clickCount = 0;
  var prevImage = "";
  var checkFlag = false;
  var gameCount = 0;


  cards.addEventListener("click", function (e) {
    var target = e.target;
    var targetImage = target.nextElementSibling;

    if (clickCount === 2) return;

    if (target.className === "face face_front") {
      target.className = "face face_front active";
    } else {
      return;
    }

    var targetNumber = targetImage.style.backgroundImage;
    if (clickCount === 1) {
      // console.log("두 번째 클릭일 때 실행될 코드");
      var prevNumber = prevImage.style.backgroundImage;
      clickCount = 2;

      if (targetNumber === prevNumber) {
        // console.log("두 이미지가 일치할 때  실행될 코드");
        score.textContent = Number(score.textContent) + 10;
        /*
         * 카드를 다시 섞더라도 card[shuffleArray[i]]의 카드 내부에 있는 innerHTML을 복사 후 빈 문자열에 집어넣고, 그 문자열을 card의 innerHTML에 저장하는 방법으로 제작 후 showCard? 하게 된다면 좋을 것 같다. showCard 부분에서 만약 className이 face face_front clear 일 경우 패스하고, 그 외의 경우 face face_front의 상태로 만들면 좋을 것 같다.
         * 아예 작성하는 부분을 함수로 제작하는것도 나쁘진 않을 것 같다. 시작할 때 랜덤배열을 만들고 그 배열을 이용해서 배치하고 다시 섞을 때도 랜덤배열을 만들고 그 배열을 이용해서 배치만 하는
         * * 배치를 목적으로 하는 함수를 제작하는것도 좋을 것 같다.
         */
        setTimeout(function () {
          target.className = "face face_front clear";
          prevImage.previousElementSibling.className = "face face_front clear";
          clickCount = 0;
        }, 500);
        gameCount++;
      } else {
        // console.log("두 이미지가 다를 때  실행될 코드");
        score.textContent = Number(score.textContent) - 5;
        setTimeout(function () {
          for (var i = 0; i < frontFace.length; i++) {
            frontFace[i].className = frontFace[i].className !== "face face_front clear" ? "face face_front" : "face face_front clear";
          }
          clickCount = 0;
        }, 1000);

        /* 이미지 한 개를 누른 뒤 다시 섞기를 눌렀을 경우 어떻게 할 것인지?
        전부 섞지만 clear 클래스가 붙어있다면 active 클래스도 추가되지 않을것.
        다만 다시 섞을 때 active 클래스가 적용된 것이 있다면 active 클래스를 제거해야 할 것.
         */
      }
      if (gameCount === 8) {
        console.log("Game End !!!!");
        gameEnd();
      }
      return clickCount, checkFlag, gameCount;
    } else {
      // console.log("첫 번째 클릭일 때 실행될 코드");
      clickCount = 1;
      prevImage = targetImage;
      /* 두 번째 클릭에서 기존 prev를 가지고 있어도 첫 번째 클릭으로 새로운 값이 덮어써지기 때문에 문제는 없다. */
      console.log(card[0].innerHTML);
      return clickCount, prevImage;
    }
  });

  function gameEnd() {
    var endName = prompt("게임이 종료되었습니다.\n이름을 입력해주세요", "(콤마 , )제외");
    // playTime.textContent = 40;
    // score.textContent = 120;
    var endScore = (Number(score.textContent) + Number(playTime.textContent)) + "점";
    var endTime = playTime.textContent + "초";
    console.log(typeof (endName));

    // var parseName = (/[\w|ㄱ-ㅎ|가-힣|][^\,]/g).test(endName);
    if (endName === "" || endName === null) {
      endName = prompt("이름을 입력하지 않았습니다.\n이름을 입력해주시기 바랍니다.", "(콤마 , )제외");
      if (endName === "" || endName === null) {
        return;
      }
    }
    var tempItem = localStorage.getItem("score");
    var parseName = endName.replace(/[\,]/g, "");
    var endString = parseName + "," + endScore + "," + endTime;
    var setString = "";

    if (tempItem === null) {
      setString = endString;
    } else {
      setString = endString + "," + tempItem;
    }
    localStorage.clear();
    localStorage.setItem("score", setString);
    scoreBoard.innerHTML = "";
    setScoreBoard();

  }
  // gameEnd();

  /* (END) 카드를 클릭했을 때 할 동작 */
  /* 카드게임이 끝난것을 어떻게 확인할 것인지
  일치할 때 gameCount를 1씩 추가.
  16이 되면 prompt 실행.
  이름을 가져오고 score와 시간을 점수로 합산 후 score로, 시간은 따로 시간으로 저장?
   */

  /*##################
      button Click
  ##################*/
  function showBtn(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === 1) {
        button[i].style.display = "inline";
      } else {
        button[i].style.display = "none";
      }
    }
  }

  startBtn.onclick = function () {
    /* 버튼 숨기고 보여주기 */
    btnArray = [0, 1, 1, 0, 1];
    showBtn(btnArray);
    for (var i = 0; i < card.length; i++) {
      card[i].style.display = "block";
    }
    playInfo.style.display = "none";

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
        playTime.textContent = parseValue.time;
        console.log(parseValue.images);
        for (var i = 0; i < parseValue.images.length * 2; i++) {
          backFace[i].style.backgroundImage = "url(../" + parseValue.images[(i % 8)] + ")";
        }
        console.log("Work1");
        mixImage();
        showCount();
      } else {
        console.log("[" + xhr.status + "] : " + xhr.statusText);
      }
    }

    /* 시간같은 경우는 setInterval을 이용하고 게임이 종료되었을 때 clearInterval 한 뒤 값을 가져오면 될 것 같음.
    아니면 시계표시 관련해서 찾아본 뒤 값을 가져오는 방법으로 작성해도 괜찮을 것 같음.
     */
  };

  function showCount() {
    var timeCount = 3;
    playCount.textContent = timeCount;

    for (var i = 0; i < 4; i++) {
      var timeCount = 3;
      setTimeout(function () {
        playCount.textContent = timeCount;
        timeCount--;
        if (timeCount < 0) startCount();
      }, (i * 1000));
    }
  }
  var intervalTime;

  function startCount() {
    console.log("Count START !!!!!");


    playCount.style.display = "none";
    playTimeWrap.style.display = "block";

    intervalTime = setInterval(changeTime, 1000);
  }

  function changeTime() {
    var time = Number(playTime.textContent);
    time--;
    playTime.textContent = time;
    console.log(time);
    console.log(playTime.textContent);
    if (time < 1) {
      gameEnd();
      clearInterval(intervalTime);
    }
  }
  stopBtn.onclick = function () {
    /* 게임을 종료하고 초기화면으로 돌아가기. */
    btnArray = [1, 0, 0, 0, 0];
    showBtn(btnArray);
    for (var i = 0; i < buttons.length; i++) {
      button[i].style.display = "none";
    }
    startBtn.style.display = "inline";
    /* 일단 임시로 새로고침할 수 있도록 작성함. */
    location.reload();
  };

  pauseBtn.onclick = function () {
    /* 다시시작 버튼 노출 */
    btnArray = [0, 1, 0, 1, 0];
    showBtn(btnArray);
    /* 타이머 중지, 모든 게임 동작이 중지 */
    cards.style.visibility = "hidden";
    clearInterval(intervalTime);
  };

  restartBtn.onclick = function () {
    btnArray = [0, 1, 1, 0, 1];
    showBtn(btnArray);
    /* 타이머가 재동작하며, 게임을 다시 시작할 수 있다. */
    cards.style.visibility = "visible";
    intervalTime = setInterval(changeTime, 1000);
  };

  mixBtn.onclick = function () {
    /* Score에서 -5점 차감, 이미 찾은 카드를 제외한 나머지 카드들을 재배치 */
    score.textContent = Number(score.textContent) - 5;
    shuffle(basicArray);
    /* 재배치된 카드를 3초간 보여준 후 다시 뒤집는다. */
    mixImage();
    startCount();
    /* 일시정지 중에는 실행될 수 없다. */
    /* card[basicArray[i]]에 있는 innerHTML을 빈 문자열에 집어넣은 뒤 그 값을 한 번에 모아서 출력하기. */
  };
});