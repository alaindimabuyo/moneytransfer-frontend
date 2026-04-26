"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type Range = "1W" | "1M" | "6M";

interface SeriesPoint {
  date: string;
  rate: number;
}
interface SeriesResponse {
  series: {
    source: string;
    target: string;
    range: Range;
    points: SeriesPoint[];
    cacheStatus: "hit" | "miss";
    startDate: string;
    endDate: string;
  };
}

const RANGE_LABEL: Record<Range, string> = {
  "1W": "Last 7 days",
  "1M": "Last 30 days",
  "6M": "Last 6 months",
};

interface Props {
  source: string;
  target: string;
}

export function RateTrendChart({ source, target }: Props) {
  const [range, setRange] = useState<Range>("1M");

  const { data, isLoading, error } = useQuery<SeriesResponse>({
    queryKey: ["rate-series", source, target, range],
    queryFn: () =>
      api<SeriesResponse>(
        `/rates/history?source=${source}&target=${target}&range=${range}`
      ),
    staleTime: 60 * 60 * 1000,
  });

  const points = data?.series.points ?? [];
  const stats = useMemo(() => computeStats(points), [points]);

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient sm:p-8">
      <header>
        <p className="font-label text-label-sm uppercase tracking-[0.22em] text-on_surface-variant">
          {RANGE_LABEL[range]} · {source} → {target}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <h3 className="font-display text-display-md font-bold tabular text-on_surface">
            {stats ? stats.last.toFixed(4) : "—"}
          </h3>
          <span className="font-display text-title-md text-on_surface-variant">
            {target} per {source}
          </span>
          {stats && <TrendBadge change={stats.change} percent={stats.percent} />}
        </div>
      </header>

      <div className="mt-6 min-h-[12rem]">
        {isLoading ? (
          <div className="h-48 animate-pulse rounded-xl bg-surface-container" />
        ) : error || points.length < 2 ? (
          <p className="font-body text-body-md text-on_surface-variant">
            We couldn&apos;t load the rate history just now. The chart will be
            back as soon as our data provider responds.
          </p>
        ) : (
          <Sparkline points={points} source={source} target={target} />
        )}
      </div>

      <RangeTabs value={range} onChange={setRange} />
    </section>
  );
}

function computeStats(points: SeriesPoint[]) {
  if (points.length < 2) return null;
  const first = points[0].rate;
  const last = points[points.length - 1].rate;
  const change = last - first;
  const percent = (change / first) * 100;
  return { first, last, change, percent };
}

function TrendBadge({
  change,
  percent,
}: {
  change: number;
  percent: number;
}) {
  const up = change > 0;
  const flat = Math.abs(percent) < 0.01;
  const tone = flat
    ? "bg-surface-container text-on_surface-variant"
    : up
      ? "bg-secondary-container text-secondary"
      : "bg-error/10 text-error";
  const arrow = flat ? "→" : up ? "▲" : "▼";
  const label = flat
    ? "Flat"
    : `${up ? "Up" : "Down"} ${Math.abs(percent).toFixed(2)}%`;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-label text-label-sm uppercase tracking-[0.18em] ${tone}`}
    >
      <span aria-hidden>{arrow}</span>
      {label}
    </span>
  );
}

function Sparkline({
  points,
  source,
  target,
}: {
  points: SeriesPoint[];
  source: string;
  target: string;
}) {
  const width = 800;
  const height = 220;
  const padX = 8;
  const padY = 16;

  const min = Math.min(...points.map((p) => p.rate));
  const max = Math.max(...points.map((p) => p.rate));
  const padRange = (max - min) * 0.1 || max * 0.005;
  const yMin = min - padRange;
  const yMax = max + padRange;

  const xStep = (width - padX * 2) / (points.length - 1);
  const xy = points.map((p, i) => ({
    x: padX + i * xStep,
    y:
      height -
      padY -
      ((p.rate - yMin) / (yMax - yMin || 1)) * (height - padY * 2),
    point: p,
  }));

  const linePath = xy
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L${xy[xy.length - 1].x.toFixed(2)},${height} L${xy[0].x.toFixed(2)},${height} Z`;

  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number; idx: number } | null>(null);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "min(38vw, 240px)" }}
        onMouseMove={(e) => {
          const svg = svgRef.current;
          if (!svg) return;
          const rect = svg.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * width;
          // find nearest x by binary scan (linear is fine for ~180 points)
          let nearest = 0;
          let bestDx = Infinity;
          for (let i = 0; i < xy.length; i++) {
            const dx = Math.abs(xy[i].x - px);
            if (dx < bestDx) {
              bestDx = dx;
              nearest = i;
            }
          }
          setHover({ x: xy[nearest].x, y: xy[nearest].y, idx: nearest });
        }}
        onMouseLeave={() => setHover(null)}
      >
        {/* Area fill — bound to --color-primary via inline style so the
            opacity modifier doesn't get dropped by Tailwind's var-color path. */}
        <path
          d={areaPath}
          fill="var(--color-primary)"
          fillOpacity="0.12"
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {hover && (
          <>
            <line
              x1={hover.x}
              x2={hover.x}
              y1={padY}
              y2={height - padY}
              stroke="var(--color-on-surface-variant)"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
            />
            <circle
              cx={hover.x}
              cy={hover.y}
              r="5"
              fill="var(--color-primary)"
            />
          </>
        )}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-surface-container-lowest px-3 py-2 shadow-ambient"
          style={{
            left: `${(hover.x / width) * 100}%`,
            top: `${(hover.y / height) * 100}%`,
          }}
        >
          <p className="font-label text-label-sm uppercase tracking-[0.18em] text-on_surface-variant">
            {formatTooltipDate(xy[hover.idx].point.date)}
          </p>
          <p className="mt-0.5 font-display text-title-sm tabular text-on_surface">
            1 {source} = {xy[hover.idx].point.rate.toFixed(4)} {target}
          </p>
        </div>
      )}
    </div>
  );
}

function formatTooltipDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RangeTabs({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  return (
    <div className="mt-6 inline-flex rounded-2xl bg-surface-container-low p-1">
      {(["1W", "1M", "6M"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          aria-pressed={r === value}
          className={`rounded-xl px-4 py-2 font-display text-title-sm transition-colors ${
            r === value
              ? "bg-surface-container-lowest text-on_surface shadow-ambient"
              : "text-on_surface-variant hover:text-on_surface"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
