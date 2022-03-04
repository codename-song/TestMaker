
let question =  {
  name: "",
  frontImg: "",
  imgList: ["","",""],
  type: "",
  currentNum: 0,
};

var pig_questionList = new Array();
var cow_questionList = new Array();

window.onload = function () {

  var url = "/datafiles/questionDB.xlsx";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  let loadedData = new Array();

  oReq.onload = function(e) {
    var arraybuffer = oReq.response;

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {type:"binary"});

    /* DO SOMETHING WITH workbook HERE */
    var first_sheet_name = workbook.SheetNames[0];
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
    loadedData = XLSX.utils.sheet_to_json(worksheet,{raw:true});

    for(var i = 0 ; i < loadedData.length ; i++){

      var tempData = question;
  
      tempData.name = loadedData[i].name;
      tempData.type = loadedData[i].type;
      tempData.frontImg = loadedData[i].imgList1;
      tempData.imgList[0] = loadedData[i].imgList1;
      tempData.imgList[1] = loadedData[i].imgList1; // 임시로 1로만 지정
      tempData.imgList[2] = loadedData[i].imgList1; // 임시로 1로만 지정

      if(loadedData[i].type == "돼지"){
        pig_questionList.push(tempData);
      }
      else if (loadedData[i].type == "소"){
        cow_questionList.push(tempData);
      }
    }
  }

  oReq.send();

}
