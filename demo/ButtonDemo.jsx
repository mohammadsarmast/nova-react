import React, { useState } from 'react';
import { Button, ButtonGroup, ToggleButton, SplitButton } from 'nova-react/button';

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
    <path fillRule="evenodd" d="M8.75 2A2.75 2.75 0 006 4.75V5H3.75a.75.75 0 000 1.5h.38l.83 9.86A2.75 2.75 0 007.86 19h4.28a2.75 2.75 0 002.75-2.64l.83-9.86h.38a.75.75 0 000-1.5H14v-.25A2.75 2.75 0 0011.25 2h-2.5zm1.5 3.5V4.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25V5.5h5z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, marginBottom: 12, color: '#374151' }}>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>{children}</div>
    </section>
  );
}

export function ButtonDemo() {
  const [loading, setLoading] = useState(false);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>NovaReact Button</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Modern button with 6 variants, 7 severities, 5 sizes, ripple, badges, groups, toggle, split, tooltip, RTL & custom color.
      </p>

      <Section title="1. Basic">
        <Button label="Submit" />
        <Button label="Save Changes" severity="success" icon={<CheckIcon />} />
      </Section>

      <Section title="2. Link">
        <Button label="Learn more" variant="link" href="https://github.com/mohammadsarmast/nova-react" target="_blank" />
      </Section>

      <Section title="3. Icons">
        <Button icon={<CheckIcon />} aria-label="Check" />
        <Button label="Submit" icon={<CheckIcon />} />
        <Button label="Next" iconRight={<CheckIcon />} />
      </Section>

      <Section title="4. Loading">
        <Button label="Submit" icon={<CheckIcon />} loading={loading} loadingText="Saving..." onClick={simulateLoad} />
        <Button label="Click to load" severity="info" loading={loading} onClick={simulateLoad} />
      </Section>

      <Section title="5. Severity (Solid)">
        <Button label="Primary" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Success" severity="success" />
        <Button label="Info" severity="info" />
        <Button label="Warning" severity="warning" />
        <Button label="Danger" severity="danger" />
        <Button label="Neutral" severity="neutral" />
      </Section>

      <Section title="6. Disabled">
        <Button label="Submit" disabled />
        <Button label="Delete" severity="danger" disabled icon={<TrashIcon />} />
      </Section>

      <Section title="7. Raised">
        <Button label="Primary" raised />
        <Button label="Success" severity="success" raised />
        <Button label="Danger" severity="danger" raised />
      </Section>

      <Section title="8. Rounded">
        <Button label="Primary" rounded />
        <Button label="Success" severity="success" rounded />
        <Button label="Warning" severity="warning" rounded />
      </Section>

      <Section title="9. Text">
        <Button label="Primary" variant="text" />
        <Button label="Success" variant="text" severity="success" />
        <Button label="Danger" variant="text" severity="danger" />
      </Section>

      <Section title="10. Outlined">
        <Button label="Primary" variant="outlined" />
        <Button label="Success" variant="outlined" severity="success" />
        <Button label="Danger" variant="outlined" severity="danger" />
      </Section>

      <Section title="11. Soft (extra)">
        <Button label="Primary" variant="soft" />
        <Button label="Success" variant="soft" severity="success" />
        <Button label="Danger" variant="soft" severity="danger" />
      </Section>

      <Section title="12. Gradient (extra)">
        <Button label="Get Started" variant="gradient" icon={<StarIcon />} raised />
        <Button label="Upgrade Pro" variant="gradient" rounded raised />
      </Section>

      <Section title="13. Icon Only">
        <Button icon={<CheckIcon />} aria-label="Check" />
        <Button icon={<StarIcon />} severity="warning" variant="outlined" rounded aria-label="Star" />
        <Button icon={<TrashIcon />} severity="danger" variant="soft" rounded aria-label="Delete" />
      </Section>

      <Section title="14. Badges">
        <Button label="Emails" badge="8" />
        <Button label="Messages" variant="outlined" icon={<StarIcon />} badge="2" badgeSeverity="danger" />
      </Section>

      <Section title="15. Button Group">
        <ButtonGroup attached>
          <Button label="Save" icon={<CheckIcon />} />
          <Button label="Delete" severity="danger" icon={<TrashIcon />} />
          <Button label="Cancel" severity="secondary" variant="outlined" />
        </ButtonGroup>
      </Section>

      <Section title="16. Sizes">
        <Button label="XS" size="xs" />
        <Button label="Small" size="sm" />
        <Button label="Medium" size="md" />
        <Button label="Large" size="lg" />
        <Button label="XL" size="xl" />
      </Section>

      <Section title="17. Full Width">
        <div style={{ width: '100%' }}>
          <Button label="Continue" fullWidth iconRight={<CheckIcon />} />
        </div>
      </Section>

      <Section title="18. Custom Template">
        <Button severity="neutral" raised>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#3b82f6', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>N</span>
            NovaReact
          </span>
        </Button>
      </Section>

      <Section title="19. ToggleButton">
        <ToggleButton
          label="Bold"
          variant="outlined"
          pressed={bold}
          onChange={(e) => setBold(e.pressed)}
        />
        <ToggleButton
          label="Italic"
          variant="outlined"
          severity="secondary"
          pressed={italic}
          onChange={(e) => setItalic(e.pressed)}
        />
        <ToggleButton label="Star" icon={<StarIcon />} iconOnly variant="soft" severity="warning" aria-label="Star" />
      </Section>

      <Section title="20. SplitButton">
        <SplitButton
          label="Save"
          icon={<CheckIcon />}
          model={[
            { label: 'Update', icon: <CheckIcon />, command: () => alert('Updated') },
            { separator: true },
            { label: 'Archive', command: () => alert('Archived') },
            { label: 'Delete', severity: 'danger', icon: <TrashIcon />, command: () => alert('Deleted') },
          ]}
        />
        <div dir="rtl">
          <SplitButton
            label="ذخیره"
            rtl
            icon={<CheckIcon />}
            severity="success"
            menuButtonAriaLabel="نمایش منو"
            model={[
              { label: 'ویرایش', icon: <CheckIcon />, command: () => alert('ویرایش شد') },
              { separator: true },
              { label: 'بایگانی', command: () => alert('بایگانی شد') },
              { label: 'حذف', severity: 'danger', icon: <TrashIcon />, command: () => alert('حذف شد') },
            ]}
          />
        </div>
      </Section>

      <Section title="21. Tooltip">
        <Button label="Top" tooltip="Tooltip on top" tooltipPosition="top" />
        <Button label="Bottom" variant="outlined" tooltip="Tooltip below" tooltipPosition="bottom" />
        <Button label="Left" severity="success" tooltip="On the left" tooltipPosition="left" />
        <Button label="Right" severity="info" tooltip="On the right" tooltipPosition="right" />
      </Section>

      <Section title="22. Custom Color">
        <Button label="Purple" color="#8b5cf6" />
        <Button label="Pink" color="#ec4899" variant="outlined" />
        <Button label="Teal" color="#14b8a6" variant="soft" />
        <Button label="Sunset" color="#f97316" variant="gradient" raised />
      </Section>

      <Section title="23. RTL">
        <div dir="rtl" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <Button label="ثبت" rtl icon={<CheckIcon />} />
          <Button label="حذف" rtl severity="danger" variant="outlined" icon={<TrashIcon />} />
          <Button label="پیام‌ها" rtl badge="3" badgeSeverity="danger" />
          <ButtonGroup attached rtl>
            <Button label="بله" rtl severity="success" />
            <Button label="خیر" rtl severity="secondary" variant="outlined" />
          </ButtonGroup>
        </div>
      </Section>
    </div>
  );
}
