var guAry = ['강남구', '강동구', '강서구', '강북구', '관악구', '광진구', '구로구', '금천구', '노원구', '동대문구', '도봉구', '동작구', '마포구', '서대문구', '성동구', '성북구', '서초구', '송파구', '영등포구', '용산구', '양천구', '은평구', '종로구', '중구', '중랑구'];
var guNumAry = new Array(25).fill(0);
var totalGu = 25;


function preload() {
  var url = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/1/1';
  loadJSON(url, handler);
}

function handler(url) {
  for (var i = 0; i < 2000; i++) {
    url1 = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/' + String(i + 1) + '/' + String(i + 1);
    loadJSON(url1, jsoner);
  }

  for (var i = 2000; i < url.GeoInfoPublicToilet.list_total_count; i++) {
    url1 = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/' + String(i + 1) + '/' + String(i + 1);
    loadJSON(url1, jsoner);
  }




}

function jsoner(url1) {
  let jsoned = url1.GeoInfoPublicToilet.row[0].GU_NM;
  if (guAry.includes(jsoned)) {
    let index = guAry.indexOf(jsoned);
    guNumAry[index] = guNumAry[index] + 1;
  }
}

function draw(){
  console.log(guNumAry);
}
var guAry = ['강남구', '강동구', '강서구', '강북구', '관악구', '광진구', '구로구', '금천구', '노원구', '동대문구', '도봉구', '동작구', '마포구', '서대문구', '성동구', '성북구', '서초구', '송파구', '영등포구', '용산구', '양천구', '은평구', '종로구', '중구', '중랑구'];
var guNumAry = new Array(25).fill(0);
var totalGu = 25;


function preload() {
  var url = 'https://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/1/1';
  loadJSON(url, handler);
}

function handler(url) {
  for (var i = 0; i < 2000; i++) {
    url1 = 'https://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/' + String(i + 1) + '/' + String(i + 1);
    loadJSON(url1, jsoner);
  }

  for (var i = 2000; i < url.GeoInfoPublicToilet.list_total_count; i++) {
    url1 = 'https://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/' + String(i + 1) + '/' + String(i + 1);
    loadJSON(url1, jsoner);
  }




}

function jsoner(url1) {
  let jsoned = url1.GeoInfoPublicToilet.row[0].GU_NM;
  if (guAry.includes(jsoned)) {
    let index = guAry.indexOf(jsoned);
    guNumAry[index] = guNumAry[index] + 1;
  }
}

function draw(){
  console.log(guNumAry);
}
