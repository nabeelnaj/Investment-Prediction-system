import { useState, useMemo } from 'react';
import { getCandles, type Candle } from '../lib/mockData';

interface StockChartProps {
  symbol: string;
  currentPrice: number;
  predictionLow?: number;
  predictionHigh?: number;
}

const TIMEFRAMES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
];

export default function StockChart({ symbol, currentPrice, predictionLow, predictionHigh }: StockChartProps) {
  const [tf, setTf] = useState(TIMEFRAMES[4]);
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const allCandles = getCandles(symbol, 365);
  const candles = useMemo(() => allCandles.slice(-tf.days), [allCandles, tf.days]);

  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const minPrice = Math.min(...lows) * 0.995;
  const maxPrice = Math.max(...highs) * 1.005;
  const priceRange = maxPrice - minPrice;

  const W = 800;
  const H = 280;
  const PAD = { top: 12, right: 12, bottom: 32, left: 56 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  function toX(i: number) { return PAD.left + (i / (candles.length - 1)) * chartW; }
  function toY(price: number) { return PAD.top + ((maxPrice - price) / priceRange) * chartH; }

  const linePath = closes.map((c, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(c)}`).join(' ');
  const areaPath = linePath + ` L${toX(closes.length - 1)},${H - PAD.bottom} L${toX(0)},${H - PAD.bottom} Z`;

  const isUp = closes[closes.length - 1] >= closes[0];
  const lineColor = isUp ? '#22c55e' : '#ef4444';
  const gradientId = `grad-${symbol}-${isUp ? 'up' : 'dn'}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => minPrice + f * priceRange);
  const xStep = Math.max(1, Math.floor(candles.length / 6));
  const xTicks = candles.filter((_, i) => i % xStep === 0 || i === candles.length - 1).map((c, _, arr) => ({
    label: new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    x: toX(candles.indexOf(c)),
  }));

  const hovered = hoveredIndex !== null ? candles[hoveredIndex] : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {TIMEFRAMES.map(t => (
            <button
              key={t.label}
              onClick={() => setTf(t)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                tf.label === t.label ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${chartType === 'line' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('candle')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${chartType === 'candle' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
          >
            Candle
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 280 }}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * W;
            const idx = Math.round(((x - PAD.left) / chartW) * (candles.length - 1));
            setHoveredIndex(Math.max(0, Math.min(candles.length - 1, idx)));
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {yTicks.map((v, i) => (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={toY(v)} y2={toY(v)} stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
              <text x={PAD.left - 6} y={toY(v) + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.4">
                ${v.toFixed(0)}
              </text>
            </g>
          ))}
          {xTicks.map((t, i) => (
            <text key={i} x={t.x} y={H - PAD.bottom + 16} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">
              {t.label}
            </text>
          ))}

          {/* AI prediction band */}
          {predictionLow && predictionHigh && (
            <>
              <rect
                x={toX(candles.length - 1)}
                y={toY(predictionHigh)}
                width={chartW * 0.15}
                height={toY(predictionLow) - toY(predictionHigh)}
                fill="#3b82f6"
                fillOpacity="0.12"
                rx="2"
              />
              <text x={toX(candles.length - 1) + 4} y={toY(predictionHigh) - 4} fontSize="8" fill="#3b82f6" opacity="0.8">AI Range</text>
            </>
          )}

          {chartType === 'line' ? (
            <>
              <path d={areaPath} fill={`url(#${gradientId})`} />
              <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            candles.map((c, i) => {
              const x = toX(i);
              const candleUp = c.close >= c.open;
              const col = candleUp ? '#22c55e' : '#ef4444';
              const bodyTop = toY(Math.max(c.open, c.close));
              const bodyH = Math.max(1, Math.abs(toY(c.open) - toY(c.close)));
              const cw = Math.max(1, chartW / candles.length * 0.6);
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={toY(c.high)} y2={toY(c.low)} stroke={col} strokeWidth="1" />
                  <rect x={x - cw / 2} y={bodyTop} width={cw} height={bodyH} fill={col} />
                </g>
              );
            })
          )}

          {/* Hover crosshair */}
          {hovered && hoveredIndex !== null && (
            <>
              <line x1={toX(hoveredIndex)} x2={toX(hoveredIndex)} y1={PAD.top} y2={H - PAD.bottom} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={toX(hoveredIndex)} cy={toY(hovered.close)} r="4" fill={lineColor} stroke="white" strokeWidth="2" />
            </>
          )}
        </svg>

        {hovered && (
          <div className="absolute top-3 left-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">{hovered.date}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-gray-600 dark:text-gray-400">
              <span>O: <span className="text-gray-900 dark:text-white">${hovered.open.toFixed(2)}</span></span>
              <span>H: <span className="text-green-500">${hovered.high.toFixed(2)}</span></span>
              <span>C: <span className="text-gray-900 dark:text-white">${hovered.close.toFixed(2)}</span></span>
              <span>L: <span className="text-red-500">${hovered.low.toFixed(2)}</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
