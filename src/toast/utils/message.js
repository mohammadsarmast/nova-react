let messageId = 0;

export const SEVERITIES = ['success', 'info', 'warn', 'error', 'secondary', 'contrast'];

export function createMessageId() {
  messageId += 1;
  return `nr-toast-${messageId}`;
}

export function normalizeMessage(message, defaults = {}) {
  if (!message) return null;

  const {
    life: defaultLife = 3000,
    closable: defaultClosable = true,
  } = defaults;

  const sticky = !!message.sticky;
  const life = sticky ? 0 : (message.life ?? defaultLife);

  return {
    id: message.id ?? createMessageId(),
    severity: message.severity ?? 'info',
    summary: message.summary ?? '',
    detail: message.detail ?? '',
    life,
    sticky,
    content: message.content,
    closable: message.closable ?? defaultClosable,
    icon: message.icon,
    className: message.className,
  };
}

export function normalizeMessages(input, defaults = {}) {
  if (!input) return [];
  const list = Array.isArray(input) ? input : [input];
  return list.map((item) => normalizeMessage(item, defaults)).filter(Boolean);
}

export function getMessageKey(message) {
  return message?.id;
}
