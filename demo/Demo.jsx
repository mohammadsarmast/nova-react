import { useState } from 'react';
import { AutoComplete } from 'nova-react/autocomplete';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh',
  'Belarus', 'Belgium', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China',
  'Colombia', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
  'Ecuador', 'Egypt', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany',
  'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia',
  'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway',
  'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia',
  'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela',
  'Vietnam', 'Yemen',
];

const countryObjects = [
  { name: 'Germany', code: 'DE', continent: 'Europe' },
  { name: 'France', code: 'FR', continent: 'Europe' },
  { name: 'Iran', code: 'IR', continent: 'Asia' },
  { name: 'Japan', code: 'JP', continent: 'Asia' },
  { name: 'United States', code: 'US', continent: 'North America' },
  { name: 'Brazil', code: 'BR', continent: 'South America' },
  { name: 'Australia', code: 'AU', continent: 'Oceania' },
  { name: 'Egypt', code: 'EG', continent: 'Africa' },
];

const groupedCities = [
  { label: 'Germany', items: ['Berlin', 'Hamburg', 'Munich', 'Frankfurt'] },
  { label: 'Iran', items: ['Tehran', 'Isfahan', 'Shiraz', 'Mashhad', 'Tabriz'] },
  { label: 'USA', items: ['New York', 'Los Angeles', 'Chicago', 'Houston'] },
];

const tags = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Vue', 'Angular', 'Svelte', 'Next.js'];

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, marginBottom: 12, color: '#374151' }}>{title}</h2>
      <div style={{ maxWidth: 400 }}>{children}</div>
    </section>
  );
}

export function Demo() {
  const [basic, setBasic] = useState('');
  const [dropdown, setDropdown] = useState('');
  const [objectVal, setObjectVal] = useState(null);
  const [multiple, setMultiple] = useState([]);
  const [grouped, setGrouped] = useState('');
  const [forceVal, setForceVal] = useState('');
  const [floatVal, setFloatVal] = useState('');
  const [customVal, setCustomVal] = useState('');
  const [virtualVal, setVirtualVal] = useState('');
  const [asyncVal, setAsyncVal] = useState('');
  const [asyncSuggestions, setAsyncSuggestions] = useState([]);
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [invalidVal, setInvalidVal] = useState('');

  const bigList = Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`);

  const asyncSearch = async ({ query }) => {
    setAsyncLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setAsyncSuggestions(
      countries.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    );
    setAsyncLoading(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>NovaReact AutoComplete</h1>
      <p style={{ color: '#6b7280', marginBottom: 40 }}>
        A powerful autocomplete with built-in filtering, debounce, virtual scroll, and more.
      </p>

      <Section title="1. Basic (just pass options — no completeMethod needed!)">
        <AutoComplete
          options={countries}
          value={basic}
          onChange={(e) => setBasic(e.value)}
          placeholder="Search country..."
          showClear
          highlightMatches
        />
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Selected: {basic || '—'}</p>
      </Section>

      <Section title="2. With Dropdown Button">
        <AutoComplete
          dropdown
          options={countries}
          value={dropdown}
          onChange={(e) => setDropdown(e.value)}
          placeholder="Click arrow or type..."
        />
      </Section>

      <Section title="3. Objects with Custom Template">
        <AutoComplete
          field="name"
          options={countryObjects}
          value={objectVal}
          onChange={(e) => setObjectVal(e.value)}
          placeholder="Select country..."
          itemTemplate={(c) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>{c.name}</span>
              <span style={{ color: '#6b7280', fontSize: 12 }}>{c.code} · {c.continent}</span>
            </div>
          )}
        />
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          Selected: {objectVal ? `${objectVal.name} (${objectVal.code})` : '—'}
        </p>
      </Section>

      <Section title="4. Multiple Selection">
        <AutoComplete
          multiple
          options={tags}
          value={multiple}
          onChange={(e) => setMultiple(e.value)}
          placeholder="Add technologies..."
          selectionLimit={5}
          helperText="Max 5 selections"
        />
      </Section>

      <Section title="5. Grouped Options">
        <AutoComplete
          options={groupedCities}
          optionGroupLabel="label"
          optionGroupChildren="items"
          value={grouped}
          onChange={(e) => setGrouped(e.value)}
          placeholder="Select city..."
        />
      </Section>

      <Section title="6. Force Selection">
        <AutoComplete
          forceSelection
          options={countries}
          value={forceVal}
          onChange={(e) => setForceVal(e.value)}
          placeholder="Must select from list..."
        />
      </Section>

      <Section title="7. Float Label">
        <AutoComplete
          floatLabel
          label="Search country"
          options={countries}
          value={floatVal}
          onChange={(e) => setFloatVal(e.value)}
        />
      </Section>

      <Section title="8. Allow Custom Value">
        <AutoComplete
          allowCustomValue
          options={tags}
          value={customVal}
          onChange={(e) => setCustomVal(e.value)}
          placeholder="Type or select..."
          helperText="You can type any custom value"
        />
      </Section>

      <Section title="9. Virtual Scroll (5000 items)">
        <AutoComplete
          dropdown
          options={bigList}
          virtualScrollerOptions={{ itemSize: 38 }}
          value={virtualVal}
          onChange={(e) => setVirtualVal(e.value)}
          placeholder="Search from 5000 items..."
        />
      </Section>

      <Section title="10. Async Search (simulated API)">
        <AutoComplete
          suggestions={asyncSuggestions}
          completeMethod={asyncSearch}
          value={asyncVal}
          onChange={(e) => setAsyncVal(e.value)}
          loading={asyncLoading}
          minLength={2}
          delay={300}
          placeholder="Type at least 2 chars..."
          helperText="Simulated 500ms API delay"
        />
      </Section>

      <Section title="11. Invalid / Error State">
        <AutoComplete
          label="Required Field"
          options={countries}
          value={invalidVal}
          onChange={(e) => setInvalidVal(e.value)}
          invalid={!invalidVal}
          errorMessage={!invalidVal ? 'This field is required' : undefined}
          placeholder="Select a country..."
        />
      </Section>

      <Section title="12. Sizes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AutoComplete size="sm" options={countries} placeholder="Small" />
          <AutoComplete size="md" options={countries} placeholder="Medium (default)" />
          <AutoComplete size="lg" options={countries} placeholder="Large" />
        </div>
      </Section>

      <Section title="13. Disabled">
        <AutoComplete disabled placeholder="Disabled" options={countries} />
      </Section>
    </div>
  );
}
