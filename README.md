# NovaReact

A modular React UI component library — import only what you need.

```bash
npm install nova-react
```

## Components

| Component | Import | Documentation |
|-----------|--------|---------------|
| **AutoComplete** | `nova-react/autocomplete` | [📖 Docs](./docs/autocomplete.md) |
| **Button** | `nova-react/button` | [📖 Docs](./docs/button.md) |

## AutoComplete

```jsx
import { useState } from 'react';
import { AutoComplete } from 'nova-react/autocomplete';
import 'nova-react/autocomplete/styles.css';

function App() {
  const [value, setValue] = useState('');

  return (
    <AutoComplete
      value={value}
      options={['Germany', 'Iran', 'France']}
      onChange={(e) => setValue(e.value)}
      placeholder="Search..."
    />
  );
}
```

[📖 Full documentation with all props & examples](./docs/autocomplete.md)

---

## All Usage Modes

### 1. Basic — static options with filter & highlight

```jsx
<AutoComplete
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
  placeholder="Search country..."
  showClear
  highlightMatches
/>
```

![Basic](./docs/images/autocomplete/01-basic.svg)

---

### 2. Dropdown Button

```jsx
<AutoComplete dropdown options={countries} value={value} onChange={(e) => setValue(e.value)} />
```

![Dropdown](./docs/images/autocomplete/02-dropdown.svg)

---

### 3. Objects with Custom Template

```jsx
<AutoComplete
  field="name"
  options={countryObjects}
  itemTemplate={(c) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{c.name}</span>
      <span>{c.code} · {c.continent}</span>
    </div>
  )}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

![Objects with template](./docs/images/autocomplete/03-objects-template.svg)

---

### 4. Multiple Selection

```jsx
<AutoComplete multiple options={tags} value={value} onChange={(e) => setValue(e.value)} selectionLimit={5} />
```

![Multiple selection](./docs/images/autocomplete/04-multiple.svg)

---

### 5. Grouped Options

```jsx
<AutoComplete
  options={groupedCities}
  optionGroupLabel="label"
  optionGroupChildren="items"
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

![Grouped options](./docs/images/autocomplete/05-grouped.svg?v=2)

---

### 6. Force Selection

```jsx
<AutoComplete forceSelection options={countries} value={value} onChange={(e) => setValue(e.value)} />
```

![Force selection](./docs/images/autocomplete/06-force-selection.svg)

---

### 7. Float Label

```jsx
<AutoComplete floatLabel label="Search country" options={countries} value={value} onChange={(e) => setValue(e.value)} />
```

![Float label](./docs/images/autocomplete/07-float-label.svg)

---

### 8. Allow Custom Value

```jsx
<AutoComplete allowCustomValue options={tags} value={value} onChange={(e) => setValue(e.value)} />
```

![Custom value](./docs/images/autocomplete/08-custom-value.svg)

---

### 9. Virtual Scroll (5000+ items)

```jsx
<AutoComplete
  dropdown
  options={bigList}
  virtualScrollerOptions={{ itemSize: 38 }}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

![Virtual scroll](./docs/images/autocomplete/09-virtual-scroll.svg)

---

### 10. Async Search (API)

```jsx
<AutoComplete
  suggestions={suggestions}
  completeMethod={search}
  value={value}
  onChange={(e) => setValue(e.value)}
  loading={loading}
  minLength={2}
  delay={300}
/>
```

![Async search](./docs/images/autocomplete/10-async.svg)

---

### 11. Invalid / Error State

```jsx
<AutoComplete
  label="Required Field"
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
  invalid={!value}
  errorMessage="This field is required"
/>
```

![Invalid state](./docs/images/autocomplete/11-invalid.svg)

---

### 12. Sizes (sm / md / lg)

```jsx
<AutoComplete size="sm" options={countries} placeholder="Small" />
<AutoComplete size="md" options={countries} placeholder="Medium" />
<AutoComplete size="lg" options={countries} placeholder="Large" />
```

![Sizes](./docs/images/autocomplete/12-sizes.svg)

---

### 13. Disabled

```jsx
<AutoComplete disabled options={countries} placeholder="Disabled" />
```

![Disabled](./docs/images/autocomplete/13-disabled.svg)

### 14. RTL · 15. Portal · 16. Match Mode · 17. Disabled Options · 18. Creatable

```jsx
<AutoComplete rtl options={['ایران', 'آلمان']} placeholder="جستجو..." />
<AutoComplete appendTo="body" dropdown options={countries} />
<AutoComplete matchMode="startsWith" options={countries} />
<AutoComplete options={[{ name: 'Iran' }, { name: 'Germany', disabled: true }]} field="name" />
<AutoComplete allowCustomValue options={tags} placeholder="Type a new tag..." />
```

---

## Button

```jsx
import { Button, ButtonGroup, ToggleButton, SplitButton } from 'nova-react/button';
import 'nova-react/button/styles.css';

<Button label="Submit" />
<Button label="Get Started" variant="gradient" raised />
<Button label="Help" tooltip="More info" color="#8b5cf6" />
```

[📖 Full Button documentation](./docs/button.md)

### Basic & Severity

```jsx
<Button label="Submit" />
<Button label="Success" severity="success" />
<Button label="Danger" severity="danger" variant="outlined" />
```

![Basic](./docs/images/button/01-basic.svg)

![Severity](./docs/images/button/02-severity.svg)

### Gradient & Loading

```jsx
<Button label="Get Started" variant="gradient" raised />
<Button label="Save" loading loadingText="Saving..." />
```

![Gradient](./docs/images/button/03-gradient.svg)

![Loading](./docs/images/button/04-loading.svg)

### Badges & Button Group

```jsx
<Button label="Emails" badge="8" />
<ButtonGroup attached>
  <Button label="Save" />
  <Button label="Delete" severity="danger" />
  <Button label="Cancel" severity="secondary" variant="outlined" />
</ButtonGroup>
```

![Badges](./docs/images/button/05-badges.svg)

![Button Group](./docs/images/button/06-group.svg)

### Toggle, Split, Tooltip, Color & RTL

```jsx
<ToggleButton label="Bold" variant="outlined" pressed={bold} onChange={(e) => setBold(e.pressed)} />

<SplitButton label="Save" model={[{ label: 'Delete', severity: 'danger', command: () => {} }]} />

<Button label="Help" tooltip="More info" tooltipPosition="top" />
<Button label="Brand" color="#8b5cf6" />
<Button label="ثبت" rtl icon={<CheckIcon />} />
```

![ToggleButton](./docs/images/button/07-toggle.svg)

![SplitButton](./docs/images/button/08-split.svg)

![Tooltip](./docs/images/button/09-tooltip.svg)

![Custom Color](./docs/images/button/11-color.svg)

![RTL](./docs/images/button/10-rtl.svg)

---

## Development

```bash
npm install
npm run demo      # run demo locally
npm run test      # run unit tests
npm run build     # build for npm publish
```

## License

[MIT](./LICENSE)
