import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import Image from 'next/image';

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'heatmap' | 'treemap' | 
        'sunburst' | 'sankey' | 'funnel' | 'gauge' | 'boxplot' | 'candlestick' |
        'parallel' | 'themeRiver' | 'graph' | 'tree';
  xAxis?: string[];
  yAxis?: string[];
  series: any[]; // Type générique pour supporter tous les formats
  title?: string;
  subtitle?: string;
  legend?: boolean;
  tooltip?: boolean;
  toolbox?: boolean;
  grid?: any;
  // Options spécifiques
  radius?: string | string[];
  center?: string[];
  roseType?: boolean;
  min?: number;
  max?: number;
  splitNumber?: number;
  links?: Array<{ source: string; target: string; value: number }>;
}

export function EChartDisplay({ data }: { data: ChartData }) {
  const options = useMemo(() => {
    const baseOptions = {
      title: data.title ? {
        text: data.title,
        subtext: data.subtitle
      } : undefined,
      tooltip: data.tooltip !== false ? { show: true } : undefined,
      legend: data.legend !== false ? { show: true } : undefined,
      toolbox: data.toolbox !== false ? {
        feature: {
          saveAsImage: {},
          dataZoom: {},
          dataView: {},
          restore: {}
        }
      } : undefined
    };

    switch (data.type) {
      case 'sunburst':
        return {
          ...baseOptions,
          series: [{
            type: 'sunburst',
            data: data.series,
            radius: data.radius || ['0%', '90%'],
            label: { show: true }
          }]
        };

      case 'sankey':
        return {
          ...baseOptions,
          series: [{
            type: 'sankey',
            data: data.series,
            links: data.links,
            emphasis: { focus: 'adjacency' }
          }]
        };

      case 'funnel':
        return {
          ...baseOptions,
          series: [{
            type: 'funnel',
            data: data.series,
            sort: 'descending',
            gap: 2
          }]
        };

      case 'gauge':
        return {
          ...baseOptions,
          series: [{
            type: 'gauge',
            data: data.series,
            progress: { show: true },
            axisLine: { lineStyle: { width: 30 } },
            pointer: { itemStyle: { color: 'auto' } }
          }]
        };

      case 'candlestick':
        return {
          ...baseOptions,
          xAxis: { type: 'category', data: data.xAxis },
          yAxis: { type: 'value' },
          series: [{
            type: 'candlestick',
            data: data.series
          }]
        };

      case 'graph':
        return {
          ...baseOptions,
          series: [{
            type: 'graph',
            layout: 'force',
            data: data.series,
            links: data.links,
            roam: true,
            label: { show: true },
            force: { repulsion: 100 }
          }]
        };

      case 'tree':
        return {
          ...baseOptions,
          series: [{
            type: 'tree',
            data: [data.series[0]],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: { position: 'left', verticalAlign: 'middle', align: 'right' }
          }]
        };

      case 'parallel':
        return {
          ...baseOptions,
          parallelAxis: data.yAxis?.map((dim, index) => ({
            dim: index,
            name: dim
          })),
          series: [{
            type: 'parallel',
            lineStyle: { width: 2 },
            data: data.series
          }]
        };

      // ... garder les cas existants (line, bar, pie, scatter, radar, heatmap, treemap) ...

      default:
        return {
          ...baseOptions,
          xAxis: { type: 'category', data: data.xAxis },
          yAxis: { type: 'value' },
          series: data.series.map(s => ({
            ...s,
            type: s.type || data.type
          }))
        };
    }
  }, [data]);

  return (
    <div className="w-full max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] h-[400px] bg-white rounded-lg shadow-sm mx-auto">
      <ReactECharts 
        option={options}
        style={{ height: '100%', width: '100%' }}
        theme="light"
      />
    </div>
  );
} 