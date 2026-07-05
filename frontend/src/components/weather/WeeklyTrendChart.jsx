import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatDayLabel } from '../../utils/formatters.js';
import { useUnits } from '../../context/UnitsContext.jsx';

const WeeklyTrendChart = ({ forecast }) => {
  const { displayTemp, unitSymbol } = useUnits();
  if (!forecast || forecast.length === 0) return null;

  const data = forecast.map((day, idx) => ({
    day: idx === 0 ? 'Today' : formatDayLabel(day.date),
    max: displayTemp(day.tempMax),
    min: displayTemp(day.tempMin),
  }));

  return (
    <div className="panel p-4">
      <p className="eyebrow mb-3 px-1">Weekly Temperature Trend</p>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,170,0.15)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7C8CA6' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#7C8CA6' }}
              axisLine={false}
              tickLine={false}
              width={32}
              tickFormatter={(v) => `${v}${unitSymbol}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', background: '#111A2E', color: '#F7F9FC', fontSize: 12 }}
              formatter={(value, name) => [`${value}${unitSymbol}`, name === 'max' ? 'Max' : 'Min']}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'max' ? 'Max' : 'Min')} />
            <Line type="monotone" dataKey="max" stroke="#F2A93B" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="min" stroke="#5EC8D8" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyTrendChart;
