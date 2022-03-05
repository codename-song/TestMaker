let question = {
  type: "",
  name: "",
  frontImg: "",
  imgList1: "",
  imgList2: "",
  imgList3: "",
  currentNum: 0,
};

var pig_questionList = new Array();
var cow_questionList = new Array();
let isAllLoaed = false;

var testQuestion_List = new Array();

var tempData = question;

//window.onload = function loadAllData() {

var url = "/datafiles/questionDB.xlsx";
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
  for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  var bstr = arr.join("");

  /* Call XLSX */
  var workbook = XLSX.read(bstr, { type: "binary" });

  /* DO SOMETHING WITH workbook HERE */
  var first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
  console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
  loadedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

  if (!isAllLoaed) {
    for (var i = 0; i < loadedData.length; i++) {
      if (loadedData[i].type == "돼지") {
        pig_questionList.push(loadedData[i]);
        pig_questionList[i].frontImg = pig_questionList[i].imgList1;
      } else if (loadedData[i].type == "소") {
        cow_questionList.push(loadedData[i]);
        cow_questionList[cow_questionList.length - 1].frontImg =
          cow_questionList[cow_questionList.length - 1].imgList1;
      } else {
        console.log("wWTFFFFFF");
      }
      if (i >= loadedData.length - 1) {
        isAllLoaed = true;
        console.log("all data have been loaded");
        console.log(pig_questionList);
        console.log(cow_questionList);
      }
    }
  }

  if (isAllLoaed) {
    setQuestion();
  }
};
oReq.send();
//}

function setQuestion() {
  if (!isAllLoaed) return;
  console.log("wait for data load");
  if (pig_questionList[0] != null) {
    document.getElementsByClassName("question-column__image")[0].src =
      pig_questionList[0].frontImg;
    console.log(
      "try to change src : " +
        document.getElementsByClassName("question-column__image")[0].src
    );
  } else {
    console.log("it is null");
  }

  // 총 20개의 문제 출제
  // 돼지에서 10개 랜덤추출
  // 소 에서 10개 랜덤 추출
  // 20개의 리스트에 다 집어 넣은 뒤, 배열 섞기
  // for 문 돌려서 문제 만들기

  pig_questionList.sort(() => Math.random() - 0.5);
  cow_questionList.sort(() => Math.random() - 0.5);

  for (i = 0; i < 10; i++) {
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

function createQuestionElement(tempData) {
  // create question html divs
  var qdiv = document.createElement("div");
  qdiv.innerHTML =
    document.getElementsByClassName("question-column")[0].innerHTML;

  qdiv.getElementsByClassName("question-column__image")[0].src =
    tempData.frontImg;
  qdiv.getElementsByClassName("question-column__number")[0].innerHTML =
    tempData.currentNum;
  document.getElementById("question-field").appendChild(qdiv);
}
