const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const OUT_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

const LEVELS = ['info', 'warn'];
let globalIdx = 1;

// invalid 패턴 후보
const INVALID_PATTERNS = [
  (ts, level, msg, meta) => `${ts.format('YYYYMMDD HH:mm:ss')} ${level} ${msg} ${JSON.stringify(meta)}`,
  (ts, level, msg, meta) => `${ts.format('YYYYMMDD-HHmmss')}::${level} ${msg} ${JSON.stringify(meta)}`,
  (ts, level, msg, meta) => `${ts.format('YYYY/MM/DD HH-mm-ss')} ${level}: ${msg} ${JSON.stringify(meta)}`,
  (ts, level, msg) => `${ts.format('YYYYMMDD HH:mm:ss')} ${level}: ${msg}`,
  (ts, _level, msg, meta) => `${ts.format('YYYYMMDD HH:mm:ss')} ::: ${msg} ${JSON.stringify(meta)}`,
  (ts, level, msg, meta) => `${ts.format('YYYYMMDD HH:mm:ss')} ${level}: ${msg} pid=${meta.pid} page=${meta.page}`,
  (ts, level, msg, meta) => `${ts.format('YYYYMMDD HH:mm:ss')} :.- ${level}:: ${msg} ###${JSON.stringify(meta)}`,
];

const genLogLine = (ts, i) => {
  const isInvalid = Math.random() < 0.005;
  const isError = Math.random() < 0.05;
  const level = isError ? 'error' : LEVELS[Math.floor(Math.random() * LEVELS.length)];
  const msg = isError ? `[ERROR] log-${globalIdx} failed to process` : `[OK] log-${globalIdx} processed successfully`;
  const meta = {
    pid: 1000 + (i % 50),
    page: (i % 200) + 1,
  };
  if (isError) meta.errorId = `ERR${10000 + globalIdx}`;
  globalIdx++;

  if (isInvalid) {
    const pattern = INVALID_PATTERNS[Math.floor(Math.random() * INVALID_PATTERNS.length)];
    return pattern(ts, level, msg, meta);
  }

  return `${ts.format('YYYYMMDD HH:mm:ss')} ${level}: ${msg} ${JSON.stringify(meta)}`;
};

// 파일명: YYYYMMDD_HHmm_slot.log
function getFileName(ts) {
  const sec = ts.second();
  const slot = sec < 20 ? '00' : sec < 40 ? '20' : '40';
  return `${ts.format('YYYYMMDD_HHmm')}_${slot}.log`;
}

function writeLogFile() {
  const now = dayjs();
  const sec = now.second();
  const slotStartSec = sec < 20 ? 0 : sec < 40 ? 20 : 40;
  const slotEndSec = slotStartSec + 19; // 예: 0~19, 20~39, 40~59

  const base = 200;
  const variance = Math.floor(base * 0.3);
  const lineCount = base + Math.floor((Math.random() - 0.5) * variance * 2);

  const lines = [];
  for (let i = 0; i < lineCount; i++) {
    // 각 라인의 시간은 해당 구간에서 랜덤
    const ts = now
      .second(slotStartSec + Math.floor(Math.random() * (slotEndSec - slotStartSec + 1)))
      .millisecond(Math.floor(Math.random() * 1000));
    lines.push(genLogLine(ts, i));
  }

  // 시간 순서대로 정렬 (로그다운 느낌)
  lines.sort();

  const filename = getFileName(now);
  const filePath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`[GEN] ${filename} (${lineCount} lines)`);
}

// 다음 slot까지 대기 후 시작
function scheduleNext() {
  const now = dayjs();
  const nextSec = Math.ceil(now.second() / 20) * 20;
  const next = now.second(nextSec).millisecond(0);
  const delay = next.diff(now);

  setTimeout(() => {
    writeLogFile();
    setInterval(writeLogFile, 20 * 1000);
  }, delay);
}

scheduleNext();
