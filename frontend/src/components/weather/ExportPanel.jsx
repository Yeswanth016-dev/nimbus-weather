import { FileJson, FileSpreadsheet, FileText, FileCode, FileType } from 'lucide-react';
import { exportUrl } from '../../services/weatherService.js';
import { getSessionId } from '../../utils/session.js';

const FORMATS = [
  {
    key: 'json',
    icon: FileJson,
    iconColor: 'text-amber-400',
    title: 'Raw JSON Format',
    description: 'Full structured payload — ideal for backups or re-importing into another database.',
  },
  {
    key: 'csv',
    icon: FileSpreadsheet,
    iconColor: 'text-cyan-400',
    title: 'Spreadsheet CSV',
    description: 'Comma-separated values — opens cleanly in Excel, Google Sheets, or Numbers.',
  },
  {
    key: 'pdf',
    icon: FileText,
    iconColor: 'text-coral-400',
    title: 'PDF Report',
    description: 'A formatted, shareable report with one entry per searched location.',
  },
  {
    key: 'xml',
    icon: FileCode,
    iconColor: 'text-emerald-500',
    title: 'XML Ledger',
    description: 'Hierarchical tags for XML-friendly parsers and schema-driven pipelines.',
  },
  {
    key: 'markdown',
    icon: FileType,
    iconColor: 'text-cyan-500',
    title: 'Markdown Table',
    description: 'A plaintext table, ready to paste into a README or notes app.',
  },
];

const ExportPanel = ({ locationLabel }) => {
  const sessionId = getSessionId();

  return (
    <div className="panel p-5">
      <p className="font-display text-base font-semibold">Export Search History</p>
      <p className="mt-1 text-sm text-atmosphere-500 dark:text-mist-200/50">
        Download your saved weather searches{locationLabel ? ` (including ${locationLabel})` : ''} in your preferred format.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {FORMATS.map((format) => (
          <a
            key={format.key}
            href={exportUrl(format.key, sessionId)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-black/5 p-3 transition hover:border-cyan-400/50 dark:border-white/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
              <format.icon size={18} className={format.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{format.title}</p>
              <p className="truncate text-xs text-atmosphere-500 dark:text-mist-200/50">{format.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExportPanel;
