const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const LOG_FILE = path.join(__dirname, 'winston.log');
const LEVELS = ['info', 'warn'];

const TOTAL_DAYS = 30;
const TARGET_LINES = 5000;

const distributeLogs = (days, total) => {
  let remaining = total;
  const result = [];
  for (let i = days; i > 0; i--) {
    const avg = Math.floor(remaining / i);
    const variance = Math.floor(avg * 0.3); // ±30% 변동
    const count = Math.max(50, avg + Math.floor((Math.random() - 0.5) * variance * 2));
    result.push(count);
    remaining -= count;
  }
  result[result.length - 1] += remaining;
  return result;
};

// 하루별 로그 개수 분배
const perDayCounts = distributeLogs(TOTAL_DAYS, TARGET_LINES);

// 로그 라인 생성
let globalIdx = 1;
const genLogLine = (date, i) => {
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
    return `${date} :.- ${level}: ${msg} ${JSON.stringify(meta)}`;
  }
  return `${date} ${level}: ${msg} ${JSON.stringify(meta)}`;
};

// 로그 전체 생성
const lines = [];
perDayCounts.forEach((count, offset) => {
  const date = dayjs()
    .subtract(TOTAL_DAYS - offset, 'day')
    .format('YYYYMMDD');
  for (let i = 0; i < count; i++) {
    lines.push(genLogLine(date, i));
  }
});

fs.writeFileSync(LOG_FILE, lines.join('\n'), 'utf-8');
