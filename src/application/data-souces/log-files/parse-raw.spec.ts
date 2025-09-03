// parseRaw.test.ts

import { parseRaw } from './parse-raw';

describe('parseRaw', () => {
  it('', () => {
    const raw = '2025-09-02 11:24:24.627 warn: [OK] log-22 processed successfully {"pid":1021,"page":22}';
    const raw2 =
      '2025-09-02 11:24:25.436 error: [ERROR] log-19 failed to process {"pid":1018,"page":19,"errorId":"ERR10019"}';
    const m1 = parseRaw(raw);
    const m2 = parseRaw(raw2);

    expect(m1).not.toBeNull();
    expect(m1[0]).toBe(raw); // 전체 매치
    expect(m1[1]).toBe('2025-09-02'); // 날짜
    expect(m1[2]).toBe('11:24:24.627'); // 시간(밀리초)
    expect(m1[3]).toBe('warn'); // 레벨
    expect(m1[4]).toBe('[OK] log-22 processed successfully'); // 메시지
    expect(m1[5]).toBe('{"pid":1021,"page":22}'); // JSON
  });
  it('매치: 밀리초 포함 + info', () => {
    const raw = '2025-09-01 12:34:56.123 info: Server started {"port":3000,"env":"prod"}';
    const m = parseRaw(raw);

    expect(m).not.toBeNull();
    expect(m[0]).toBe(raw); // 전체 매치
    expect(m[1]).toBe('2025-09-01'); // 날짜
    expect(m[2]).toBe('12:34:56.123'); // 시간(밀리초)
    expect(m[3]).toBe('info'); // 레벨
    expect(m[4]).toBe('Server started'); // 메시지
    expect(m[5]).toBe('{"port":3000,"env":"prod"}'); // JSON
  });
});
