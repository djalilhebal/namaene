'use client';

import useSWR from 'swr';

import Chart from './Chart';

async function fetchHistory() {
  const historyObj = await fetch('/api/counter-history', { cache: 'no-store' }).then((res) => res.json());
  const monthAndValues = Object.entries(historyObj).map(([key, value]) => ({ month: key, count: value }));

  // Fill missing months to preserve scale.
  const year = new Date().getFullYear();
  for (let i = 1; i <= 12; i++) {
    const month = (i).toString().padStart(2, '0')
    const monthKey = `${year}-${month}`;
    if (!monthAndValues.find(x => x.month === monthKey)) {
      monthAndValues.push({ month: monthKey, count: 0 });
    }
  }

  return monthAndValues;
}

export default function NaHistory() {
  const { data, error, isLoading } = useSWR('/api/counter-history', fetchHistory);

  return (
    <div className="min-h-screen bg-orange-50 p-4 flex items-center justify-center">
      <div className="mx-auto max-w-lg w-full p-4 bg-white border-none text-center">
        <div className="pb-0 text-center">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="text-orange-500">Counter</span>
            <span className="text-orange-600">History</span>
          </h1>
          <p className="text-sm text-gray-500 mb-6">Monthly usage statistics for Namaene</p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64 text-gray-500">
            Loading...
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64 text-red-500">
            Error: {error.message}
          </div>
        )}

        {data && (
          <div className="bg-white rounded-lg p-4">
            <Chart data={data} />
          </div>
        )}

        <div className="pt-6 text-center text-xs text-gray-500 w-full">
          <a
            href="/"
            className="text-orange-600 hover:underline"
          >
            Back to Namaene
          </a>
        </div>

      </div>
    </div>
  )
}
