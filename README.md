# NovaReact

A modular React UI component library — import only what you need.

```bash
npm install nova-react
```

## Components

| Component | Import | Documentation | Status |
|-----------|--------|---------------|--------|
| **AutoComplete** | `nova-react/autocomplete` | [📖 Docs](./docs/autocomplete.md) | ✅ Ready |
| **Button** | `nova-react/button` | [📖 Docs](./docs/button.md) | 🚧 Coming soon |

## Quick Example

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

## Documentation

Full docs for each component live in the [`docs/`](./docs/) folder:

- [AutoComplete — features, props, examples](./docs/autocomplete.md)
- [Button — coming soon](./docs/button.md)

## Development

```bash
npm install
npm run demo      # run demo locally
npm run build     # build for npm publish
```

## License

[MIT](./LICENSE)
