let dongInfo = new Object();
let startNumArray = new Array();
let endNumArray = new Array();
let remainder, thousands, under;

function praw() {
ellipse(100,100,100,100);
}


function preload() {
  // Get the most recent earthquake in the database
  let url = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/1/1';
  rawJSON = loadJSON(url);
  let totalNum = rawJSON.GeoInfoPublicToilet.list_total_count;

  if (totalNum > 1000) {
    remainder = totalNum % 1000;
    thousands = totalNum / 1000;
    for (let i = 0; i < thousands; i++) {
      endNumArray[i] = (i + 1) * 1000;
      startNumArray[i] = i * 1000 + 1;
    }
    endNumArray[thousands] = totalNum;
    startNumArray[thousands] = thousands * 1000 + 1;
  } else {
    endNumArray[0] = totalNum;
    endNumArray[0] = 1;
  }

  data();
}

function data {
  for (let i = 0; i < thousands; i++) {
    let url = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/' + startNumArray[i] + '/'
    endNumArray[i]
    let splitedJSON = loadJSON(url);
    let indexMax = 1000;
    if (i == thousands - 1) indexMax = endNumArray[thousands];

    for (let j = 0; j < indexMax; j++) {
      for (var p = 0; p < Object.keys(dongInfo).length; i++) {
        if (dongInfo[p] == splitedJSON.row[j].HNR_NAM) dongInfo[p] += 1
        else dongInfo[splitedJSON.row[j].HNR_NAM] = 1;
      }
    }
  }
  text(1,1,'dongInfo');
}
