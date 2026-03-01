export interface Criterion {
    id: string;
    name: string;
    weight: number;
    type: "benefit" | "cost";
    enabled: boolean;
}

export interface Option {
    id: string;
    name: string;
    values: Record<string, number>;
}

export interface Breakdown {
    normalized: number;
    weight: number;
    contribution: number;
}

export interface ScoredOption extends Option {
    score: number;
    breakdown: Record<string, Breakdown>;
}