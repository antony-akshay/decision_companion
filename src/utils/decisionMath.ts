import { type Breakdown, type Criterion, type Option, type ScoredOption } from "../types/decision";

// Normalize values
export function normalize(
    options: Option[],
    criteria: Criterion[]
) {

    const normalized: any = {};

    criteria.forEach(c => {

        const values = options.map(o =>
            Number(o.values[c.id] || 0)
        );

        const max = Math.max(...values);
        const min = Math.min(...values);

        options.forEach(o => {

            if (!normalized[o.id])
                normalized[o.id] = {};

            const raw =
                Number(o.values[c.id] || 0);

            if (c.type === "benefit") {

                normalized[o.id][c.id] =
                    max === 0 ? 0 : raw / max;

            } else {

                normalized[o.id][c.id] =
                    raw === 0 ? 0 : min / raw;

            }

        });

    });

    return normalized;

}


// Score calculation
export function calculateScores(
    options: Option[],
    criteria: Criterion[]
) {

    const norm = normalize(options, criteria);

    return options.map(o => {

        let total = 0;

        const breakdown: Record<string, Breakdown> = {};

        criteria.forEach(c => {

            const n = Number(norm[o.id]?.[c.id] || 0);

            const w = Number(c.weight || 0);

            const contribution = n * w;

            breakdown[c.id] = {
                normalized: n,
                weight: w,
                contribution
            };

            total += contribution;

        });

        return {
            ...o,
            score: Number(total) || 0,
            breakdown
        };

    });

}


// Ranking
export function rankOptions(
    options: ScoredOption[]
) {
    return [...options].sort(
        (a, b) => b.score - a.score
    );
}