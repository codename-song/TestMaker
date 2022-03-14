// 키값 미리 배정
const db_largePart = "largepart";
const db_smallPart = "smallpart";

const pig = "돼지";
const cow = "소";

const largeQuestCount = 20;
const smallQuestCount = 4;

let question = {
  type: "",
  name: "",
  frontImg: "",
  imgList1: "",
  imgList2: "",
  imgList3: "",
  currentNum: 0,
  isRight: false,
};

var pig_questionList = new Array();
var cow_questionList = new Array();
let isAllLoaed = false;

var testQuestion_List = new Array();

var tempData = question;

//window.onload = function loadAllData() {
function initializeData(loadtype) {
  var url = "./datafiles/questionDB.xlsx";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  let loadedData = new Array();

  oReq.onload = function (e) {
    pig_questionList = [];
    cow_questionList = [];
    var arraybuffer = oReq.response;

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i)
      arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    var workbook = XLSX.read(bstr, { type: "binary" });

    /* DO SOMETHING WITH workbook HERE */
    //var first_sheet_name = workbook.SheetNames[0];
    var first_sheet_name = loadtype;
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
    loadedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    if (!isAllLoaed) {
      for (var i = 0; i < loadedData.length; i++) {
        if (loadedData[i].type == "pig") {
          pig_questionList.push(loadedData[i]);
          pig_questionList[i].frontImg = pig_questionList[i].imgList1;
          pig_questionList[i].isRight = false;
        } else if (loadedData[i].type == "cow") {
          cow_questionList.push(loadedData[i]);
          cow_questionList[cow_questionList.length - 1].frontImg =
            cow_questionList[cow_questionList.length - 1].imgList1;
          cow_questionList[cow_questionList.length - 1].isRight = false;
        } else {
          console.log("wWTFFFFFF");
        }
        if (i >= loadedData.length - 1) {
          isAllLoaed = true;
        }
      }
    }

    if (isAllLoaed) {
      switch (loadtype) {
        case db_largePart:
          setQuestion(largeQuestCount);
          break;
        case db_smallPart:
          setQuestion(smallQuestCount);
          break;
        default:
          console.log("enable to set question list");
          break;
      }
    }
  };
  oReq.send();
}

//}

function setQuestion(countType) {
  if (!isAllLoaed) return;

  // 총 20개의 문제 출제
  // 돼지에서 10개 랜덤추출
  // 소 에서 10개 랜덤 추출
  // 20개의 리스트에 다 집어 넣은 뒤, 배열 섞기
  // for 문 돌려서 문제 만들기

  pig_questionList.sort(() => Math.random() - 0.5);
  cow_questionList.sort(() => Math.random() - 0.5);

  for (i = 0; i < countType / 2; i++) {
    testQuestion_List.push(pig_questionList[i]);
    testQuestion_List.push(cow_questionList[i]);
  }

  testQuestion_List.sort(() => Math.random() - 0.5);

  console.log(testQuestion_List);

  for (i = 0; i < testQuestion_List.length; i++) {
    testQuestion_List[i].currentNum = i + 1;
    createQuestionElement(testQuestion_List[i]);
  }
}

// Html에 문제 출제하기
function createQuestionElement(tempData) {
  // create question html divs
  var qdiv = document.createElement("div");
  qdiv.innerHTML =
    document.getElementsByClassName("question-column")[0].innerHTML;

  qdiv.className = "question-column";
  qdiv.getElementsByClassName("question-column__image")[0].src =
    tempData.frontImg;
  qdiv.getElementsByClassName("question-column__number")[0].innerHTML =
    tempData.currentNum;

  document.getElementById("question-field").appendChild(qdiv);
}

function createAnswerElement(tempData) {
  // create question html divs
  var adiv = document.createElement("div");
  adiv.innerHTML =
    document.getElementsByClassName("answer__column")[0].innerHTML;

  adiv.className = "answer__column";
  adiv.getElementsByClassName("answer__column__number")[0].innerHTML =
    tempData.currentNum;

  if (tempData.isRight) {
    adiv.getElementsByClassName("answer__column__isanswer")[0].innerHTML = "O";
    adiv.getElementsByClassName("answer__column__explanation")[0].innerHTML =
      "";
  } else {
    var temptype = "none";
    if (tempData.type == "pig") {
      temptype = "돼지";
    } else {
      temptype = "소";
    }
    adiv.getElementsByClassName("answer__column__isanswer")[0].innerHTML = "X";
    adiv.getElementsByClassName("answer__column__isanswer")[0].style.color =
      "red";
    adiv.getElementsByClassName("answer__column__explanation")[0].innerHTML =
      "종류 : " +
      temptype +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
      " 부위명 : " +
      tempData.name;
  }

  document.getElementById("answer-field").appendChild(adiv);
}

function runAnswerCheck(questionType, countType) {
  for (i = 0; i < countType; i++) {
    compareAnswer(
      questionType,
      testQuestion_List[i],
      document.getElementsByClassName("question-column")[i + 1]
    );
  }
  // 정답체크 끝난 후 데이터 전달준비
  localStorage.setItem("Answers", JSON.stringify(testQuestion_List));
}

function compareAnswer(quesiontType, answerData, tempData) {
  const meatNodeList = document.getElementsByName("meattype");

  //정답체크
  if (
    answerData.name ==
    tempData
      .getElementsByClassName("question-column__answerform")[0]
      .getElementsByClassName("question-column__answerform__partname")[0]
      .getElementsByClassName("question-column__answerform__partname__input")[0]
      .value
  ) {
    // 이름을 알맞게 적은 경우
    // 고기 타입체크
    switch (quesiontType) {
      case db_largePart:
        meatNodeList.forEach((node) => {
          if (node.checked) {
            if (node.value == answerData.type) {
              //고기 종류까지 정답인 경우
              answerData.isRight = true;
              console.log("Right One!!!!!");
            }
          }
        });
        break;
      case db_smallPart:
        answerData.isRight = true;
        break;
      default:
        console.log("cant identify the quesiton type");
        break;
    }
  } else {
    //틀림
    console.log(
      answerData.currentNum +
        " : wrong... " +
        tempData
          .getElementsByClassName("question-column__answerform")[0]
          .getElementsByClassName("question-column__answerform__partname")[0]
          .getElementsByClassName(
            "question-column__answerform__partname__input"
          )[0].value +
        ", A : " +
        answerData.name
    );
  }
}

//
function initAnswerPage(questionCount) {
  var answerCount = 0;
  var testResults = JSON.parse(localStorage.getItem("Answers"));
  for (i = 0; i < testResults.length; i++) {
    if (testResults[i].isRight) {
      answerCount++;
    }

    createAnswerElement(testResults[i]);
  }
  document.getElementsByClassName("answer-header__result")[0].innerHTML =
    "점수 : " + answerCount + " / " + questionCount;
  console.log(testResults);
}
