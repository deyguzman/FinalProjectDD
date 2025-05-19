let sections = 3;
let sectionWidth;
let circles = [];
let glitchBlocks = [];
let particles = [];
let cursor = { x: 0, y: 0, size: 30, color: [255, 255, 255], shape: 'circle' };
let started = false;
let bgMusic;

function preload() {
  bgMusic = loadSound('audio/wish.mp3');
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent(document.body);
  sectionWidth = width / sections;
  noStroke();
  initCircles();
  initGlitchBlocks();
  initParticles();
  cursor.x = width / 2;
  cursor.y = height / 2;
}

function draw() {
  if (!started) return;
  background(17);
  drawSections();
  updateCursor();

  if (cursor.x < sectionWidth) {
    drawLeftSection();
  } else if (cursor.x < sectionWidth * 2) {
    drawMiddleSection();
  } else {
    drawRightSection();
  }

  drawCursor();
}

function mousePressed() {
  if (!started) {
    started = true;
    document.getElementById('start-screen').style.display = 'none';
    if (!bgMusic.isPlaying()) {
      bgMusic.loop();
    }
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function drawSections() {
  stroke(100);
  strokeWeight(2);
  line(sectionWidth, 0, sectionWidth, height);
  line(sectionWidth * 2, 0, sectionWidth * 2, height);
  noStroke();
}

function initCircles() {
  circles = [];
  for (let i = 0; i < 40; i++) {
    circles.push({
      x: random(sectionWidth),
      y: random(height),
      r: random(15, 40),
      baseColor: [50, 200, 100],
      activeColor: [0, 255, 150]
    });
  }
}

function drawLeftSection() {
  fill(20, 40, 20);
  rect(0, 0, sectionWidth, height);

  circles.forEach(c => {
    let d = dist(cursor.x, cursor.y, c.x, c.y);
    let col = lerpColor(color(c.baseColor), color(c.activeColor), map(d, 0, 150, 1, 0));
    fill(col);
    ellipse(c.x, c.y, c.r);
  });
}

function initGlitchBlocks() {
  glitchBlocks = [];
  let blockSize = 20;
  for (let x = sectionWidth; x < sectionWidth * 2; x += blockSize) {
    for (let y = 0; y < height; y += blockSize) {
      glitchBlocks.push({ x, y, size: blockSize, baseColor: [0, 255, 255] });
    }
  }
}

function drawMiddleSection() {
  fill(10, 10, 30);
  rect(sectionWidth, 0, sectionWidth, height);

  glitchBlocks.forEach(b => {
    let d = dist(cursor.x, cursor.y, b.x + b.size / 2, b.y + b.size / 2);
    let glitchAmount = map(d, 0, 150, 10, 0);
    glitchAmount = constrain(glitchAmount, 0, 10);
    fill(0, 255, 255, 200);
    rect(b.x + random(-glitchAmount, glitchAmount), b.y + random(-glitchAmount, glitchAmount), b.size, b.size);
  });
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(sectionWidth * 2, width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(3, 7),
      color: [random(100, 255), random(100, 255), random(100, 255)],
      life: random(100, 300)
    });
  }
}

function drawRightSection() {
  fill(30, 0, 40);
  rect(sectionWidth * 2, 0, sectionWidth, height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life < 0) {
      p.x = random(sectionWidth * 2, width);
      p.y = random(height);
      p.vx = random(-0.5, 0.5);
      p.vy = random(-0.5, 0.5);
      p.life = random(100, 300);
      p.size = random(3, 7);
      p.color = [random(100, 255), random(100, 255), random(100, 255)];
    }
    fill(...p.color, map(p.life, 0, 300, 0, 255));
    ellipse(p.x, p.y, p.size);
  });

  for (let i = 0; i < 5; i++) {
    if (dist(cursor.x, cursor.y, mouseX, mouseY) < 100) {
      let px = cursor.x + random(-20, 20);
      let py = cursor.y + random(-20, 20);
      fill(random(150, 255), random(150, 255), random(150, 255));
      ellipse(px, py, random(5, 10));
    }
  }
}

function updateCursor() {
  if (touches.length > 0) {
    cursor.x = touches[0].x;
    cursor.y = touches[0].y;
  } else {
    cursor.x = mouseX;
    cursor.y = mouseY;
  }

  if (cursor.x < sectionWidth) {
    cursor.color = [0, 255, 150];
    cursor.shape = 'circle';
  } else if (cursor.x < sectionWidth * 2) {
    cursor.color = [0, 255, 255];
    cursor.shape = 'square';
  } else {
    cursor.color = [255, 150, 255];
    cursor.shape = 'burst';
  }
}

function drawCursor() {
  push();
  translate(cursor.x, cursor.y);
  noStroke();
  fill(...cursor.color, 200);

  if (cursor.shape === 'circle') {
    ellipse(0, 0, 40 + sin(frameCount * 0.1) * 10);
  } else if (cursor.shape === 'square') {
    rectMode(CENTER);
    let size = 35 + sin(frameCount * 0.15) * 8;
    rect(0, 0, size, size);
  } else if (cursor.shape === 'burst') {
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI / 8 * i + frameCount * 0.1;
      let x = cos(angle) * 20;
      let y = sin(angle) * 20;
      ellipse(x, y, 10);
    }
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sectionWidth = width / sections;
  initCircles();
  initGlitchBlocks();
  initParticles();
}
