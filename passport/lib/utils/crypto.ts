import { timingSafeEqual } from "node:crypto";

export function constantTimerEqual(a: string, b: string): boolean {
  const buffA = Buffer.from(a);
  const buffB = Buffer.from(b);

  if (buffA.length !== buffB.length) return false;

  return timingSafeEqual(buffA, buffB);
}
