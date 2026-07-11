import React, { useRef, useState } from 'react';
import { Toast } from 'nova-react/toast';
import { Button } from 'nova-react/button';

const sectionStyle = (isDark) => ({
  display: 'grid',
  gap: 16,
  padding: 20,
  borderRadius: 14,
  border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
  background: isDark ? '#1e293b' : '#fff',
});

const labelStyle = (isDark) => ({
  margin: 0,
  fontSize: 15,
  fontWeight: 700,
  color: isDark ? '#f8fafc' : '#111827',
});

const hintStyle = (isDark) => ({
  margin: 0,
  fontSize: 13,
  color: isDark ? '#94a3b8' : '#6b7280',
  lineHeight: 1.6,
});

function DemoBlock({ title, hint, children, isDark }) {
  return (
    <section style={sectionStyle(isDark)}>
      <h3 style={labelStyle(isDark)}>{title}</h3>
      {hint ? <p style={hintStyle(isDark)}>{hint}</p> : null}
      {children}
    </section>
  );
}

export function ToastDemo() {
  const toastRef = useRef(null);
  const toastFaRef = useRef(null);
  const toastTLRef = useRef(null);
  const toastBLRef = useRef(null);
  const toastBCRef = useRef(null);
  const [theme, setTheme] = useState('light');
  const isDark = theme === 'dark';

  const showPersian = () => {
    toastFaRef.current?.show({
      severity: 'success',
      summary: 'موفقیت',
      detail: 'عملیات با موفقیت انجام شد.',
    });
  };

  const showBasic = () => {
    toastRef.current?.show({
      severity: 'info',
      summary: 'Basic',
      detail: 'This is a basic toast message.',
    });
  };

  const showSuccess = () => {
    toastRef.current?.show({ severity: 'success', summary: 'Success', detail: 'Operation completed.' });
  };

  const showInfo = () => {
    toastRef.current?.show({ severity: 'info', summary: 'Info', detail: 'New updates are available.' });
  };

  const showWarn = () => {
    toastRef.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please review your input.' });
  };

  const showError = () => {
    toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong.' });
  };

  const showMultiple = () => {
    toastRef.current?.show([
      { severity: 'info', summary: 'First message' },
      { severity: 'warn', summary: 'Second message' },
      { severity: 'success', summary: 'Third message' },
    ]);
  };

  const showSticky = () => {
    toastRef.current?.show({
      severity: 'secondary',
      summary: 'Sticky',
      detail: 'This toast stays until you close it.',
      sticky: true,
    });
  };

  const showTemplate = () => {
    toastBCRef.current?.show({
      content: ({ onClose }) => (
        <div style={{ display: 'grid', gap: 8 }}>
          <strong>Custom template</strong>
          <span style={{ fontSize: 13, opacity: 0.85 }}>Are you sure you want to continue?</span>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <Button size="sm" label="Confirm" onClick={() => onClose()} />
            <Button size="sm" variant="outlined" label="Cancel" onClick={() => onClose()} />
          </div>
        </div>
      ),
      sticky: true,
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        padding: 20,
        borderRadius: 16,
        background: isDark ? '#0f172a' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
          PrimeReact-inspired Toast — call <code>ref.show()</code> to display overlay messages with severity, position, and templates.
        </p>
        <button
          type="button"
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f8fafc' : '#111827',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>

      <Toast ref={toastRef} theme={theme} position="top-right" />
      <Toast ref={toastFaRef} theme={theme} locale="fa" position="top-center" />
      <Toast ref={toastTLRef} theme={theme} position="top-left" />
      <Toast ref={toastBLRef} theme={theme} position="bottom-left" />
      <Toast ref={toastBCRef} theme={theme} position="bottom-center" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <DemoBlock title="Basic" hint="toastRef.current.show({ summary, detail })" isDark={isDark}>
          <Button label="Show Basic" onClick={showBasic} />
        </DemoBlock>

        <DemoBlock title="Severity" hint="success, info, warn, error" isDark={isDark}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button label="Success" severity="success" onClick={showSuccess} />
            <Button label="Info" severity="info" onClick={showInfo} />
            <Button label="Warn" severity="warning" onClick={showWarn} />
            <Button label="Error" severity="danger" onClick={showError} />
          </div>
        </DemoBlock>

        <DemoBlock title="Multiple" hint="Pass an array to show()" isDark={isDark}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button label="Multiple" onClick={showMultiple} />
            <Button label="Clear" variant="outlined" onClick={() => toastRef.current?.clear()} />
          </div>
        </DemoBlock>

        <DemoBlock title="Sticky" hint="sticky: true keeps the toast until closed" isDark={isDark}>
          <Button label="Sticky" onClick={showSticky} />
        </DemoBlock>

        <DemoBlock title="Position" hint="Use separate Toast instances per corner" isDark={isDark}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button
              label="Top Left"
              onClick={() => toastTLRef.current?.show({ severity: 'info', summary: 'Top Left' })}
            />
            <Button
              label="Bottom Left"
              severity="warning"
              onClick={() => toastBLRef.current?.show({ severity: 'warn', summary: 'Bottom Left' })}
            />
          </div>
        </DemoBlock>

        <DemoBlock title="Template" hint="content render prop for custom JSX" isDark={isDark}>
          <Button label="Custom Template" onClick={showTemplate} />
        </DemoBlock>

        <DemoBlock title="Persian (fa)" hint="locale='fa' enables RTL and Persian close label" isDark={isDark}>
          <Button label="نمایش پیام فارسی" onClick={showPersian} />
        </DemoBlock>
      </div>
    </div>
  );
}
