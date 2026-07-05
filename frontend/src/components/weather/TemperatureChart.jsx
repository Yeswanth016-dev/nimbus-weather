import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TemperatureChart = ({ hourly }) => {
  if (!hourly || hourly.length === 0) return null;

  const data = hourly.map((h) => ({ time: h.time, temp: h.temp }));

  return (
    <div className="panel p-4">
      <p className="eyebrow mb-3 px-1">Temperature Trend &middot; Today</p>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5EC8D8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#5EC8D8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,170,0.15)" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#7C8CA6' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#7C8CA6' }}
              axisLine={false}
              tickLine={false}
              width={32}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                background: '#111A2E',
                color: '#F7F9FC',
                fontSize: 12,
              }}
              formatter={(value) => [`${value}°`, 'Temp']}
            />
            <Area type="monotone" dataKey="temp" stroke="#3FA9BB" strokeWidth={2} fill="url(#tempGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;
