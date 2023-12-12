import { kv } from '@vercel/kv';

/**
 * @file Quota counter functions
 */ 

/**
 * A key for each month (UTC time).
 */
function getCurrentCountKey() {
    // "The timezone is always UTC" - toISOString on MDN
    const nowIso = new Date().toISOString();
    const yearMonth = nowIso.substring(0, 'yyyy-mm'.length);
    const counterKey = `counter:${yearMonth}`;

    return counterKey;
}

/**
 * Current count, characters used this month.
 */
export async function getCurrentCount() {
    const counterKey = getCurrentCountKey();
    const currentCount = await kv.get(counterKey);
    return currentCount;
}

/**
 * After increasing by `characters`.
 */
export async function getNewCountWith(characters: number) {
    const counterKey = getCurrentCountKey();
    const newCount = await kv.incrby(counterKey, characters);
    return newCount;
}
