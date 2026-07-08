# AutoComplete

Powerful React autocomplete with built-in filtering, debounce, virtual scroll, and more.

**Import path:** `nova-react/autocomplete`

## Install

```bash
npm install nova-react
```

## Quick Start

```jsx
import { useState } from 'react';
import { AutoComplete } from 'nova-react/autocomplete';
import 'nova-react/autocomplete/styles.css';

const countries = ['Germany', 'Iran', 'France', 'USA', 'Japan'];

function App() {
  const [value, setValue] = useState('');

  return (
    <AutoComplete
      value={value}
      options={countries}
      onChange={(e) => setValue(e.value)}
      placeholder="Search country..."
    />
  );
}
```

No `completeMethod` needed — just pass `options` and built-in filtering works automatically.

---

## Features

| Feature | Supported |
|---------|-----------|
| Basic autocomplete | ✅ |
| Dropdown button | ✅ |
| Object support (`field`) | ✅ |
| Custom templates | ✅ |
| Grouped options | ✅ |
| Force selection | ✅ |
| Virtual scroll | ✅ |
| Multiple selection | ✅ |
| Disabled / Invalid states | ✅ |
| Accessibility (ARIA) | ✅ |
| Built-in static `options` filter | ✅ |
| Built-in debounce | ✅ |
| Clear button | ✅ |
| Loading state | ✅ |
| Highlight matches | ✅ |
| Allow custom values | ✅ |
| Built-in label / helper / error | ✅ |
| Float label | ✅ |
| RTL support | ✅ |
| Size variants (sm / md / lg) | ✅ |
| Portal panel (`appendTo="body"`) | ✅ |
| Async `completeMethod` | ✅ |

---

## Usage Examples

### Static Options

```jsx
<AutoComplete
  options={['Apple', 'Banana', 'Cherry']}
  value={fruit}
  onChange={(e) => setFruit(e.value)}
  placeholder="Pick a fruit"
  showClear
  highlightMatches
/>
```

### With Objects

```jsx
const countries = [
  { name: 'Germany', code: 'DE' },
  { name: 'Iran', code: 'IR' },
];

<AutoComplete
  field="name"
  options={countries}
  value={selected}
  onChange={(e) => setSelected(e.value)}
/>
```

### Custom Item Template

```jsx
<AutoComplete
  field="name"
  options={countries}
  itemTemplate={(country) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{country.name}</span>
      <span>{country.code}</span>
    </div>
  )}
  value={selected}
  onChange={(e) => setSelected(e.value)}
/>
```

### Async Search (API)

```jsx
const [suggestions, setSuggestions] = useState([]);

<AutoComplete
  field="name"
  suggestions={suggestions}
  completeMethod={async ({ query }) => {
    const res = await fetch(`/api/users?q=${query}`);
    setSuggestions(await res.json());
  }}
  value={user}
  onChange={(e) => setUser(e.value)}
  delay={300}
  minLength={2}
  loading={isLoading}
/>
```

### Multiple Selection

```jsx
<AutoComplete
  multiple
  options={tags}
  value={selectedTags}
  onChange={(e) => setSelectedTags(e.value)}
  selectionLimit={5}
  placeholder="Add tags..."
/>
```

### Dropdown Button

```jsx
<AutoComplete
  dropdown
  dropdownMode="blank"
  options={items}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

### Grouped Options

```jsx
const grouped = [
  { label: 'Europe', items: ['Germany', 'France'] },
  { label: 'Asia', items: ['Iran', 'Japan'] },
];

<AutoComplete
  options={grouped}
  optionGroupLabel="label"
  optionGroupChildren="items"
  value={city}
  onChange={(e) => setCity(e.value)}
/>
```

### Virtual Scroll (Large Lists)

```jsx
<AutoComplete
  options={tenThousandItems}
  virtualScrollerOptions={{ itemSize: 38 }}
  value={item}
  onChange={(e) => setItem(e.value)}
  dropdown
/>
```

### Label, Helper & Error

```jsx
<AutoComplete
  label="Country"
  helperText="Select your country"
  errorMessage="Country is required"
  invalid={!value}
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

### Float Label

```jsx
<AutoComplete
  floatLabel
  label="Search..."
  options={items}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

---

## Props

| Prop | Default | Description |
|------|---------|-------------|
| `value` | — | Controlled value |
| `defaultValue` | — | Uncontrolled default value |
| `options` | — | Static options (auto-filter) |
| `suggestions` | — | Dynamic suggestions from API |
| `completeMethod` | — | Async search callback |
| `onChange` | — | `(e) => void` — value change handler |
| `onSelect` | — | Called when item is selected |
| `onClear` | — | Called when input is cleared |
| `field` | — | Object label field name |
| `multiple` | `false` | Multiple selection mode |
| `selectionLimit` | — | Max selections in multiple mode |
| `dropdown` | `false` | Show dropdown button |
| `dropdownMode` | `'blank'` | `'blank'` \| `'current'` |
| `forceSelection` | `false` | Only allow list values |
| `allowCustomValue` | `false` | Allow free text input |
| `showClear` | `true` | Show clear button |
| `highlightMatches` | `true` | Highlight matched text |
| `delay` | `300` | Debounce delay (ms) |
| `minLength` | `1` | Min chars before search |
| `maxSuggestions` | — | Limit number of suggestions |
| `loading` | `false` | External loading state |
| `disabled` | `false` | Disable input |
| `invalid` | `false` | Error state |
| `readOnly` | `false` | Read-only input |
| `size` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `rtl` | `false` | Right-to-left layout |
| `floatLabel` | `false` | Float label mode |
| `label` | — | Label text |
| `helperText` | — | Helper text below input |
| `errorMessage` | — | Error message when invalid |
| `placeholder` | — | Input placeholder |
| `virtualScrollerOptions` | — | `{ itemSize }` for virtual scroll |
| `appendTo` | `'self'` | `'self'` \| `'body'` |
| `itemTemplate` | — | Custom render for list items |
| `optionGroupLabel` | — | Group label field |
| `optionGroupChildren` | — | Group children field |

See [`src/autocomplete/AutoComplete.jsx`](../src/autocomplete/AutoComplete.jsx) for the full list.

---

## Styling

```jsx
import 'nova-react/autocomplete/styles.css';
```

Override CSS variables:

```css
.my-autocomplete {
  --rpa-primary: #8b5cf6;
  --rpa-radius: 12px;
}
```

```jsx
<AutoComplete className="my-autocomplete" ... />
```

---

## Events

| Event | Payload | When |
|-------|---------|------|
| `onChange` | `{ value, originalEvent }` | Value changes |
| `onSelect` | `{ value, originalEvent }` | Item selected from list |
| `onClear` | — | Clear button clicked |
| `onShow` | — | Dropdown panel opens |
| `onHide` | — | Dropdown panel closes |
| `onInputChange` | `string` | User types in input |

---

[← Back to Components](./README.md)
