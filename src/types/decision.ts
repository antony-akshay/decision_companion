export interface Criterion {
    id: string;
    name: string;
    weight: number;
    type: "benefit" | "cost";
}

export interface Option {
    id: string;
    name: string;
    values: Record<string, number>;
}