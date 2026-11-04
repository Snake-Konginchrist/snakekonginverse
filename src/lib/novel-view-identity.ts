import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
export const visitorCookie = 'novel_visitor';
const sign = (id: string, secret: string) => createHmac('sha256', secret).update(id).digest('hex');
export function newVisitor(secret: string) {
  const id = randomUUID();
  return `${id}.${sign(id, secret)}`;
}
export function validVisitor(value: string | undefined, secret: string): value is string {
  if (!value || !/^[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(value)) return false;
  const [id, signature] = value.split('.');
  return timingSafeEqual(Buffer.from(signature), Buffer.from(sign(id, secret)));
}
export function visitKey(visitor: string, target: string, now = new Date()) {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return createHmac('sha256', visitor).update(`${target}:${day}`).digest('hex');
}
