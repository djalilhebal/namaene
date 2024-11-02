import { kv } from '@vercel/kv';

/**
 * @file Quota counter functions
 */

const COUNTER_HASH = 'namaene-counter';

/**
 * A key for each month (UTC time).
 */
function getCurrentCountHashKey() {
    // "The timezone is always UTC" - toISOString on MDN
    const nowIso = new Date().toISOString();
    const yearMonth = nowIso.substring(0, 'yyyy-mm'.length);
    return yearMonth;
}

/**
 * Get new count after incrementing by `characters`.
 */
export async function getNewCountWith(characters: number) {
    const counterKey = getCurrentCountHashKey();
    const newCount = await kv.hincrby(COUNTER_HASH, counterKey, characters);
    return newCount;
}

/**
 * Get current count for this month.
 */
export async function getCurrentCount() {
    const counterKey = getCurrentCountHashKey();
    const currentCount = await kv.hget(COUNTER_HASH, counterKey);
    return currentCount;
}

/**
 * Returns Record<month, count>
 */
export async function getCounterHistory(): Promise<Record<string, any>> {
    const allValues = await kv.hgetall(COUNTER_HASH);
    console.log(allValues);
    if (allValues === null) {
        console.warn('No counter history found', 'COUNTER_HASH', COUNTER_HASH);
        return {};
    }
    return allValues;
}
