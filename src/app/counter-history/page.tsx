'use client';

import useSWR from 'swr';

import Chart from "./Chart";

async function fetchHistory() {
    const historyObj = await fetch('/api/counter-history', { cache: 'no-store' }).then((res) => res.json());
    const monthAndValues = Object.entries(historyObj).map(([key, value]) => ({ month: key, count: value }));

    // Fill missing months to preserve scale.
    const year = new Date().getFullYear();
    for (let i = 1; i <= 12; i++) {
        const month = (i).toString().padStart(2, '0');
        const monthKey = `${year}-${month}`;
        if (!monthAndValues.find(x => x.month === monthKey)) {
            monthAndValues.push({ month: monthKey, count: 0 });
        }
    }

    console.log('monthAndValues', monthAndValues);

    return monthAndValues;
}

export default function NaHistory() {
    const { data, error, isLoading } = useSWR('/api/counter-history', fetchHistory);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Quota History</h1>
            <Chart data={data} />
        </div>
    );
}
