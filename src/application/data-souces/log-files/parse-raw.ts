export const parseRaw = (raw: string): RegExpMatchArray => {
  const regex = /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?)\s+(info|warn|error):\s+(.*?)\s+(\{.*})\s*$/;
  const parsed = raw.match(regex);
  if (!parsed) {
    throw Error('raw 파싱 실패');
  }
  return parsed;
};
