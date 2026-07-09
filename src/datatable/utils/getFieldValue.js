export function getFieldValue(row, field) {
  if (!field || row == null) return undefined;
  if (!field.includes('.')) return row[field];

  return field.split('.').reduce((value, key) => {
    if (value == null) return undefined;
    return value[key];
  }, row);
}

export function setFieldValue(row, field, value) {
  if (!field.includes('.')) {
    return { ...row, [field]: value };
  }

  const keys = field.split('.');
  const clone = { ...row };
  let cursor = clone;

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    cursor[key] = { ...cursor[key] };
    cursor = cursor[key];
  }

  cursor[keys[keys.length - 1]] = value;
  return clone;
}
