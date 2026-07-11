import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ToastMessage } from './ToastMessage.jsx';
import { cn } from './utils/cn.js';
import {
  getMessageKey,
  normalizeMessage,
  normalizeMessages,
} from './utils/message.js';
import {
  resolveToastThemeColors,
  toastColorsToCssVars,
} from './utils/themeColors.js';
import {
  getToastLocaleConfig,
  isToastRtlLocale,
  resolveToastLocale,
} from './utils/locale.js';
import './styles/toast.css';

const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'center',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export const Toast = forwardRef(function Toast(props, ref) {
  const {
    position = 'top-right',
    life: defaultLife = 3000,
    closable = true,
    baseZIndex = 1100,
    theme = 'light',
    colors,
    locale,
    rtl,
    className,
    style,
    closeAriaLabel,
  } = props;

  const [messages, setMessages] = useState([]);
  const timersRef = useRef(new Map());

  const resolvedLocale = resolveToastLocale(locale, rtl);
  const localeConfig = useMemo(
    () => getToastLocaleConfig(resolvedLocale),
    [resolvedLocale]
  );
  const isRtl = rtl ?? isToastRtlLocale(resolvedLocale);
  const resolvedCloseAriaLabel = closeAriaLabel ?? localeConfig.close;
  const isDark = theme === 'dark';
  const themeVars = useMemo(
    () => toastColorsToCssVars(resolveToastThemeColors(theme, colors)),
    [theme, colors]
  );

  const clearTimer = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const removeMessage = useCallback((messageOrId) => {
    const id = typeof messageOrId === 'string' ? messageOrId : getMessageKey(messageOrId);
    if (!id) return;
    clearTimer(id);
    setMessages((prev) => prev.filter((item) => item.id !== id));
  }, [clearTimer]);

  const scheduleRemoval = useCallback((message) => {
    if (!message || message.sticky || !message.life || message.life <= 0) return;
    clearTimer(message.id);
    const timer = window.setTimeout(() => {
      removeMessage(message.id);
    }, message.life);
    timersRef.current.set(message.id, timer);
  }, [clearTimer, removeMessage]);

  const show = useCallback((input) => {
    const defaults = { life: defaultLife, closable };
    const nextMessages = normalizeMessages(input, defaults);
    if (!nextMessages.length) return;

    setMessages((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const merged = [...prev];

      nextMessages.forEach((message) => {
        if (existingIds.has(message.id)) {
          const index = merged.findIndex((item) => item.id === message.id);
          merged[index] = message;
        } else {
          merged.push(message);
        }
        scheduleRemoval(message);
      });

      return merged;
    });
  }, [closable, defaultLife, scheduleRemoval]);

  const clear = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setMessages([]);
  }, []);

  const replace = useCallback((input) => {
    clear();
    show(input);
  }, [clear, show]);

  useImperativeHandle(ref, () => ({
    show,
    clear,
    remove: removeMessage,
    replace,
  }), [show, clear, removeMessage, replace]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const resolvedPosition = POSITIONS.includes(position) ? position : 'top-right';

  return (
    <div
      className={cn(
        'nr-toast',
        `nr-toast--${resolvedPosition}`,
        isDark && 'nr-toast--dark',
        isRtl && 'nr-toast--rtl',
        className
      )}
      style={{ ...themeVars, zIndex: baseZIndex, ...style }}
      dir={isRtl ? 'rtl' : undefined}
      aria-relevant="additions"
    >
      <div className="nr-toast__container">
        {messages.map((message) => (
          <ToastMessage
            key={message.id}
            message={message}
            onClose={removeMessage}
            closeAriaLabel={resolvedCloseAriaLabel}
          />
        ))}
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;
