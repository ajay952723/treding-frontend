import React, { useEffect, useState, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/State/Store';
import { fetchMarketChart } from '@/State/coin/coinSlice';
import debounce from 'lodash/debounce';


const timeSeries = [
  { label: '1 Day', value: 1 },
  { label: '1 Week', value: 7 },
  { label: '1 Month', value: 30 },
  { label: '1 Year', value: 365 }
];

const cache: Record<string, any> = {}; // Simple in-memory cache

const StockChart = () => {
  const dispatch = useAppDispatch();
  const selectedCoin = useAppSelector((state) => state.coin.selectedCoin);
  const chartData = useAppSelector((state) => state.coin.chartData);
  const [activeLabel, setActiveLabel] = useState('1 Day');
  const lastFetchedKey = useRef('');

  // Debounced fetch function
  const fetchChart = useRef(
    debounce((coinId: string, days: number) => {
      const cacheKey = `${coinId}_${days}`;
      if (cache[cacheKey]) return; // Skip if already fetched
      dispatch(fetchMarketChart({ coinId, days }));
      cache[cacheKey] = true; // Mark as fetched
      lastFetchedKey.current = cacheKey;
    }, 500)
  ).current;

  useEffect(() => {
    if (selectedCoin?.id) {
      const days = timeSeries.find(t => t.label === activeLabel)?.value || 1;
      const cacheKey = `${selectedCoin.id}_${days}`;
      if (cacheKey !== lastFetchedKey.current) {
        fetchChart(selectedCoin.id, days);
      }
    }
  }, [selectedCoin?.id, activeLabel, fetchChart]);

  const series = [
    {
      name: selectedCoin?.symbol?.toUpperCase() || 'Price',
      data: chartData?.prices || [],
    },
  ];

  const options: ApexOptions = {
    chart: {
      id: 'market-chart',
      type: 'area',
      height: 450,
      toolbar: { show: false },
      zoom: { autoScaleYaxis: true }
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'datetime',
      tickAmount: 6,
    },
    colors: ['#3b82f6'],
    tooltip: { theme: 'dark' },
    markers: {
      size: 0,
      strokeColors: '#fff',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: '#47535E',
      strokeDashArray: 4,
    }
  };

  return (
    <div>
      <div className="space-x-3 mb-4">
        {timeSeries.map((t) => (
          <Button
            key={t.label}
            onClick={() => setActiveLabel(t.label)}
            variant={activeLabel === t.label ? 'default' : 'outline'}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <ReactApexChart options={options} series={series} type="area" height={450} />
    </div>
  );
};

export default StockChart;
