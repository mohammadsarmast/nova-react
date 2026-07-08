# AutoComplete

Powerful React autocomplete with built-in filtering, debounce, virtual scroll, and more.

**Import:** `nova-react/autocomplete`

```bash
npm install nova-react
```

```jsx
import { AutoComplete } from 'nova-react/autocomplete';
import 'nova-react/autocomplete/styles.css';
```

---

## Table of Contents

1. [Basic](#1-basic)
2. [Dropdown Button](#2-dropdown-button)
3. [Objects with Custom Template](#3-objects-with-custom-template)
4. [Multiple Selection](#4-multiple-selection)
5. [Grouped Options](#5-grouped-options)
6. [Force Selection](#6-force-selection)
7. [Float Label](#7-float-label)
8. [Allow Custom Value](#8-allow-custom-value)
9. [Virtual Scroll](#9-virtual-scroll)
10. [Async Search (API)](#10-async-search-api)
11. [Invalid / Error State](#11-invalid--error-state)
12. [Sizes](#12-sizes)
13. [Disabled](#13-disabled)
14. [All Features](#all-features)
15. [Props Reference](#props-reference)
16. [Events](#events)
17. [Styling](#styling)

---

## 1. Basic

فقط `options` بده — فیلتر خودکار کار می‌کند، نیازی به `completeMethod` نیست.

```jsx
import { useState } from 'react';
import { AutoComplete } from 'nova-react/autocomplete';
import 'nova-react/autocomplete/styles.css';

const countries = ['Germany', 'Iran', 'France', 'USA', 'Japan'];

function App() {
  const [value, setValue] = useState('');

  return (
    <AutoComplete
      options={countries}
      value={value}
      onChange={(e) => setValue(e.value)}
      placeholder="Search country..."
      showClear
      highlightMatches
    />
  );
}
```

| Props used | Description |
|------------|-------------|
| `options` | لیست ثابت — فیلتر داخلی |
| `showClear` | دکمه پاک کردن |
| `highlightMatches` | هایلایت متن تایپ‌شده در نتایج |

**Preview:**

![Basic autocomplete with filtering and highlight](./images/autocomplete/01-basic.svg)

---

## 2. Dropdown Button

با کلیک روی فلش، لیست باز می‌شود — بدون تایپ هم می‌شود انتخاب کرد.

```jsx
<AutoComplete
  dropdown
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
  placeholder="Click arrow or type..."
/>
```

| Props used | Description |
|------------|-------------|
| `dropdown` | نمایش دکمه فلش |
| `dropdownMode` | `'blank'` (پیش‌فرض) یا `'current'` |

**Preview:**

![Dropdown button opens suggestion list](./images/autocomplete/02-dropdown.svg)

---

## 3. Objects with Custom Template

برای داده‌های object از `field` استفاده کن و با `itemTemplate` ظاهر هر آیتم را سفارشی کن.

```jsx
const countryObjects = [
  { name: 'Germany', code: 'DE', continent: 'Europe' },
  { name: 'Iran', code: 'IR', continent: 'Asia' },
];

<AutoComplete
  field="name"
  options={countryObjects}
  value={selected}
  onChange={(e) => setSelected(e.value)}
  placeholder="Select country..."
  itemTemplate={(c) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <span>{c.name}</span>
      <span style={{ color: '#6b7280', fontSize: 12 }}>{c.code} · {c.continent}</span>
    </div>
  )}
/>
```

| Props used | Description |
|------------|-------------|
| `field` | فیلد نمایشی object |
| `itemTemplate` | قالب سفارشی هر آیتم در لیست |

**Preview:**

![Object options with custom item template](./images/autocomplete/03-objects-template.svg)

---

## 4. Multiple Selection

چند مقدار همزمان — با chip نمایش داده می‌شوند.

```jsx
<AutoComplete
  multiple
  options={tags}
  value={selectedTags}
  onChange={(e) => setSelectedTags(e.value)}
  placeholder="Add technologies..."
  selectionLimit={5}
  helperText="Max 5 selections"
/>
```

| Props used | Description |
|------------|-------------|
| `multiple` | حالت انتخاب چندتایی |
| `selectionLimit` | حداکثر تعداد انتخاب |
| `helperText` | متن راهنما زیر input |

**Preview:**

![Multiple selection with chips](./images/autocomplete/04-multiple.svg)

---

## 5. Grouped Options

گروه‌بندی آیتم‌ها با header برای هر گروه.

```jsx
const groupedCities = [
  { label: 'Germany', items: ['Berlin', 'Hamburg', 'Munich'] },
  { label: 'Iran', items: ['Tehran', 'Isfahan', 'Shiraz'] },
];

<AutoComplete
  options={groupedCities}
  optionGroupLabel="label"
  optionGroupChildren="items"
  value={city}
  onChange={(e) => setCity(e.value)}
  placeholder="Select city..."
/>
```

| Props used | Description |
|------------|-------------|
| `optionGroupLabel` | فیلد عنوان گروه |
| `optionGroupChildren` | فیلد آیتم‌های گروه |

**Preview:**

![Grouped options with section headers](./images/autocomplete/05-grouped.svg)

---

## 6. Force Selection

کاربر فقط می‌تواند از لیست انتخاب کند — مقدار آزاد قبول نمی‌شود.

```jsx
<AutoComplete
  forceSelection
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
  placeholder="Must select from list..."
/>
```

| Props used | Description |
|------------|-------------|
| `forceSelection` | فقط مقادیر لیست — در blur اعتبارسنجی می‌شود |

**Preview:**

![Force selection rejects invalid typed values](./images/autocomplete/06-force-selection.svg)

---

## 7. Float Label

لیبل شناور — وقتی focus یا مقدار دارد بالا می‌رود.

```jsx
<AutoComplete
  floatLabel
  label="Search country"
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

| Props used | Description |
|------------|-------------|
| `floatLabel` | فعال‌سازی لیبل شناور |
| `label` | متن لیبل |

**Preview:**

![Float label moves up on focus](./images/autocomplete/07-float-label.svg)

---

## 8. Allow Custom Value

کاربر می‌تواند مقدار دلخواه تایپ کند، حتی اگر در لیست نباشد.

```jsx
<AutoComplete
  allowCustomValue
  options={tags}
  value={value}
  onChange={(e) => setValue(e.value)}
  placeholder="Type or select..."
  helperText="You can type any custom value"
/>
```

| Props used | Description |
|------------|-------------|
| `allowCustomValue` | اجازه مقدار آزاد |

**Preview:**

![Allow custom value not in the list](./images/autocomplete/08-custom-value.svg)

---

## 9. Virtual Scroll

برای لیست‌های بزرگ (هزاران آیتم) — فقط آیتم‌های visible رندر می‌شوند.

```jsx
const bigList = Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`);

<AutoComplete
  dropdown
  options={bigList}
  virtualScrollerOptions={{ itemSize: 38 }}
  value={value}
  onChange={(e) => setValue(e.value)}
  placeholder="Search from 5000 items..."
/>
```

| Props used | Description |
|------------|-------------|
| `virtualScrollerOptions` | `{ itemSize: 38 }` — ارتفاع هر آیتم |
| `dropdown` | باز کردن لیست بزرگ |

**Preview:**

![Virtual scroll handles thousands of items](./images/autocomplete/09-virtual-scroll.svg)

---

## 10. Async Search (API)

جستجوی async از سرور — با debounce و loading.

```jsx
const [suggestions, setSuggestions] = useState([]);
const [loading, setLoading] = useState(false);

const search = async ({ query }) => {
  setLoading(true);
  const res = await fetch(`/api/countries?q=${query}`);
  setSuggestions(await res.json());
  setLoading(false);
};

<AutoComplete
  suggestions={suggestions}
  completeMethod={search}
  value={value}
  onChange={(e) => setValue(e.value)}
  loading={loading}
  minLength={2}
  delay={300}
  placeholder="Type at least 2 chars..."
  helperText="Results from API"
/>
```

| Props used | Description |
|------------|-------------|
| `completeMethod` | تابع async جستجو |
| `suggestions` | نتایج از API |
| `delay` | debounce (ms) |
| `minLength` | حداقل کاراکتر قبل از جستجو |
| `loading` | نمایش spinner |

**Preview:**

![Async search with loading spinner](./images/autocomplete/10-async.svg)

---

## 11. Invalid / Error State

نمایش خطا با border قرمز و پیام error.

```jsx
<AutoComplete
  label="Required Field"
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
  invalid={!value}
  errorMessage={!value ? 'This field is required' : undefined}
  placeholder="Select a country..."
/>
```

| Props used | Description |
|------------|-------------|
| `invalid` | حالت خطا |
| `errorMessage` | پیام خطا |
| `label` | لیبل بالای input |

**Preview:**

![Invalid state with error message](./images/autocomplete/11-invalid.svg)

---

## 12. Sizes

سه سایز: `sm`، `md` (پیش‌فرض)، `lg`.

```jsx
<AutoComplete size="sm" options={countries} placeholder="Small" />
<AutoComplete size="md" options={countries} placeholder="Medium (default)" />
<AutoComplete size="lg" options={countries} placeholder="Large" />
```

| Props used | Description |
|------------|-------------|
| `size` | `'sm'` \| `'md'` \| `'lg'` |

**Preview:**

![Three size variants sm md lg](./images/autocomplete/12-sizes.svg)

---

## 13. Disabled

غیرفعال — قابل کلیک و تایپ نیست.

```jsx
<AutoComplete disabled placeholder="Disabled" options={countries} />
```

| Props used | Description |
|------------|-------------|
| `disabled` | غیرفعال کردن کامپوننت |

**Preview:**

![Disabled autocomplete](./images/autocomplete/13-disabled.svg)

---

## All Features

| Feature | Prop / Usage |
|---------|--------------|
| Static options filter | `options` |
| Async API search | `completeMethod` + `suggestions` |
| Dropdown button | `dropdown` |
| Object data | `field` |
| Custom item render | `itemTemplate` |
| Multiple chips | `multiple` |
| Grouped list | `optionGroupLabel` + `optionGroupChildren` |
| Force from list only | `forceSelection` |
| Free text input | `allowCustomValue` |
| Float label | `floatLabel` + `label` |
| Virtual scroll | `virtualScrollerOptions` |
| Clear button | `showClear` |
| Highlight matches | `highlightMatches` |
| Debounce | `delay` |
| Loading spinner | `loading` |
| Error state | `invalid` + `errorMessage` |
| Helper text | `helperText` |
| Size variants | `size` |
| RTL layout | `rtl` |
| Portal to body | `appendTo="body"` |
| Accessibility | ARIA built-in |

---

## Props Reference

| Prop | Default | Description |
|------|---------|-------------|
| `value` | — | مقدار controlled |
| `defaultValue` | — | مقدار پیش‌فرض uncontrolled |
| `options` | — | لیست ثابت |
| `suggestions` | — | نتایج dynamic از API |
| `completeMethod` | — | `({ query }) => void \| Promise` |
| `onChange` | — | `(e) => void` |
| `onSelect` | — | وقتی آیتم انتخاب می‌شود |
| `onClear` | — | وقتی clear زده می‌شود |
| `onShow` / `onHide` | — | باز/بسته شدن panel |
| `onInputChange` | — | تغییر متن input |
| `field` | — | فیلد label برای object |
| `multiple` | `false` | انتخاب چندتایی |
| `selectionLimit` | — | حداکثر انتخاب |
| `dropdown` | `false` | دکمه dropdown |
| `dropdownMode` | `'blank'` | `'blank'` \| `'current'` |
| `forceSelection` | `false` | فقط از لیست |
| `allowCustomValue` | `false` | مقدار آزاد |
| `showClear` | `true` | دکمه clear |
| `highlightMatches` | `true` | هایلایت جستجو |
| `filter` | `true` | فیلتر داخلی |
| `filterFunction` | — | فیلتر سفارشی |
| `delay` | `300` | debounce (ms) |
| `minLength` | `1` | حداقل کاراکتر |
| `maxSuggestions` | — | محدودیت تعداد نتایج |
| `loading` | `false` | حالت loading |
| `disabled` | `false` | غیرفعال |
| `invalid` | `false` | حالت خطا |
| `readOnly` | `false` | فقط خواندنی |
| `size` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `rtl` | `false` | راست به چپ |
| `floatLabel` | `false` | لیبل شناور |
| `label` | — | متن لیبل |
| `helperText` | — | متن راهنما |
| `errorMessage` | — | پیام خطا |
| `placeholder` | — | placeholder |
| `virtualScrollerOptions` | — | `{ itemSize }` |
| `appendTo` | `'self'` | `'self'` \| `'body'` |
| `itemTemplate` | — | قالب آیتم |
| `selectedItemTemplate` | — | قالب chip در multiple |
| `optionGroupLabel` | — | فیلد عنوان گروه |
| `optionGroupChildren` | — | فیلد children گروه |
| `className` | — | کلاس root |
| `inputClassName` | — | کلاس input |
| `panelClassName` | — | کلاس panel |
| `autoFocus` | `false` | focus خودکار |
| `autoHighlight` | `true` | هایلایت اولین آیتم |
| `hideOnSelect` | `true` | بستن panel بعد از انتخاب |

---

## Events

| Event | Payload | When |
|-------|---------|------|
| `onChange` | `{ value, originalEvent }` | تغییر مقدار |
| `onSelect` | `{ value, originalEvent }` | انتخاب از لیست |
| `onClear` | — | کلیک clear |
| `onShow` | — | باز شدن panel |
| `onHide` | — | بسته شدن panel |
| `onInputChange` | `string` | تایپ کاربر |

---

## Styling

```jsx
import 'nova-react/autocomplete/styles.css';
```

```css
.my-autocomplete {
  --rpa-primary: #8b5cf6;
  --rpa-radius: 12px;
}
```

```jsx
<AutoComplete className="my-autocomplete" ... />
```

| CSS Variable | Default | Description |
|--------------|---------|-------------|
| `--rpa-primary` | `#3b82f6` | رنگ اصلی |
| `--rpa-border` | `#d1d5db` | border |
| `--rpa-radius` | `8px` | گوشه‌ها |
| `--rpa-error` | `#ef4444` | رنگ خطا |

---

## Live Demo

```bash
git clone https://github.com/mohammadsarmast/nova-react.git
cd nova-react
npm install
npm run demo
```

[← Back to Components](./README.md)
