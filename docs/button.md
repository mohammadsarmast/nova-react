# Button

Modern React button with ripple, badges, groups, gradient/soft variants, and 5 sizes.

**Import:** `nova-react/button`

```bash
npm install nova-react
```

```jsx
import { Button, ButtonGroup, ToggleButton, SplitButton, Tooltip } from 'nova-react/button';
import 'nova-react/button/styles.css';
```

---

## Why NovaReact Button?

| Feature | NovaReact Button |
|---------|------------------|
| Variants | solid, outlined, text, link, **soft**, **gradient** |
| Severities | primary, secondary, success, info, warning, danger, neutral |
| Sizes | **xs, sm, md, lg, xl** (5 sizes) |
| Icons | ReactNode left/right (not just CSS classes) |
| Loading | spinner + custom `loadingText` |
| Ripple effect | built-in (toggle with `ripple`) |
| Badges | built-in with severity colors |
| ButtonGroup | attached / vertical / fullWidth |
| Full width | `fullWidth` prop |
| Link mode | `href` renders as anchor |
| Accessibility | `aria-label`, keyboard, focus ring |
| ToggleButton | pressed state with `onChange` |
| SplitButton | main action + dropdown menu |
| Tooltip | built-in via `tooltip` prop |
| Custom color | direct `color` hex prop |
| RTL | full right-to-left support |

---

## 1. Basic

```jsx
<Button label="Submit" />
<Button label="Save Changes" severity="success" icon={<CheckIcon />} />
```

![Basic](./images/button/01-basic.svg)

---

## 2. Link

```jsx
<Button label="Learn more" variant="link" href="https://example.com" target="_blank" />
```

---

## 3. Icons

```jsx
<Button icon={<CheckIcon />} aria-label="Check" />
<Button label="Submit" icon={<CheckIcon />} />
<Button label="Next" iconRight={<ArrowIcon />} />
```

Use `iconPos="right"` to swap icon side.

---

## 4. Loading

```jsx
<Button
  label="Submit"
  loading={loading}
  loadingText="Saving..."
  onClick={handleSave}
/>
```

![Loading](./images/button/04-loading.svg)

---

## 5. Severity

```jsx
<Button label="Primary" />
<Button label="Secondary" severity="secondary" />
<Button label="Success" severity="success" />
<Button label="Info" severity="info" />
<Button label="Warning" severity="warning" />
<Button label="Danger" severity="danger" />
<Button label="Neutral" severity="neutral" />
```

![Severity](./images/button/02-severity.svg)

---

## 6. Disabled

```jsx
<Button label="Submit" disabled />
```

---

## 7. Raised

```jsx
<Button label="Primary" raised />
<Button label="Success" severity="success" raised />
```

---

## 8. Rounded

```jsx
<Button label="Primary" rounded />
<Button icon={<StarIcon />} rounded severity="warning" aria-label="Star" />
```

---

## 9. Text

```jsx
<Button label="Primary" variant="text" />
<Button label="Danger" variant="text" severity="danger" />
```

---

## 10. Outlined

```jsx
<Button label="Primary" variant="outlined" />
<Button label="Success" variant="outlined" severity="success" />
```

---

## 11. Soft (extra variant)

```jsx
<Button label="Primary" variant="soft" />
<Button label="Danger" variant="soft" severity="danger" />
```

---

## 12. Gradient (extra variant)

```jsx
<Button label="Get Started" variant="gradient" icon={<StarIcon />} raised />
<Button label="Upgrade Pro" variant="gradient" rounded raised />
```

![Gradient](./images/button/03-gradient.svg)

---

## 13. Icon Only

```jsx
<Button icon={<CheckIcon />} aria-label="Check" />
<Button icon={<TrashIcon />} severity="danger" variant="soft" rounded aria-label="Delete" />
```

---

## 14. Badges

```jsx
<Button label="Emails" badge="8" />
<Button label="Messages" variant="outlined" badge="2" badgeSeverity="danger" />
```

![Badges](./images/button/05-badges.svg)

---

## 15. Button Group

```jsx
<ButtonGroup attached>
  <Button label="Save" icon={<CheckIcon />} />
  <Button label="Delete" severity="danger" icon={<TrashIcon />} />
  <Button label="Cancel" severity="secondary" variant="outlined" />
</ButtonGroup>
```

![Button Group](./images/button/06-group.svg)

---

## 16. Sizes

```jsx
<Button label="XS" size="xs" />
<Button label="Small" size="sm" />
<Button label="Medium" size="md" />
<Button label="Large" size="lg" />
<Button label="XL" size="xl" />
```

---

## 17. Full Width

```jsx
<Button label="Continue" fullWidth iconRight={<ArrowIcon />} />
```

---

## 18. Custom Template

```jsx
<Button severity="neutral" raised>
  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Logo /> NovaReact
  </span>
</Button>
```

Pass any JSX as `children`.

---

## 19. ToggleButton

```jsx
import { ToggleButton } from 'nova-react/button';

<ToggleButton
  label="Bold"
  variant="outlined"
  pressed={bold}
  onChange={(e) => setBold(e.pressed)}
/>
```

![ToggleButton](./images/button/07-toggle.svg)

---

## 20. SplitButton

```jsx
import { SplitButton } from 'nova-react/button';

<SplitButton
  label="Save"
  icon={<CheckIcon />}
  model={[
    { label: 'Update', command: () => {} },
    { separator: true },
    { label: 'Delete', severity: 'danger', command: () => {} },
  ]}
/>
```

![SplitButton](./images/button/08-split.svg)

---

## 21. Tooltip

Built-in tooltip via `tooltip` prop on `Button`, or use the standalone `Tooltip` wrapper.

```jsx
<Button label="Help" tooltip="More information" tooltipPosition="top" />
```

Positions: `top` | `bottom` | `left` | `right`

![Tooltip](./images/button/09-tooltip.svg)

---

## 22. Custom Color

Pass any hex color directly — no CSS variables needed.

```jsx
<Button label="Purple" color="#8b5cf6" />
<Button label="Pink" color="#ec4899" variant="outlined" />
<Button label="Teal" color="#14b8a6" variant="soft" />
<Button label="Sunset" color="#f97316" variant="gradient" raised />
```

![Custom Color](./images/button/11-color.svg)

---

## 23. RTL

Set `rtl` on `Button`, `ButtonGroup`, `SplitButton`, or `Tooltip` for right-to-left layouts.

```jsx
<div dir="rtl">
  <Button label="ثبت" rtl icon={<CheckIcon />} />
  <ButtonGroup attached rtl>
    <Button label="بله" rtl severity="success" />
    <Button label="خیر" rtl severity="secondary" variant="outlined" />
  </ButtonGroup>
</div>
```

![RTL](./images/button/10-rtl.svg)

---

## Props

| Prop | Default | Description |
|------|---------|-------------|
| `label` | — | Button text |
| `children` | — | Custom content (overrides label) |
| `variant` | `'solid'` | `solid` \| `outlined` \| `text` \| `link` \| `soft` \| `gradient` |
| `severity` | `'primary'` | `primary` \| `secondary` \| `success` \| `info` \| `warning` \| `danger` \| `neutral` |
| `size` | `'md'` | `xs` \| `sm` \| `md` \| `lg` \| `xl` |
| `icon` | — | Left icon (ReactNode) |
| `iconRight` | — | Right icon (ReactNode) |
| `iconPos` | — | `'right'` swaps icon to right |
| `iconOnly` | `false` | Icon-only button |
| `loading` | `false` | Show spinner |
| `loadingText` | — | Text while loading |
| `disabled` | `false` | Disable button |
| `raised` | `false` | Elevated shadow |
| `rounded` | `false` | Pill shape |
| `fullWidth` | `false` | 100% width |
| `active` | `false` | Active/pressed state |
| `badge` | — | Badge value |
| `badgeSeverity` | — | Badge color |
| `href` | — | Render as link |
| `ripple` | `true` | Click ripple effect |
| `color` | — | Custom hex color (overrides severity) |
| `rtl` | `false` | Right-to-left layout |
| `tooltip` | — | Built-in tooltip text |
| `tooltipPosition` | `'top'` | `top` \| `bottom` \| `left` \| `right` |
| `type` | `'button'` | `button` \| `submit` \| `reset` |
| `onClick` | — | Click handler |
| `className` | — | Extra CSS class |
| `aria-label` | — | Accessibility label |

### ButtonGroup Props

| Prop | Default | Description |
|------|---------|-------------|
| `attached` | `true` | Connected buttons |
| `vertical` | `false` | Vertical layout |
| `fullWidth` | `false` | Full width group |
| `rtl` | `false` | Right-to-left layout |

### ToggleButton Props

Extends all `Button` props plus:

| Prop | Default | Description |
|------|---------|-------------|
| `pressed` | — | Controlled pressed state |
| `defaultPressed` | `false` | Initial pressed state (uncontrolled) |
| `onChange` | — | `({ pressed, originalEvent }) => void` |

### SplitButton Props

| Prop | Default | Description |
|------|---------|-------------|
| `label` | — | Main button label |
| `icon` | — | Main button icon |
| `model` | `[]` | Menu items: `{ label, icon?, command?, disabled?, severity?, separator? }` |
| `onClick` | — | Main button click handler |
| `onItemClick` | — | Menu item click handler |
| `menuIcon` | chevron | Dropdown toggle icon |
| `rtl` | `false` | Right-to-left layout |
| `menuButtonAriaLabel` | `'Show menu'` | Accessibility label for menu toggle |

### Tooltip Props

| Prop | Default | Description |
|------|---------|-------------|
| `content` | — | Tooltip text |
| `position` | `'top'` | `top` \| `bottom` \| `left` \| `right` |
| `rtl` | `false` | Right-to-left layout |

---

## Styling

```jsx
import 'nova-react/button/styles.css';
```

```css
.my-btn {
  --nr-btn-primary: #8b5cf6;
  --nr-btn-radius: 12px;
  --nr-btn-gradient: linear-gradient(135deg, #8b5cf6, #ec4899);
}
```

---

[← Back to Components](./README.md)
