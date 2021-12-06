document.addEventListener("DOMContentLoaded", function () {

  // 버튼관련 변수
  var buttons = document.getElementById("btn_wrap");
  var button = buttons.children;
  var startBtn = button[0];
  var stopBtn = button[1];
  var pauseBtn = button[2];
  var restartBtn = button[3];
  var mixBtn = button[4];

  var playInfo = document.getElementById("playInfo");
  var playTime = document.getElementById("playTime");

  // 카드관련 변수
  var cards = document.getElementById("cards");
  var card = cards.getElementsByClassName("card");
  var backFace = cards.getElementsByClassName("face_back");

  // 점수관련 변수    
  var board = document.getElementById("scoreBoard");

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

  var score = localStorage.getItem("score");
  // console.log(score);
  if (0 < score.length) {
    // console.log("score has value");
    var splitScore = score.split(/\,/g);
    if ((splitScore.length % 3) === 0) {
      var total = splitScore.length / 3;
      var scoreText = "";
      for (var i = 0; i < total; i++) {
        scoreText += "<tr><th>" + splitScore[(i * 3)] + "</th><th>" + splitScore[(i * 3) + 1] + "</th><th>" + splitScore[(i * 3) + 2] + "</th></tr>"
      }
      board.innerHTML += scoreText;
    } else {
      alert("가져온 값에 오류가 있습니다.");
    }
  } else {
    console.log("저장된 score가 없음.");
  }

  /* 0-15까지 중복없이 랜덤한 숫자가 들어있는 배열 */
  var basicArray = [];

  for (var i = 0; i < 16; i++) basicArray[i] = i;

  /* 배열을 섞어주는 함수. 다시섞기 부분에서 재사용하면 될 것 같음. */

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
  /*##################
      랜덤 배치
  ##################*/
  function mixImage() {
    shuffle(basicArray);
    console.log("basicArray");
    console.log(basicArray);
    for (var i = 0; i < basicArray.length; i++) {
      backFace[basicArray[i]].style.backgroundImage = "url(../images/0" + ((i % 8) + 1) + ".jpg)";
    }
    showImage();
  }

  function showImage() {
    /* 다시섞기를 했을 때 clear 된 것들은 이미지를 삭제하기? */
    for (var i = 0; i < card.length; i++) {
      card[i].className = "card active";
    }
    var timerCount = 3
    /* 여기에 시작했을 때 출력해줄 카운트 추가하기. */
    setTimeout( function() {
      for (var i = 0; i < card.length; i++) {
        card[i].className = "card";
      }
      console.log("Work Here?");
    }, 3000);

  }
  var clickFlag = false;
  var prevImage;
  var checkFlag = false;

  function clickCheck() {
    if(clickFlag){
      return clickFlag;
    } else {
      clickFlag = true;
      return false;
    }
  }
  
  cards.addEventListener("click", function (e) {
    /*
    * 중복클릭을 방지할 만한 내용 추가하기.
      - 하나를 클릭하고 두 번째 카드를 선택했을 때 잠깐의 딜레이를 추가해서 클릭을 막는 방법.
      - 어떻게?
      일단 카드를 클릭했을 때 처음 카드는 무조건 선택이 되어야 함.
      두 번째 카드를 선택했을 때 지연을 추가해야 함.
      카드가 달랐을 때 이벤트가 끝날 때까지 클릭 방지.
    
    1. 클릭한 요소를 확인
      - 클릭한 요소가 front 인지 확인 front면 다음으로, 그렇지 않으면 아무것도 하지 않기.
    2. 클릭한 요소를 기준으로 다음 요소인 이미지를 확인
    3. 이미지를 확인 후 active 클래스 부여.
    4. 현재 클릭한 요소가 두 번째 클릭한 요소인지 확인.
      - 첫 번째 클릭인 경우 현재 클릭한 요소를 prevImage? 첫 번째 클릭한 요소인 것을 확인할 수 있는 방법을 이용하여 저장. 두 번째 클릭인 경우 확인
    5. 두 번째 클릭 확인의 경우 이전에 클릭한 요소와 비교
      - match로 숫자 뽑은 것을 비교하여, 문제를 해결해야 함.

    */

    // console.log("this");
    // console.log(this);
    // console.log("");
    var clickFlag = false;
    var target = e.target;
    var targetImage = target.nextElementSibling;
    var targetCard = target.parentNode;


    if (targetCard.className !== "card clear") {
      targetCard.className += " active";
    }

    var targetNumber = targetImage.style.backgroundImage;
    // var targetNumber = targetImage.style.backgroundImage.match(/\d{2}/g);
    // console.log("∇은 내가 찾아야 할 값.");
    // console.log("########################");
    // if(clickCheck()){return;}
    if (checkFlag) {
      checkFlag = false;
      var prevNumber = prevImage.style.backgroundImage;
      // var prevNumber = prevImage.style.backgroundImage.match(/\d{2}/g);
      /* 비교대상을 이걸로 할 필요는 없어보임. 그냥 backgroundImage의 링크를 가지고 비교하는게 더 좋아보임. 그러면 배열형태도 아니기 때문에 [0] === [0] 을 비교할 필요도 없음. */
      console.log("두 번째 클릭일 때 실행될 코드");
      if (targetNumber[0] === prevNumber[0]) {
        console.log("두 이미지가 일치할 때  실행될 코드");
        /*
        1. 스코어의 점수를 올리기
        2. 다시섞기를 위해서 어떤 배열을 준비하기?
          - 다시 섞을 때, 통과한 숫자는 다시 보여져야 하기 때문에 어떻게 만들지에 대해서 조금 더 생각해보기.
          - 짝이 맞았을 때 특정 클래스 또는 확인할 수 있는 값을 card에 부여해서 특정 클래스가 부여된 카드는 섞더라도 앞을 보여줄 수 있도록 만들기.
          예를들어 clear 클래스를 부여해서 clear 클래스가 부여되어 있다면, 앞을 보여줄 수 있도록 만들기.
          
          이미지 전체를 섞지만 clear 클래스가 부여되어 있다면 뒷면이 보일 수 있도록 만들고 싶긴 한데 어떻게 만들지?
          동일하다는 것을 확인 후 클릭금지를 풀어줘야 할 것 같음. 중복입력으로 인한 버그가 존재함.

        */
        setTimeout(function () {
          targetCard.className = "card clear";
          prevImage.parentNode.className = "card clear";
        }, 500);
      } else {
        console.log("두 이미지가 다를 때  실행될 코드");
        if(clickCheck()){return;}
        setTimeout(function () {
          targetCard.className = "card";
          prevImage.parentNode.className = "card";
        }, 1000);
        /* 이미지 한 개를 누른 뒤 다시 섞기를 눌렀을 경우 어떻게 할 것인지?
          
        일단 card clear를 className으로 가지지 않은 요소들에 대해서 작업을 진행하는 것도 괜찮을 것 같은데.
        위치를 섞는게 문제긴 한데... 섞는 것을 어떻게 처리하는지가 관건..
        점수를 -5점 할 수 있는 내용 추가하기.
         */
      }
      return clickFlag, checkFlag;
    } else {
      /* 첫 번째 실행 또는 그 외의 경우 실행할 코드 */
      console.log("첫 번째 클릭일 때 실행될 코드");
      checkFlag = true;
      prevImage = targetImage;
      /* 두 번째 클릭에서 기존 prev를 가지고 있어도 첫 번째 클릭으로 새로운 값이 덮어써지기 때문에 문제는 없다. */
      return clickFlag, checkFlag, prevImage;
    }
  });

  /* (END) 카드를 클릭했을 때 할 동작 */


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
    playInfo.style.display = "none";
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
    showCount();
  };

  function showCount() {

  }
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