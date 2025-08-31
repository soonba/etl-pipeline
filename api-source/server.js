const express = require('express');
const dayjs = require('dayjs');
const PAGE_SIZE = 20;
const MAX_LOGS = 1000;

const formatFn = (port) => (isError, idx) => ({
  date: dayjs().format('YY-MM-DD HH:mm:SS'),
  status: isError ? 'FAIL' : 'SUCCESS',
  node: `node-${port}`,
  detail: isError ? `log-${idx} failed to process` : `log-${idx} processed successfully`,
});

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
  }, 20000);

  const app = express();

  app.get('/', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
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
    console.log(`server running on http://localhost:${port}`);
  });
};

startServer(3011);
