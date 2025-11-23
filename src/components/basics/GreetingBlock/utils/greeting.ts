import { msg } from './greetingMessages';

export function getDate(): Date {
  return new Date();
}

export function getGreetingMessage(time: Date, context?: string): string {
  // context 우선 적용
  if (context === 'login') return msg.ETC_MSG.login;

  const hour = time.getHours();

  if (hour < 12) return msg.TIME_MSG.morning;
  if (hour < 18) return msg.TIME_MSG.noon;
  return msg.TIME_MSG.evening;
}

export function greetingText(context?: string): string {
  const now = getDate();
  const base = getGreetingMessage(now, context);

  const extra = msg.RANDOM_MSG[Math.floor(Math.random() * msg.RANDOM_MSG.length)];

  return `${base} ${extra}`;
}
