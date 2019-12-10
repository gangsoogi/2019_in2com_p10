var population = null;
var gu_nameAry = ['강남구', '강동구', '강서구', '강북구', '관악구', '광진구', '구로구', '금천구',
'노원구', '동대문구', '도봉구', '동작구', '마포구', '서대문구', '성동구',
'성북구', '서초구', '송파구', '영등포구', '용산구', '양천구', '은평구', '종로구', '중구', '중랑구'];
var gu_toiletnumAry = new Array(25).fill(0);
var urlAry = [];
var totalToilet;
var executionCount = 0;
var nam, mok;
var perReq = 1000;
var delayMili = 100;

var total = 25;
var collections = new Array(25).fill(0);
var size = 0;
var toilets = [];
var men = [];
var waittill = new Array(25).fill(120);
var y = new Array(25).fill(0);
var aloneY = new Array(25).fill(0);
var doneY = new Array(25).fill(0);
var doneX = new Array(25).fill(0);
var doneSpeed = [];
var hahaha = 0;
var searchcall = new Array(25).fill(0);

function preload() {
  var url01 = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/1/1';
  loadJSON(url01, urlMaker);
  var url02 = 'http://openapi.seoul.go.kr:8088/6b704b666279706431397657727356/json/octastatapi419/80/105/';
  loadJSON(url02, seoulcity);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  img = createGraphics(1500, 1000);
  detail = createGraphics(400, 200);
  //원 묶음과는 별개로 움직일 원들
  for (i = 0; i < total; i++) {
    doneSpeed.push(random(-1, 1));
  }
  which = createInput();
  which.position(width/2-which.width/4*3, height/15*14);
  search = createButton('Search');
  search.position(which.x+which.width, which.y);
  search.mousePressed(ctrlf);
}

function seoulcity( data ) {
  population = data.octastatapi419;
}

function urlMaker(url) {
  totalToilet = url.GeoInfoPublicToilet.list_total_count;
  mok = Math.floor(totalToilet / perReq);
  console.log(mok);
  nam = totalToilet % perReq;
  console.log(nam);

  for (var i = 0; i < mok; i++) {
    madeURL = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/'
    + String(i * perReq + 1) + '/' + String((i + 1) * perReq);
    urlAry[i] = madeURL;
    console.log(madeURL);
  }
  urlAry[mok] = 'http://openAPI.seoul.go.kr:8088/6e54665654796f7538337a424e6865/json/GeoInfoPublicToilet/'
   + String(mok * perReq + 1) + '/' + String(totalToilet);
  console.log(urlAry[mok]);

  for (let i = 0; i < mok+1; i++) {
    task(i);
  }

  function task(i) {
    setTimeout(function() {
    loadJSON(urlAry[i], wordCounter);
    }, delayMili * i);
  }
}


function wordCounter(madeURL) {
  var end = 1000;
  if (executionCount == mok) {end = nam;}
  for (var k = 0; k < end; k++) {
    let word = madeURL.GeoInfoPublicToilet.row[k].GU_NM;
    //console.log(word);
    if (gu_nameAry.includes(word)) {
      let index = gu_nameAry.indexOf(word);
      gu_toiletnumAry[index] = gu_toiletnumAry[index] + 1;
    }
  }
  executionCount += 1;
   console.log(gu_toiletnumAry);
}


function collecting() { //화장실과 인구 정리에 쓰일 collections array
  for(var i=0; i<total; i++) {  
    t = 0;
    for(var j = 0; j < total; j ++) {
      if (gu_nameAry[j] == population.row[i].JACHIGU) {
        t = gu_toiletnumAry[j];
        break
      }
    }
    var a = {
      name : population.row[i].JACHIGU,
      pop : population.row[i].GYE_1,
      toilet : t,
      por : (population.row[i].GYE_1 / t)
    }
    collections[i] = a;  
  }
  collections.sort(function(a, b) {
    return a["por"] - b["por"] ;
  });
}

function toils() { //화장실 표현에 쓰일 toilets array
  for (var i = 0; i < total; i++) {
    var t = {
      name : collections[i].name, //구 이름
      num: collections[i].toilet, //화장실 개수이자, 나누기 3 하면 세로 길이
      size : img.width/25 - img.width/100, //가로 길이
      x : img.width/25 * i + img.width/200, //x 좌표
      y : img.height/3*2 - 30, //y 좌표
      c : color(i*10, 0, (25-i)*10) //색깔
    }
    toilets[i] = t;
  }
}

function popul() { //인구 표현에 쓰일 men array
  for (var i = 0; i < total; i++) {
    m = collections[i].por; // 인구수 나누기 화장실 수
    n = round(m/200);
    var man = {
      name : toilets[i].name, // 구 이름
      num :  n, //원의 개수 (원 하나 = 인구 200명으로, 원이 2개면 화장실 당 인구 수가 400명임)
      size : toilets[i].size*0.2, // 지름
      x : toilets[i].x + toilets[i].size/2, // x좌표 
      y : toilets[i].y - toilets[i].size*0.2, // 가장 아래에 그려질 원의 y좌표
      speed : img.height/1500000000*collections[i].pop //원 묶음의 이동 속도
    }
    men[i] = man;
  }
}

function visualizing(a) {
  img.background(0);
  let gap = img.height/80; //원들의 y좌표 간격
  //눈금 x
  for (var c = 0; c < men[24].num; c++) {
    if (c%5 == 0) {
      img.stroke(50);
      img.line(0, men[0].y - c*gap + 6, width, men[0].y - c*gap+ 6);
    }
  }
  for (var i = 0; i < total; i++) {
    //눈금 y
    //검색 표시
    if (searchcall[i] == 1) {
      img.stroke(255); 
      img.strokeWeight(3);     
    } else {
      img.strokeWeight(1);
      img.stroke(50);
    }
    img.line(men[i].x, img.height/5+40, men[i].x, toilets[i].size*0.8+ toilets[i].y-toilets[i].size*0.4)
    img.noStroke();

    //a값이 1이면 딜레이가 들어가고, 1이 아니면 딜레이 없음
    if (a == 1) {
      if (waittill[i] < 30) { 
        img.fill(toilets[i].c);
        for (var k = 0; k < men[i].num; k++) {
          img.ellipse(men[i].x, men[i].y - k*gap + y[i], men[i].size, men[i].size);
        }
        waittill[i] ++;
      } else {
        waittill[i] = 120;
        //원 묶음
        img.fill(toilets[i].c);
        if (y[i] < gap) y[i] += men[i].speed; //y[i]는 가장 아래 원과 화장실 그림 간의 거리임
        else y[i] = 0;
        for (var k = 0; k < men[i].num; k++) {
          img.ellipse(men[i].x, men[i].y - k*gap + y[i], men[i].size, men[i].size);
        }
        //빠르게 움직이는 원
        var last = men[i].y - men[i].num*gap + y[i]; //천천히 움직이는 원 중 가장 위에 있는 원의 y좌표
        if (aloneY[i] < last) aloneY[i] += last/(gap/men[i].speed); //aloneY[i]는 빠르게 움직이는 원의 y좌표임
        else {
          aloneY[i] = 0;
          waittill[i] = 0;
        }
        img.fill(toilets[i].c);
        img.ellipse(men[i].x, aloneY[i], men[i].size, men[i].size);
      }
    } else {
      img.fill(toilets[i].c);
      if (y[i] < gap) y[i] += men[i].speed; //y[i]는 가장 아래 원과 화장실 그림 간의 거리임
      else y[i] = 0;
      for (var k = 0; k < men[i].num; k++) {
        img.ellipse(men[i].x, men[i].y - k*gap + y[i], men[i].size, men[i].size);
      }
      //빠르게 움직이는 원
      var last = men[i].y - men[i].num*gap + y[i]; //천천히 움직이는 원 중 가장 위에 있는 원의 y좌표
      if (aloneY[i] < last) aloneY[i] += last/(gap/men[i].speed); //aloneY[i]는 빠르게 움직이는 원의 y좌표임
      else aloneY[i] = 0;
      img.fill(toilets[i].c);
      img.ellipse(men[i].x, aloneY[i], men[i].size, men[i].size);
    }
  
    //밑으로 나가는 원
    img.fill(30);
    if (doneY[i] < img.height/5) {
      doneY[i] += men[i].speed*5;
      doneX[i] += doneSpeed[i];
    } else {
      doneY[i] = 0;
      doneX[i] = 0;
    }
    img.ellipse(men[i].x + doneX[i], toilets[i].y + toilets[i].num/3 + doneY[i], men[i].size, men[i].size);
  }
  
  for (i = 0; i < total; i ++) {
    //화장실 
    img.fill(toilets[i].c);
    img.noStroke();
    img.ellipse(toilets[i].x+toilets[i].size/2, toilets[i].size*0.8+ toilets[i].y-toilets[i].size*0.4, toilets[i].size*0.8);
    img.rect(toilets[i].x, toilets[i].size*0.8+ toilets[i].y-men[i].size*0.2, toilets[i].size, toilets[i].num/3);

    //텍스트
    img.textAlign(CENTER)
    img.fill(255);
    img.textSize(12);
    img.text(collections[i].pop, men[i].x, img.height/5 + 20); //인구
    img.textSize(14);
    img.text(men[i].name, men[i].x, img.height/5); // 구 이름
    img.textSize(15);
    img.text(men[i].num, men[i].x, men[i].y+32); // 원 개수
    img.text(toilets[i].num, men[i].x, toilets[i].size*0.8+ toilets[i].y-men[i].size*0.2 + toilets[i].num/3 + 20); // 화장실 개수
  }
}

function description() {
  detail.background(0);
  detail.fill(255);
  detail.textSize(25);
  detail.text('     DEGREE OF CONGESTION', 0, detail.height/3);
  detail.textSize(20);
  detail.text('(1 circle = 200 people per a toilet)', 20, detail.height/2 - 10, )
  detail.textSize(25);
  detail.text('     NUMBER OF PUBLIC TOILETS', 0, detail.height/3*2)
  detail.fill(120, 20, 120);
  detail.ellipse(15, detail.height/3-10, 30, 30);
  detail.rect(0, detail.height/3*2-25, 30, 30)
}

function ctrlf() {
 for (let p = 0; p < total; p ++) {
    searchcall[p] = 0;
    if (men[p].name == which.value()) {
      searchcall[p] = 1;
    }
  } 
}

function draw() {  
  resize1 = width/4*3/img.width;
  resize2 = (width-(width/10+width/4*3))/detail.width;
  if (hahaha < 120) {
    //120프레임 동안 로딩
    collecting();
    toils();
    popul() 
    background(30);
    hahaha++;
  } else {
    //로딩 끝나고 그리기 시작
    background(0);
    visualizing(1);
    description();
    image(img, width/10, height/2 - img.height*resize1/2, width/4*3, img.height*resize1);  
    image(detail, width/10+width/4*3, height/2-detail.height/2*resize2, width-(width/9+width/4*3), detail.height*resize2);
  }
  textAlign(CENTER);
  fill(255);
  textSize(width/60);
  text('Which city has the longest toilet waiting line?', width/2, height/10);
}
