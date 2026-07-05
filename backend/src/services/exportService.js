const escapeXml = (value) =>
  String(value ?? '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

/** Serializes an array of weather records into a simple, human-readable XML ledger. */
export const buildXmlExport = (records) => {
  const rows = records
    .map(
      (r) => `  <record id="${r._id}">
    <location>${escapeXml(r.displayName || r.location)}</location>
    <country>${escapeXml(r.country)}</country>
    <latitude>${r.latitude}</latitude>
    <longitude>${r.longitude}</longitude>
    <searchType>${escapeXml(r.searchType)}</searchType>
    <temperature unit="celsius">${r.currentWeather?.temp ?? ''}</temperature>
    <condition>${escapeXml(r.currentWeather?.condition)}</condition>
    <humidity unit="percent">${r.currentWeather?.humidity ?? ''}</humidity>
    <windSpeed unit="m/s">${r.currentWeather?.windSpeed ?? ''}</windSpeed>
    <pressure unit="hPa">${r.currentWeather?.pressure ?? ''}</pressure>
    <isFavorite>${!!r.isFavorite}</isFavorite>
    <timestamp>${new Date(r.timestamp).toISOString()}</timestamp>
  </record>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<weatherHistory count="${records.length}">\n${rows}\n</weatherHistory>\n`;
};

/** Serializes an array of weather records into a Markdown table. */
export const buildMarkdownExport = (records) => {
  const header =
    '| Location | Country | Lat | Lon | Temp (°C) | Condition | Humidity (%) | Wind (m/s) | Favorite | Timestamp |\n' +
    '|---|---|---|---|---|---|---|---|---|---|\n';

  const rows = records
    .map(
      (r) =>
        `| ${r.displayName || r.location} | ${r.country || '—'} | ${r.latitude.toFixed(2)} | ${r.longitude.toFixed(
          2
        )} | ${r.currentWeather?.temp ?? '—'} | ${r.currentWeather?.condition ?? '—'} | ${
          r.currentWeather?.humidity ?? '—'
        } | ${r.currentWeather?.windSpeed ?? '—'} | ${r.isFavorite ? '⭐' : ''} | ${new Date(
          r.timestamp
        ).toISOString()} |`
    )
    .join('\n');

  return `# Weather Search History\n\n_Exported ${new Date().toISOString()} — ${records.length} record(s)_\n\n${header}${rows}\n`;
};
