# NovaReact

A modular React UI component library — import only what you need.

```bash
npm install nova-react
```

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

![Grouped options](./docs/images/autocomplete/05-grouped.svg)

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

---

## Development

```bash
npm install
npm run demo      # run demo locally
npm run build     # build for npm publish
```

## License

[MIT](./LICENSE)
