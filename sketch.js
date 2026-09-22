//p5.js 期末作品：不可互動 四季之樹 

// === 變數宣告 ===

// 季節與計時控制系統
let season = 0;                     // 目前季節：0:春, 1:夏, 2:秋, 3:冬
let timer = 0;                      // 季節計時器
let seasonDuration = 600;           // 單一季節持續的總幀數

// 季節播放序列與防呆機制
let seasonSequence = [0, 1, 2, 3]; // 第一輪固定序列：春、夏、秋、冬
let sequenceIndex = 0;             // 目前播放到清單中的索引位置

// 色彩轉換與漸變控制
let bgColors = [];                  // 儲存四季背景顏色的陣列
let treeColors = [];                // 儲存四季樹顏色的陣列
let currentBgColor;                 // 背景顏色
let currentTreeColor;               // 樹冠顏色
let startBgColor;                   // 換季起點背景顏色
let startTreeColor;                 // 換季起點樹冠顏色

// 四季環境景物與動態粒子
let leafClusters = [];              // 大樹葉片叢數據陣列
let particles = [];                 // 飄落的天氣粒子陣列
let snowflakeGraphic;               // 雪花圖形

// 四季場景元件漸變控制
let sunOpacity = 0;                 // 春天太陽
let chimeOpacity = 0;               // 夏天風鈴
let lanternOpacity = 0;             // 秋天燈籠
let winterElementsOpacity = 0;      // 冬天雪人與聖誕樹

// 獨立生物類別動態陣列 
let butterflies = [];               // 春天蝴蝶
let fireflies = [];                 // 夏天螢火蟲
let birds = [];                     // 秋天飛鳥


// === 初始設定 ===
function setup() {
  createCanvas(windowWidth, windowHeight); // 設定為全螢幕畫布
  angleMode(DEGREES);
  noStroke();
  
  // 儲存四季背景顏色數據
  bgColors = [
    color(215, 235, 245), // 春
    color(255, 248, 205), // 夏
    color(255, 225, 190), // 秋
    color(35, 45, 75)      // 冬
  ];
  
  // 儲存四季樹冠葉片不透明度與顏色數據
  treeColors = [
    color(255, 170, 190, 255), // 春
    color(60, 160, 50, 255),   // 夏
    color(210, 70, 20, 255),   // 秋
    color(245, 250, 255, 240)  // 冬
  ];

  // 初始化當前季節的背景與大樹顏色
  currentBgColor = bgColors[season];
  currentTreeColor = treeColors[season];

  // 隨機計算並產生100個大樹葉片叢的座標與尺寸
  for(let i = 0; i < 100; i++) {
    let angle = random(360);
    let r = random(0, 120); 
    let cx = width/2 + cos(angle) * r * 1.3;
    let cy = height/2 - 80 + sin(angle) * r * 0.9;
    let cSize = random(40, 90);
    leafClusters.push({x: cx, y: cy, size: cSize});
  }

  // 冬天：六角雪花
  snowflakeGraphic = createGraphics(40, 40);
  snowflakeGraphic.angleMode(DEGREES);
  snowflakeGraphic.translate(20, 20); 
  snowflakeGraphic.stroke(255); 
  snowflakeGraphic.strokeWeight(1.5);
  snowflakeGraphic.strokeCap(ROUND);
  let s = 12; 
  for (let i = 0; i < 6; i++) {
    snowflakeGraphic.line(0, 0, 0, -s);
    snowflakeGraphic.line(0, -s*0.4, s*0.3, -s*0.7);
    snowflakeGraphic.line(0, -s*0.4, -s*0.3, -s*0.7);
    snowflakeGraphic.rotate(60);
  }
}

// 主繪圖迴圈
function draw() {
  timer++;

  // 換季：第一輪春夏秋冬 之後隨機打亂
  if (timer > seasonDuration) {
    sequenceIndex++; // 下一個季節
    
    // 當這一輪的 4 個季節都播放完畢時
    if (sequenceIndex >= 4) {
      let lastSeason = seasonSequence[3]; // 先記錄上一輪結束時的最後一個季節
      
      // 使用 p5.js 內建的 shuffle 把 [0, 1, 2, 3] 隨機打亂
      seasonSequence = shuffle([0, 1, 2, 3]);
      
      // 避免連續出現兩個一模一樣的季節
      while (seasonSequence[0] === lastSeason) {
        seasonSequence = shuffle([0, 1, 2, 3]);
      }
      
      sequenceIndex = 0; // 重置播放 開始新的一輪
    }
    
    season = seasonSequence[sequenceIndex]; // 正式切換季節
    timer = 0; // 計時器歸零

    // 記錄換季瞬間的畫面顏色，作為新季節漸變的起始顏色
    startBgColor = currentBgColor;
    startTreeColor = currentTreeColor;
  }

  // 初始安全設定：確保第一輪剛按下 Play 時有正確的起點
  if (!startBgColor) {
    startBgColor = currentBgColor;
    startTreeColor = currentTreeColor;
  }

  // 時間漸變
  let transitionFrames = 150; //淡淡暈染過去
  let amt = constrain(timer / transitionFrames, 0, 1); // 算出 0.0 到 1.0 的百分比進度
  
  currentBgColor = lerpColor(startBgColor, bgColors[season], amt);
  currentTreeColor = lerpColor(startTreeColor, treeColors[season], amt);

  background(currentBgColor);
  
//利用季節變數去控制不透明度變數
  // === 春天太陽 ===
  if (season === 0) sunOpacity = lerp(sunOpacity, 255, 0.02);
  else sunOpacity = lerp(sunOpacity, 0, 0.05);
  if (sunOpacity > 1) drawSun(sunOpacity);

  // === 夏天風鈴 ===
  if (season === 1) chimeOpacity = lerp(chimeOpacity, 255, 0.02);
  else chimeOpacity = lerp(chimeOpacity, 0, 0.05);
  if (chimeOpacity > 1) drawWindChime(chimeOpacity);

  // === 秋天燈籠 ===
  if (season === 2) lanternOpacity = lerp(lanternOpacity, 255, 0.02);
  else lanternOpacity = lerp(lanternOpacity, 0, 0.05);
  if (lanternOpacity > 1) drawLantern(lanternOpacity);

  // === 冬天雪人與聖誕樹 ===
  if (season === 3) winterElementsOpacity = lerp(winterElementsOpacity, 255, 0.02);
  else winterElementsOpacity = lerp(winterElementsOpacity, 0, 0.05);
  
  if (winterElementsOpacity > 1) {
    drawChristmasTree(winterElementsOpacity, 0.7); // 左下角聖誕樹
    drawSnowman(winterElementsOpacity, 0.7);       // 右下角雪人
  }

  // === 畫大樹 ===
  drawTree();

  // === 春天蝴蝶 ===
  if (season === 0 && timer > 200 && timer % 60 === 0 && butterflies.length < 6) {
    butterflies.push(new Butterfly());
  }
  updateArray(butterflies);

  // === 夏天螢火蟲 ===
  if (season === 1 && timer > 200 && timer % 60 === 0 && fireflies.length < 6) {
    fireflies.push(new Firefly());
  }
  updateArray(fireflies);

  // === 秋天飛鳥 ===
  if (season === 2 && timer > 150 && timer % 35 === 0 && birds.length < 6) {
    birds.push(new Bird());
  }
  updateArray(birds);
  
  // === 產生四季天氣粒子 ===
  if (frameCount % 3 === 0) particles.push(new Particle(season));
  updateArray(particles);
}

// 陣列記憶體管理：清除死掉的物件
function updateArray(arr) {
  for (let i = arr.length - 1; i >= 0; i--) { //倒序迴圈
    let obj = arr[i];
    obj.update(season);
    obj.display();
    if (obj.isDead()) arr.splice(i, 1);
  }
}

// === 春天太陽 ===
function drawSun(alpha) {
  push();//開啟一個獨立的虛擬圖層
  translate(100, 100); 
  rotate(frameCount * 0.2); 

  //8 道太陽光芒
  stroke(255, 190, 30, alpha); 
  strokeWeight(6);
  strokeCap(ROUND); 
  
  for (let i = 0; i < 8; i++) {
    push();
    rotate(i * 45); 
    line(55, 0, 80, 0); 
    pop();
  }
  //太陽的雙心主體
  noStroke();
  fill(255, 215, 0, alpha); 
  circle(0, 0, 90);
  fill(255, 160, 0, alpha * 0.4); 
  circle(0, 0, 50);
  pop();
}

// === 夏天風鈴 ===
function drawWindChime(alpha) {
  push();
  translate(120, 0); 

  // 使用正弦函數計算風鈴隨時間左右擺動的動態角度
  let mainSwing = sin(frameCount * 2) * 8; 
  rotate(mainSwing);
  
  // 風鈴最上方的懸掛吊線
  stroke(20, alpha); 
  strokeWeight(2);
  line(0, 0, 0, 80);

  // 風鈴的半透明湖水藍玻璃罩主體
  fill(135, 206, 235, alpha * 0.9); 
  stroke(20, alpha); 
  strokeWeight(2.5);
  arc(0, 80, 70, 70, 180, 360, CHORD);

  // 玻璃罩上的白色反光幾何弧線線條
  noFill();
  stroke(255, alpha * 0.95);
  strokeWeight(3);
  strokeCap(ROUND);
  arc(0, 80, 50, 50, 280, 340); 
  strokeWeight(4);
  point(20, 65); 

  push();
  translate(0, 80); 

  // 連接內部風鈴撞針與下方短冊紙片的中央吊線
  stroke(20, alpha);
  strokeWeight(2);
  line(0, 0, 0, 20);

  // 繪製下方長方形短冊紙片的淺色實心底盤
  fill(250, 250, 245, alpha);
  stroke(20, alpha);
  strokeWeight(2.5);
  rect(-15, 20, 30, 75, 2); 

  // 使用自訂頂點圖形渲染短冊紙片下半部的藍色波浪狀漸層塊
  noStroke();
  fill(135, 206, 235, alpha); 
  beginShape();
  vertex(-14, 75);
  bezierVertex(-5, 70, 5, 80, 14, 75); 
  vertex(14, 94); 
  vertex(-14, 94); 
  endShape(CLOSE);

  // 為紙片內部的藍色波浪加上一條細緻的白色幾何分界線
  noFill();
  stroke(255, alpha);
  strokeWeight(2);
  beginShape();
  vertex(-14, 72);
  bezierVertex(-5, 67, 5, 77, 14, 72);
  endShape();

  // 重新疊加短冊紙片的外框線以確保圖層覆蓋正確
  noFill();
  stroke(20, alpha);
  strokeWeight(2.5);
  rect(-15, 20, 30, 75, 2);

  pop();
  pop();
}



// 秋天燈籠
function drawLantern(alpha) {
  push();
  translate(120, 0); 
  let swing = sin(frameCount * 2) * 5; 
  rotate(swing);

  // 繪製燈籠頂部的懸掛吊線
  stroke(20, alpha); 
  strokeWeight(2);
  line(0, 0, 0, 30);
  translate(0, 30);

  // 繪製燈籠背景的光暈效果
  noStroke();
  fill(255, 150, 50, alpha * 0.3); 
  circle(0, 35, 100);

  // 繪製燈籠紅色的實心橢圓主體
  fill(220, 60, 40, alpha * 0.95);
  stroke(20, alpha);
  strokeWeight(2);
  ellipse(0, 35, 60, 70);

  // 繪製燈籠主體內部的骨架弧線與中心不透明縱線
  noFill();
  stroke(180, 40, 20, alpha);
  strokeWeight(1.5);
  arc(0, 35, 25, 70, -90, 90);
  arc(0, 35, 25, 70, 90, 270);
  line(0, 0, 0, 70);

  // 繪製燈籠上緣與下緣的黑色蓋帽結構
  fill(40, alpha);
  noStroke();
  rect(-15, -3, 30, 6, 2); 
  rect(-15, 67, 30, 6, 2); 

  // 繪製燈籠底部的紅色裝飾流蘇線條
  stroke(220, 60, 40, alpha);
  strokeWeight(2);
  line(0, 73, 0, 95);
  line(-4, 73, -6, 92);
  line(4, 73, 6, 92);
  pop();
}

// 冬天聖誕樹
function drawChristmasTree(alpha, sizeScale) {
  push();
  translate(width * 0.2, height * 0.95); 
  scale(sizeScale);
  
  // 繪製聖誕樹木質樹幹
  fill(101, 67, 33, alpha); 
  rect(-15, -40, 30, 40);

  // 使用三個三角形疊加繪製出針葉樹冠層次
  fill(34, 139, 34, alpha); 
  triangle(-60, -40, 60, -40, 0, -110);
  triangle(-50, -80, 50, -80, 0, -140);
  triangle(-40, -110, 40, -110, 0, -160);

  // 繪製樹頂旋轉的金色五角星
  fill(255, 215, 0, alpha); 
  push();
  translate(0, -165);
  rotate(frameCount); 
  star(0, 0, 8, 16, 5); 
  pop();

  // 定義聖誕裝飾燈的色彩序列
  let colors = [
    color(255, 0, 0, alpha), 
    color(0, 0, 255, alpha), 
    color(255, 255, 0, alpha), 
    color(255, 105, 180, alpha) 
  ];
  
  // 聖誕裝飾燈的相對座標分佈數據
  let lightPos = [
    {x: -20, y: -50}, {x: 20, y: -60}, {x: 0, y: -90},
    {x: -30, y: -70}, {x: 30, y: -80}, {x: 10, y: -120},
    {x: -15, y: -130}
  ];

  // 透過正弦函數與映射機制實現裝飾燈的動態閃爍效果
  for (let i = 0; i < lightPos.length; i++) {
    let blink = map(sin(frameCount * 5 + i * 20), -1, 1, 100, 255);
    let c = colors[i % colors.length];
    c.setAlpha(blink * (alpha / 255)); 
    fill(c);
    circle(lightPos[i].x, lightPos[i].y, 10);
  }

  pop();
}

// 幾何星形繪製工具函式
function star(x, y, radius1, radius2, npoints) {
  let angle = 360 / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// 冬天雪人
function drawSnowman(alpha, sizeScale) {
  push();
  translate(width * 0.8, height * 0.95); 
  scale(sizeScale);
  noStroke();

  // 繪製雪人底部的半透明環境陰影
  fill(0, 0, 0, alpha * 0.2);
  ellipse(0, 10, 90, 20);

  // 使用三個圓形垂直疊加繪製出雪人的下身、中身與頭部
  fill(255, 255, 255, alpha);
  circle(0, -30, 80); 
  circle(0, -80, 60); 
  circle(0, -125, 45); 

  // 繪製眼睛細節
  fill(0, alpha);
  circle(-10, -130, 6);
  circle(10, -130, 6);

  // 繪製橘色三角形胡蘿蔔鼻子
  fill(255, 165, 0, alpha);
  triangle(0, -125, 0, -118, 20, -120);

  // 繪製衣服鈕扣細節
  fill(0, alpha);
  circle(0, -90, 6);
  circle(0, -75, 6);
  circle(0, -60, 6);

  // 繪製雪人的深色高帽與紅色緞帶裝飾
  fill(40, alpha);
  rect(-25, -150, 50, 5); 
  rect(-15, -180, 30, 30); 
  fill(220, 20, 60, alpha); 
  rect(-15, -155, 30, 5);

  // 繪製木枝樹幹造型的雙手線條
  stroke(101, 67, 33, alpha);
  strokeWeight(3);
  line(-25, -80, -50, -100); 
  line(-40, -92, -45, -80);  
  
  line(25, -80, 50, -100);  
  line(40, -92, 45, -80);   
  noStroke();

  pop();
}

// 大樹與樹冠
function drawTree() {
  push();
  translate(width / 2, height / 2 + 100); 

  let trunkColor = color(110, 65, 30); 
  stroke(trunkColor);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  
  // 繪製主幹分叉與上方次級枝幹的骨架粗線條
  strokeWeight(25);
  line(0, -20, -50, -100);
  line(0, -20, 50, -100);
  line(0, -30, 0, -130);
  
  strokeWeight(12);
  line(-30, -70, -110, -100);
  line(-40, -90, -70, -150);
  line(30, -70, 110, -100);
  line(40, -90, 70, -150);

  // 貝茲曲線繪製向下延伸的厚實樹根與大樹主幹基底
  noStroke();
  fill(trunkColor);
  beginShape();
  vertex(-80, 150);
  bezierVertex(-20, 120, -25, 40, -25, -40);
  vertex(25, -40);
  bezierVertex(25, 40, 20, 120, 80, 150);
  endShape(CLOSE);

  // 樹洞
  fill(70, 40, 15);
  ellipse(5, 50, 15, 35);
  fill(40, 20, 5);
  ellipse(5, 52, 8, 25);

  // 當前樹冠季節色彩的 RGB 數據
  let r = red(currentTreeColor);
  let g = green(currentTreeColor);
  let b = blue(currentTreeColor);
  let a = alpha(currentTreeColor);

  // 動態展縮機制：根據色彩藍色通道數值計算樹冠在不同季節的垂直扁平率
  noStroke();
  let dynamicFlatten = map(b, 50, 255, 1.0, 0.65, true); 

  // 分三層（暗調背景層、中間調主體層、高光前景層）疊加渲染大樹樹冠葉片群
  fill(r * 0.6, g * 0.6, b * 0.6, a);
  drawLeafClusters(1.1, 15, 0, dynamicFlatten); 
  fill(r * 0.9, g * 0.9, b * 0.9, a);
  drawLeafClusters(0.95, 0, 0, dynamicFlatten);
  fill(r * 1.2, g * 1.2, b * 1.2, a);
  drawLeafClusters(0.65, -15, -10, dynamicFlatten);

  pop();
}

// 樹冠葉片群組批量渲染工具函式
function drawLeafClusters(scaleFactor, offsetY, offsetX, flattenY) {
  // 定義 9 個核心葉片叢群組的相對分佈位置與基準半徑數據
  let clumps = [
    {x: 0, y: -200, r: 120}, {x: -80, y: -160, r: 120}, {x: 80, y: -160, r: 120},
    {x: -150, y: -100, r: 130}, {x: 150, y: -100, r: 130}, {x: -190, y: -30, r: 100},
    {x: 190, y: -30, r: 100}, {x: -80, y: -50, r: 140}, {x: 80, y: -50, r: 140}
  ];

  // 迭代繪製每個葉片叢，並套用動態縮放與扁平率幾何轉換
  for (let c of clumps) {
    let cx = c.x + offsetX;
    let cy = c.y + offsetY;
    let cr = c.r * scaleFactor;
    
    push();
    translate(cx, cy);
    scale(1.0, flattenY); 
    
    ellipse(0, 0, cr, cr * 0.8);
    ellipse(-cr * 0.35, cr * 0.15, cr * 0.7, cr * 0.6);
    ellipse(cr * 0.35, cr * 0.15, cr * 0.7, cr * 0.6);
    ellipse(-cr * 0.25, -cr * 0.25, cr * 0.6, cr * 0.5);
    ellipse(cr * 0.25, -cr * 0.25, cr * 0.6, cr * 0.5);
    pop();
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布尺寸
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 春天：櫻花瓣 / 夏天：綠葉 / 秋天：紅楓葉 / 冬天：六角雪花 
// 粒子類別 
class Particle {
  constructor(currentSeason) {
    this.season = currentSeason;
    this.x = random(width/2 - 200, width/2 + 200);
    this.y = random(height/2 - 150, height/2 + 50);
    this.size = random(4, 9);
    this.angle = random(360);
    this.noiseOffset = random(1000); 
    
    if (this.season === 0) { // 春天：櫻花瓣
      this.color = color(255, random(160, 200), random(180, 210));
      this.opacity = 220; 
      this.speedY = random(0.6, 1.4);
      this.rotSpeed = random(-1.5, 1.5);
    } else if (this.season === 1) { // 夏天：綠葉
      this.color = color(100, 220, 50); 
      this.opacity = 255;
      this.speedY = random(0.6, 1.4);  
      this.rotSpeed = random(-1.2, 1.2);
      this.size = random(3, 6);      
    } else if (this.season === 2) { // 秋天：紅楓葉
      this.color = color(random(180, 255), random(50, 140), 20);
      this.opacity = 220;
      this.speedY = random(0.8, 1.8);
      this.rotSpeed = random(-2.0, 2.0); 
    } else if (this.season === 3) { // 冬天：六角雪花
      this.color = color(240, 250, 255);
      this.opacity = random(150, 255);
      this.speedY = random(0.3, 0.7); 
      this.rotSpeed = random(-0.6, 0.6);  
      this.size = random(4, 9);
    }
  }

update() {
    this.y += this.speedY;// 粒子依據垂直速度向下移動
    
    // 利用柏林雜訊與映射機制計算出隨機且平滑的水平風向力數據
    let wind = map(noise(this.noiseOffset + frameCount * 0.01), 0, 1, -1.0, 1.0);
    this.x += wind;
    this.angle += this.rotSpeed;// 粒子依據自轉速度旋轉角度
    
    // 若當前季節已切換，則非當季的殘留粒子開始遞減不透明度至淡出
    if (this.season !== season) this.opacity -= 4; 
  }

  display() {
    // 若粒子已完全透明則直接中斷渲染以優化效能
    if (this.opacity <= 0) return; 

    push();
    // 執行空間轉換，將原點移至粒子當前座標並套用旋轉角度
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    
    // 提取粒子顏色特徵並融合當前不透明度數據
    let r = red(this.color);
    let g = green(this.color);
    let b = blue(this.color);
    let finalColor = color(r, g, b, this.opacity);
    
    if (this.season === 0) {
      // 春天：繪製雙層櫻花瓣幾何圖形
      fill(finalColor);
      let w = this.size * 1.2;
      let h = this.size * 2.5;
      beginShape();
      vertex(0, h/2);
      bezierVertex(-w, h/4, -w*0.8, -h/2, 0, -h/2 * 0.8);
      bezierVertex(w*0.8, -h/2, w, h/4, 0, h/2);
      endShape(CLOSE);
      
      // 繪製花瓣中央的白色高光層次
      let highlightAlpha = map(this.opacity, 0, 255, 0, 90);
      fill(255, 255, 255, highlightAlpha);
      beginShape();
      vertex(0, h/2);
      bezierVertex(-w*0.3, h/4, -w*0.2, -h/4, 0, -h/2 * 0.6);
      bezierVertex(w*0.2, -h/4, w*0.3, h/4, 0, h/2);
      endShape(CLOSE);
    } else if (this.season === 1) {
      // 夏天：利用貝茲曲線組合繪製小綠葉對生葉片
      let s = this.size * 0.05; 
      scale(s);
      let lightGreen = color(140, 220, 30, this.opacity);
      let darkGreen = color(50, 150, 20, this.opacity);

      push(); 
      rotate(-15); 
      fill(lightGreen); 
      beginShape(); 
      vertex(0, 0); 
      bezierVertex(-25, -15, -30, -40, 0, -60); 
      vertex(0, 0); 
      endShape(CLOSE); 
      fill(darkGreen); 
      beginShape(); 
      vertex(0, 0); 
      bezierVertex(20, -15, 20, -40, 0, -60); 
      vertex(0, 0); 
      endShape(CLOSE); 
      pop();
      
      push(); 
      translate(5, -5); 
      rotate(35); 
      scale(0.75); 
      fill(lightGreen); 
      beginShape(); 
      vertex(0, 0); 
      bezierVertex(-25, -15, -30, -40, 0, -60); 
      vertex(0, 0); 
      endShape(CLOSE); 
      fill(darkGreen); 
      beginShape(); 
      vertex(0, 0); 
      bezierVertex(20, -15, 20, -40, 0, -60); 
      vertex(0, 0); 
      endShape(CLOSE); 
      pop();
    } else if (this.season === 2) {
      // 秋天：利用多頂點幾何連續線段繪製紅楓葉外型
      fill(finalColor);
      let s = this.size * 1.3; 
      beginShape(); 
      vertex(0, -s); 
      vertex(s*0.2, -s*0.3); 
      vertex(s*0.8, -s*0.6); 
      vertex(s*0.4, -s*0.1); 
      vertex(s*0.7, s*0.4); 
      vertex(s*0.15, s*0.3); 
      vertex(s*0.05, s*0.8); 
      vertex(-s*0.05, s*0.8); 
      vertex(-s*0.15, s*0.3); 
      vertex(-s*0.7, s*0.4); 
      vertex(-s*0.4, -s*0.1); 
      vertex(-s*0.8, -s*0.6); 
      vertex(-s*0.2, -s*0.3); 
      endShape(CLOSE);
    } else if (this.season === 3) {
      // 冬天：調用畫布快取印章，渲染六角雪花圖形
      imageMode(CENTER);
      drawingContext.globalAlpha = this.opacity / 255.0; 
      image(snowflakeGraphic, 0, 0, this.size * 3, this.size * 3);
      drawingContext.globalAlpha = 1.0; 
    }
    pop();
  }

  isDead() {
    // 判定條件一：若粒子已完全透明則判定死亡
    if (this.opacity <= 0) return true; 
    
    // 判定條件二：若粒子垂直高度已超出畫布下緣則判定死亡
    return this.y > height + 20; 
  }
}

// 春天：蝴蝶類別
class Butterfly {
  constructor() {
    // 隨機初始化蝴蝶的出生座標
    this.x = random(50, width - 50);
    this.y = random(height * 0.1, height * 0.8);
    
    // 初始化柏林雜訊的時間軸偏移量，用來計算隨機飛行軌跡
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
    this.size = random(6, 10); 
    
    // 定義多組雙色調調色盤數據，供蝴蝶隨機抽選
    let palettes = [
      { top: color(255, 127, 80), bot: color(255, 69, 0) }, 
      { top: color(255, 235, 59), bot: color(255, 193, 7) }, 
      { top: color(135, 206, 250), bot: color(65, 105, 225) }, 
      { top: color(200, 162, 200), bot: color(255, 105, 180) }, 
      { top: color(152, 251, 152), bot: color(72, 209, 204) }, 
      { top: color(192, 192, 192), bot: color(105, 105, 105) } 
    ];
    let choice = random(palettes);
    this.colorTop = choice.top;
    this.colorBot = choice.bot;
    this.opacity = 0; 
  }

  update(currentSeason) {
    // 利用柏林雜訊與映射機制，計算出平滑的水平與垂直位移量
    let moveX = map(noise(this.noiseOffsetX + frameCount * 0.01), 0, 1, -2, 2);
    let moveY = map(noise(this.noiseOffsetY + frameCount * 0.01), 0, 1, -1, 1);

    // 邊界回彈機制：當蝴蝶接近畫布邊緣時，施加反向推力防止移出畫面
    let margin = 40;
    if (this.x < margin) moveX += map(this.x, margin, 0, 0, 3);
    if (this.x > width - margin) moveX -= map(this.x, width - margin, width, 0, 3);
    if (this.y < margin) moveY += map(this.y, margin, 0, 0, 2);
    if (this.y > height - margin) moveY -= map(this.y, height - margin, height, 0, 2);

    // 更新位置座標
    this.x += moveX;
    this.y += moveY;

    // 將座標強制限縮在畫布安全範圍之內
    this.x = constrain(this.x, 5, width - 5);
    this.y = constrain(this.y, 5, height - 5);

    // 依據季節狀態控制蝴蝶的不透明度（春季淡入，非春季快速淡出）
    if (currentSeason === 0) {
      if (this.opacity < 200) this.opacity += 5; 
    } else {
      this.opacity -= 10;
    }
  }

  display() {
    // 若不透明度歸零則中斷渲染以優化程式效能
    if (this.opacity <= 0) return;

    push();
    // 移動原點至蝴蝶座標，並利用正弦函數產生微幅的身軀搖擺動態
    translate(this.x, this.y);
    rotate(sin(frameCount * 2) * 10);
    
    // 繪製蝴蝶的觸角與頭部線條
    stroke(80, 50, 20, this.opacity); 
    strokeWeight(1.5);
    noFill();
    line(0, -this.size * 0.5, -this.size * 0.4, -this.size * 1.2);
    fill(80, 50, 20, this.opacity);
    ellipse(-this.size * 0.4, -this.size * 1.2, this.size * 0.2); 
    line(0, -this.size * 0.5, this.size * 0.4, -this.size * 1.2);
    ellipse(this.size * 0.4, -this.size * 1.2, this.size * 0.2);
    noStroke();
    
    // 利用正弦函數與縮放矩陣，實現翅膀拍打的視覺特效
    let flap = sin(frameCount * 15); 
    push();
    scale(flap, 1); 
    
    // 繪製上層翅膀主體
    fill(red(this.colorTop), green(this.colorTop), blue(this.colorTop), this.opacity);
    push(); translate(-this.size * 0.2, 0); rotate(-30); ellipse(-this.size * 0.8, -this.size * 0.5, this.size * 2.2, this.size * 2.5); pop();
    push(); translate(this.size * 0.2, 0); rotate(30); ellipse(this.size * 0.8, -this.size * 0.5, this.size * 2.2, this.size * 2.5); pop();
    
    // 繪製下層翅膀主體
    fill(red(this.colorBot), green(this.colorBot), blue(this.colorBot), this.opacity);
    push(); translate(-this.size * 0.1, 0); rotate(-10); ellipse(-this.size * 0.6, this.size * 0.6, this.size * 1.4, this.size * 1.6); pop();
    push(); translate(this.size * 0.1, 0); rotate(10); ellipse(this.size * 0.6, this.size * 0.6, this.size * 1.4, this.size * 1.6); pop();
    pop(); 
    
    // 繪製蝴蝶中央的深色複層身體結構
    fill(90, 60, 30, this.opacity);
    ellipse(0, 0, this.size * 0.4, this.size * 1.8);
    pop();
  }

  // 判定生命狀態，當淡出完成且非春季時銷毀物件
  isDead() { return this.opacity <= 0 && season !== 0; }
}

// 夏天：螢火蟲類別
class Firefly {
  constructor() {
    // 隨機空間初始化：將螢火蟲分佈於畫布中下方的夜空範圍
    this.x = random(50, width - 50);
    this.y = random(height * 0.4, height * 0.9); 
    
    // 初始化柏林雜訊參數，建立平滑非線性的動態飄移偏移量
    this.noiseOffsetX = random(3000);
    this.noiseOffsetY = random(4000);
    this.size = random(6, 9); 
    this.opacity = 0; 
  }

  update(currentSeason) {
    // 調用時序柏林雜訊與映射運算，計算出多維度的隨機平滑位移速度
    let moveX = map(noise(this.noiseOffsetX + frameCount * 0.005), 0, 1, -1.5, 1.5);
    let moveY = map(noise(this.noiseOffsetY + frameCount * 0.005), 0, 1, -1, 1);

    // 四周彈性邊界防禦：當物件逼近畫布邊緣時，產生漸進的反向修正推力
    let margin = 40;
    if (this.x < margin) moveX += map(this.x, margin, 0, 0, 2.5);
    if (this.x > width - margin) moveX -= map(this.x, width - margin, width, 0, 2.5);
    if (this.y < margin) moveY += map(this.y, margin, 0, 0, 2);
    if (this.y > height - margin) moveY -= map(this.y, height - margin, height, 0, 2);

    // 位移累加更新位置
    this.x += moveX;
    this.y += moveY;

    // 極限位置約束：將二維座標完全限定在畫布的安全可見範圍內
    this.x = constrain(this.x, 5, width - 5);
    this.y = constrain(this.y, 5, height - 5);

    // 依據季節狀態控制螢火蟲的不透明度（夏季淡入，非夏季快速淡出）
    if (currentSeason === 1) {
      if (this.opacity < 255) this.opacity += 5; 
    } else {
      this.opacity -= 10;
    }
  }

  display() {
    // 若物件不透明度歸零則中斷渲染流程以優化圖形效能
    if (this.opacity <= 0) return;

    push();
    // 轉移座標原點至當前幾何中心，並套用由正弦函數產生的身體懸停微幅擺動角度
    translate(this.x, this.y);
    rotate(sin(frameCount * 3) * 15);

    // 發光動態計算：利用正弦函數與不透明度約束疊加出週期性的腹部尾燈閃爍
    let glowAlpha = map(sin(frameCount * 8), -1, 1, 50, 180); 
    let finalGlow = min(glowAlpha, this.opacity); 
    
    noStroke();
    // 繪製外層發光暈塊
    fill(255, 255, 50, finalGlow * 0.4);
    circle(0, this.size * 1.5, this.size * 4);
    
    // 繪製內層核心高亮發光點
    fill(255, 220, 50, this.opacity);
    circle(0, this.size * 1.2, this.size * 1.8);

    // 繪製螢火蟲頭部觸角
    stroke(80, 40, 10, this.opacity);
    strokeWeight(1.5);
    line(-this.size * 0.2, -this.size * 1.2, -this.size * 0.4, -this.size * 1.8);
    line(this.size * 0.2, -this.size * 1.2, this.size * 0.4, -this.size * 1.8);

    noStroke();
    // 繪製頭部幾何色塊
    fill(120, 60, 20, this.opacity);
    circle(0, -this.size * 0.8, this.size * 1.2);
    
    // 繪製胸腔主體結構
    fill(150, 75, 25, this.opacity);
    ellipse(0, 0, this.size * 1.4, this.size * 1.8);
    
    // 繪製前翅硬殼幾何造型
    fill(230, 120, 20, this.opacity);
    beginShape(); 
    vertex(-this.size * 0.65, 0); 
    vertex(this.size * 0.65, 0); 
    vertex(this.size * 0.4, this.size * 0.8); 
    vertex(-this.size * 0.4, this.size * 0.8); 
    endShape(CLOSE);

    // 翅膀拍動幾何：使用高頻正弦函數與角度映射建立半透明雙翅擺動動畫
    let flapAngle = map(sin(frameCount * 25), -1, 1, 15, 60); 
    fill(173, 216, 230, this.opacity * 0.7); 
    push(); translate(-this.size * 0.3, -this.size * 0.2); rotate(-flapAngle); ellipse(-this.size, 0, this.size * 2.5, this.size * 1.8); pop();
    push(); translate(this.size * 0.3, -this.size * 0.2); rotate(flapAngle); ellipse(this.size, 0, this.size * 2.5, this.size * 1.8); pop();
    
    pop();
  }

  // 生命死角判定：當不透明度歸零且已結束夏季時，安全移除該物件數據
  isDead() { return this.opacity <= 0 && season !== 1; }
}

// 秋天:飛鳥類別
class Bird {
  constructor() {
    // 隨機初始化飛鳥在畫布中上空範圍的出生座標
    this.x = random(width * 0.2, width - 50); 
    this.y = random(50, height * 0.6); 
    this.noiseOffsetX = random(1000); 
    this.size = random(3.0, 5.0); 
    this.op = 0; 
    
    // 隨機決定飛鳥的初始水平飛行方向（1為向右，-1為向左）
    this.dir = random() > 0.5 ? 1 : -1; 
    
    // 設定飛鳥的水平滑翔飛行速度與微幅垂直初速度
    this.speedX = random(0.6, 2.0) * this.dir; 
    this.speedY = random(-0.2, 0.2); 
  }
  
  update(currentSeason) {
    // 疊加位移量更新二維位置座標
    this.x += this.speedX;
    this.y += this.speedY;
    
    // 利用正弦函數與時間軸相位差，計算出空氣浮力波盪的垂直微幅波動
    this.y += sin(frameCount * 3 + this.noiseOffsetX) * 0.3;

    // 視窗邊界回彈機制：當飛鳥觸及二維邊緣邊界時，水平方向或垂直方向反轉
    let margin = 30;
    if (this.x < margin || this.x > width - margin) {
      this.speedX *= -1; 
      this.dir *= -1;    
    }
    if (this.y < margin || this.y > height - margin) {
      this.speedY *= -1; 
    }

    // 將飛鳥座標強制限縮在畫布安全可見範圍內
    this.x = constrain(this.x, 15, width - 15);
    this.y = constrain(this.y, 15, height - 15);

    // 依據季節狀態控制飛鳥的不透明度（秋季淡入，非秋季快速淡出）
    if (currentSeason === 2) {
      if (this.op < 255) this.op += 5;
    } else {
      this.op -= 10;
    }
  }
  
  display() {
    // 若不透明度歸零則直接中斷渲染以優化效能
    if (this.op <= 0) return;
    
    push();
    // 轉移座標原點至飛鳥位置，並加上微幅波浪狀起伏動態
    translate(this.x, this.y);
    translate(0, sin(frameCount * 2 + this.noiseOffsetX) * 4);
    
    // 依據飛行方向與基準尺寸，套用矩陣縮放以實現圖形左右鏡像翻轉
    scale(-this.dir * this.size * 0.07, this.size * 0.07); 
    noStroke();
    // 鳥的顏色
    let softOp = this.op * 0.8; 
    let colorBody   = color(255, 250, 200, softOp); // 淡鵝黃 
    let colorBelly  = color(255, 230, 160, softOp); // 米黃 
    let colorCheek  = color(255, 200, 180, softOp); // 粉橘腮紅
    
    let colorWing   = color(240, 220, 150, this.op); // 黃色翅膀
    let colorAccent = color(255, 240, 200, this.op); // 米白裝飾線
    let colorDark   = color(140, 100, 60, this.op);  // 咖啡色細節

    // 1. 腳爪 
    stroke(colorDark);
    strokeWeight(1.8);
    strokeCap(ROUND);
    noFill();
    line(10, 45, 0, 70);
    line(0, 70, -10, 80);
    line(0, 70, 0, 85);
    line(0, 70, 10, 80);
    line(35, 38, 25, 60);
    line(25, 60, 15, 70);
    line(25, 60, 25, 75);
    line(25, 60, 35, 70);
    noStroke();

    // 2. 身體主體 
    fill(colorBody);
    beginShape();
    vertex(-40, -10); 
    bezierVertex(-40, -50, -10, -60, 10, -50); 
    bezierVertex(45, -40, 65, -20, 85, 10);    
    bezierVertex(95, 30, 80, 50, 60, 40);      
    bezierVertex(20, 65, -20, 50, -40, 20);    
    bezierVertex(-50, 10, -45, -5, -40, -10);  
    endShape(CLOSE);

    // 3. 腹部
    fill(colorBelly);
    beginShape();
    vertex(-37, 23); 
    bezierVertex(-15, 15, 5, 20, 22, 47); 
    bezierVertex(5, 60, -20, 45, -37, 23); 
    endShape(CLOSE);

    // 4. 尾巴裝飾線 
    stroke(colorAccent);
    strokeWeight(1.8);
    strokeCap(ROUND);
    line(55, 10, 75, 5);
    line(52, 22, 70, 17);
    noStroke();

    // 5. 喙 
    fill(colorDark);
    beginShape();
    vertex(-38, -12);
    vertex(-50, -8);
    vertex(-38, -4);
    endShape(CLOSE);

    // 6. 眼睛與腮紅 
    fill(colorDark);
    ellipse(-20, -18, 8, 12); 

    fill(colorCheek);
    ellipse(-22, -2, 16, 12); 

    //7. 翅膀
    push();
    translate(10, -10); 
    rotate(sin(frameCount * 8) * 12); 
    
    fill(colorWing);
    beginShape();
    vertex(0, 0); 
    bezierVertex(20, -55, 60, -65, 65, -15); 
    bezierVertex(50, 15, 20, 10, 0, 0);      
    endShape(CLOSE);

    noFill();
    stroke(colorAccent);
    strokeWeight(1.5);
    strokeCap(ROUND);
    
    // 三條柔和波浪線
    beginShape();
    vertex(25, -35);
    quadraticVertex(30, -30, 35, -35);
    quadraticVertex(40, -30, 45, -35);
    quadraticVertex(50, -30, 55, -35);
    endShape();
    beginShape();
    vertex(20, -20);
    quadraticVertex(25, -15, 30, -20);
    quadraticVertex(35, -15, 40, -20);
    quadraticVertex(45, -15, 50, -20);
    endShape();
    beginShape();
    vertex(15, -5);
    quadraticVertex(20, 0, 25, -5);
    quadraticVertex(30, 0, 35, -5);
    endShape();

    pop(); 
    pop(); 
  }
  
  isDead() {
    return this.op <= 0 && season !== 2; 
  }
}