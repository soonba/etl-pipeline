const express = require("express");
const fs = require("fs");
const path = require("path");
const dayjs = require('dayjs');
const PAGE_SIZE = 20;
const MAX_LOGS = 1000;
const LOG_FILE = path.join(__dirname, "winston.log");

// ===== 서버별 포맷터 =====
const formatFn = (port) => {
  if (port === 3010) {
    return (isError, idx) => ({
      timestamp: dayjs('YYYYMMDD'),
      level: isError ? "error" : "info",
      message: `[${isError ? "ERROR" : "OK"}] (server:${port}) log-${idx}`,
    });
  } else {
    return (isError, idx) => ({
      date: dayjs().format("YY-MM-DD"),
      status: isError ? "FAIL" : "SUCCESS",
      node: `node-${port}`,
      detail: isError
        ? `log-${idx} failed to process`
        : `log-${idx} processed successfully`,
    });
  }
};

const startServer = (port) => {
  const logs = [];
  const formatter = formatFn(port);

  setInterval(() => {
    const count = Math.floor(Math.random() * 6) + 5; // 5~10
    for (let i = 0; i < count; i++) {
      const isError = Math.random() < 0.05; // 5% 에러
      logs.push(formatter(isError, logs.length + 1));
    }
    if (logs.length > MAX_LOGS) {
      logs.splice(0, logs.length - MAX_LOGS);
    }
  }, 1000);

  const app = express();

  app.get("/", (req, res) => {
    const page = parseInt(req.query.page || "1", 10);
    const maxPage = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(page, 1), maxPage);

    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const data = logs.slice(start, end);

    res.json({
      server: port,
      maxPage,
      currentPage: safePage,
      data,
    });
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
};

startServer(3010);
startServer(3011);

const PORTS = [3010, 3011];
const LEVELS = ["info", "warn", "error", "debug"];

const genLogLine = (i) => {
  const port = PORTS[i % 2];
  const date = port === 3010 ? dayjs().format("YYYY-MM-DD") : dayjs().format("YYYYMMDD");
  const isError = Math.random() < 0.05;
  const level = isError ? "error" : LEVELS[Math.floor(Math.random() * LEVELS.length)];
  const idx = i + 1;
  const msg = isError
    ? `[ERROR] (server:${port}) log-${idx} failed`
    : `[OK] (server:${port}) log-${idx} processed`;
  return `${date} ${level}: ${msg} {"pid":${1000 + (idx % 50)},"page":${(idx % 200) + 1}}`;
};

// 파일 생성
const lines = Array.from({ length: 10000 }, (_, i) => genLogLine(i));
fs.writeFileSync(LOG_FILE, lines.join("\n"), "utf-8");
console.log(`📄 Log file generated: ${LOG_FILE}`);
