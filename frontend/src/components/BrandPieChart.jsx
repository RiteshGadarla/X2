import { useRef, useState, useLayoutEffect } from 'react';
import { BRAND_COLORS } from '../config/brand';

const useAutoHeight = (fallback = 200) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(fallback);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const h = Math.round(entry.contentRect.height);
            if (h > 0) setHeight(h);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return [ref, height];
};

const defaultPalette = [
    BRAND_COLORS.primary,
    BRAND_COLORS.pink,
    BRAND_COLORS.cyan,
    BRAND_COLORS.success,
    BRAND_COLORS.warning,
    BRAND_COLORS.error,
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const applyAlpha = (color, alpha = 0.14) => {
    // Works with CSS vars and hex colors while keeping brand token support.
    if (typeof color !== 'string' || !color.trim()) return `rgba(89, 41, 208, ${alpha})`;
    return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
};

const formatDefaultValue = (value) => {
    if (typeof value !== 'number') return String(value ?? '');
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000) return `${Math.round(value / 1000)}k`;
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(1);
};

const buildPath = (points, closeToBaseline = false, baselineY = 0) => {
    if (!points.length) return '';
    const [first, ...rest] = points;
    const line = [`M ${first.x} ${first.y}`, ...rest.map((point) => `L ${point.x} ${point.y}`)].join(' ');
    if (!closeToBaseline) return line;
    return `${line} L ${points[points.length - 1].x} ${baselineY} L ${first.x} ${baselineY} Z`;
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

const describeDonutSlice = (centerX, centerY, outerRadius, innerRadius, startAngle, endAngle) => {
    const startOuter = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const endOuter = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const startInner = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const endInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
        `M ${startOuter.x} ${startOuter.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
        `L ${startInner.x} ${startInner.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y}`,
        'Z'
    ].join(' ');
};

const BrandBarChart = ({
    data,
    height = 220,
    categoryKey = 'name',
    valueKey = 'value',
    series,
    yTickFormatter = formatDefaultValue,
    valueFormatter = formatDefaultValue,
    palette = defaultPalette,
    showLegend = false,
}) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    const resolvedSeries = Array.isArray(series) && series.length
        ? series.map((item, index) => ({
            key: item.key || valueKey,
            label: item.label || item.key || valueKey,
            color: item.color || palette[index % palette.length],
        }))
        : [{ key: valueKey, label: valueKey, color: palette[0] }];

    const numericValues = data.flatMap((entry) => resolvedSeries.map((item) => Number(entry[item.key]) || 0));
    const maxValue = Math.max(...numericValues, 1);
    const width = 1000;
    const left = 62;
    const right = 18;
    const top = 30;
    const bottom = 42;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const rowCount = 4;
    const categoryWidth = plotWidth / data.length;
    const groupedBarWidth = resolvedSeries.length > 1 ? categoryWidth * 0.7 / resolvedSeries.length : categoryWidth * 0.52;
    const groupGap = resolvedSeries.length > 1 ? (categoryWidth - groupedBarWidth * resolvedSeries.length) / 2 : (categoryWidth - groupedBarWidth) / 2;
    const tickPositions = Array.from({ length: rowCount + 1 }, (_, index) => (maxValue / rowCount) * index);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Brand bar chart">
                {tickPositions.map((tickValue) => {
                    const y = top + plotHeight - (tickValue / maxValue) * plotHeight;
                    return (
                        <g key={tickValue}>
                            <line x1={left} x2={width - right} y1={y} y2={y} stroke="var(--neutral-7)" strokeDasharray="4 4" />
                            <text x={left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="var(--neutral-4)">{yTickFormatter(tickValue)}</text>
                        </g>
                    );
                })}

                {data.map((entry, categoryIndex) => {
                    const categoryStart = left + categoryIndex * categoryWidth;
                    return resolvedSeries.map((seriesItem, seriesIndex) => {
                        const value = Number(entry[seriesItem.key]) || 0;
                        const barHeight = (value / maxValue) * plotHeight;
                        const x = categoryStart + groupGap + seriesIndex * groupedBarWidth;
                        const y = top + plotHeight - barHeight;
                        const fill = entry.color || seriesItem.color;
                        const spaceAbove = y - top;
                        const labelAbove = spaceAbove >= 16;
                        const labelY = labelAbove ? y - 7 : y + 16;
                        const labelFill = labelAbove ? 'var(--neutral-2)' : '#ffffff';

                        return (
                            <g key={`${entry[categoryKey]}-${seriesItem.key}`}>
                                <rect x={x} y={y} width={groupedBarWidth} height={barHeight} rx="6" fill={fill} />
                                <text x={x + groupedBarWidth / 2} y={labelY} textAnchor="middle" fontSize="11" fontWeight="700" fill={labelFill}>{valueFormatter(value)}</text>
                            </g>
                        );
                    });
                })}

                {data.map((entry, index) => {
                    const x = left + index * categoryWidth + categoryWidth / 2;
                    return (
                        <text key={entry[categoryKey]} x={x} y={height - 16} textAnchor="middle" fontSize="10" fill="var(--neutral-4)">
                            {entry[categoryKey]}
                        </text>
                    );
                })}

                <line x1={left} x2={width - right} y1={top + plotHeight} y2={top + plotHeight} stroke="var(--neutral-6)" />
            </svg>

            {showLegend && resolvedSeries.length > 1 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', marginTop: '4px' }}>
                    {resolvedSeries.map((item) => (
                        <div key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color, flexShrink: 0 }} />
                            <span style={{ fontSize: '11px', color: 'var(--neutral-3)', fontWeight: 500 }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

const BrandLineChart = ({
    data,
    height: fallbackHeight = 200,
    categoryKey = 'name',
    valueKey = 'value',
    color = BRAND_COLORS.primary,
    valueFormatter = formatDefaultValue,
    showArea = false,
    areaOpacity = 0.18,
    minValue,
}) => {
    const [containerRef, height] = useAutoHeight(fallbackHeight);

    if (!Array.isArray(data) || data.length === 0) return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;

    const width = 1000;
    const left = 58;
    const right = 18;
    const top = 48;
    const bottom = 36;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const values = data.map((entry) => Number(entry[valueKey]) || 0);
    const maxValue = Math.max(...values, 1);
    const baseMin = (() => {
        if (minValue !== undefined) return minValue;
        const min = Math.min(...values);
        if (min <= 0) return 0;
        const raw = min - (maxValue - min) * 0.3;
        if (raw <= 0) return 0;
        const mag = Math.pow(10, Math.floor(Math.log10(raw)));
        return Math.floor(raw / mag) * mag;
    })();
    const range = maxValue - baseMin || 1;

    const toY = (value) => top + plotHeight - ((value - baseMin) / range) * plotHeight;

    const points = data.map((entry, index) => {
        const value = Number(entry[valueKey]) || 0;
        const x = left + (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
        return { x, y: toY(value), value, label: entry[categoryKey] };
    });

    const tickCount = 4;
    const tickValues = Array.from({ length: tickCount + 1 }, (_, i) => baseMin + (range / tickCount) * i);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 0 }}>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="Brand line chart">
                {tickValues.map((tickValue) => {
                    const y = toY(tickValue);
                    return (
                        <g key={tickValue}>
                            <line x1={left} x2={width - right} y1={y} y2={y} stroke="var(--neutral-7)" strokeDasharray="4 4" />
                            <text x={left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--neutral-4)">{valueFormatter(tickValue)}</text>
                        </g>
                    );
                })}

                {showArea ? <path d={buildPath(points, true, top + plotHeight)} fill={applyAlpha(color, areaOpacity)} stroke="none" /> : null}
                <path d={buildPath(points)} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

                {points.map((point, index) => {
                    const labelY = point.y - 14;
                    return (
                        <g key={point.label}>
                            <circle cx={point.x} cy={point.y} r="5" fill={color} />
                            <text x={point.x} y={labelY} textAnchor="middle" fontSize="26" fontWeight="800" fill={color}>{valueFormatter(point.value)}</text>
                            <text x={point.x} y={height - 12} textAnchor="middle" fontSize="10" fill="var(--neutral-4)">{data[index][categoryKey]}</text>
                        </g>
                    );
                })}

                <line x1={left} x2={width - right} y1={top + plotHeight} y2={top + plotHeight} stroke="var(--neutral-6)" />
            </svg>
        </div>
    );
};

const BrandAreaChart = (props) => <BrandLineChart {...props} showArea />;

const BrandPieChart = ({
    data,
    innerRadius = 36,
    outerRadius = 60,
    height = 170,
    palette = defaultPalette,
    centerLabel,
    legend = true,
}) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    const chartData = data.map((entry, index) => ({
        ...entry,
        color: entry.color || palette[index % palette.length],
    }));

    const total = chartData.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0) || 1;
    const width = 220;
    const drawingHeight = 220;
    const centerX = drawingHeight / 2;
    const centerY = drawingHeight / 2;
    const maxRadius = Math.min(centerX - 14, centerY - 12);
    const safeOuterRadius = clamp(outerRadius, 22, maxRadius);
    const safeInnerRadius = clamp(innerRadius, 12, safeOuterRadius - 8);
    let startAngle = 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <svg viewBox={`0 0 ${width} ${drawingHeight}`} width="100%" height={height} role="img" aria-label="Brand pie chart">
                {chartData.map((entry) => {
                    const sliceAngle = (Number(entry.value) / total) * 360;
                    const endAngle = startAngle + sliceAngle;
                    const path = describeDonutSlice(centerX, centerY, safeOuterRadius, safeInnerRadius, startAngle, endAngle);
                    startAngle = endAngle;
                    return <path key={entry.name} d={path} fill={entry.color} stroke={BRAND_COLORS.neutral9} strokeWidth="2" />;
                })}

                {centerLabel ? (
                    <g pointerEvents="none">
                        <text x={centerX} y={centerY - 2} textAnchor="middle" fontSize="10" fill="var(--neutral-4)">{centerLabel.label}</text>
                        <text x={centerX} y={centerY + 14} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--neutral-1)">{centerLabel.value}</text>
                    </g>
                ) : null}
            </svg>

            {legend ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {chartData.map((entry) => (
                        <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: entry.color, flexShrink: 0 }} />
                                <span style={{ fontSize: '10px', color: 'var(--neutral-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</span>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--neutral-1)' }}>{entry.value}</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export { BrandAreaChart, BrandBarChart, BrandLineChart, BrandPieChart };
export default BrandPieChart;