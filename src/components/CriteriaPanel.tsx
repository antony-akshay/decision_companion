import { useEffect, useRef } from "react";
import { type Criterion } from "../types/decision";
import toast from "react-hot-toast";

interface CriteriaPanelProps {
    criteria: Criterion[];
    addCriterion: () => void;
    updateCriterion: (
        id: string,
        field: keyof Criterion,
        value: string | number | boolean
    ) => void;
    deleteCriterion: (id: string) => void;
}

export default function CriteriaPanel({
    criteria,
    addCriterion,
    updateCriterion,
    deleteCriterion,
}: CriteriaPanelProps) {

    // Only enabled criteria participate in weight logic
    const enabledCriteria = criteria.filter(c => c.enabled);

    const totalWeight = enabledCriteria.reduce(
        (sum, criterion) => sum + Number(criterion.weight || 0),
        0
    );

    const hasNegativeWeight = enabledCriteria.some(
        (criterion) => Number(criterion.weight) < 0
    );

    const hasInvalidWeight = enabledCriteria.some(
        (criterion) =>
            isNaN(Number(criterion.weight)) ||
            Number(criterion.weight) === undefined
    );

    const normalizedNames = criteria.map(c =>
        c.name.trim().toLowerCase()
    );

    const hasDuplicateNames =
        new Set(normalizedNames).size !== normalizedNames.length;

    const allWeightsZero =
        enabledCriteria.length > 0 && totalWeight === 0;

    // const weightNotNormalized =
    //     totalWeight !== 0 &&
    //     Math.abs(totalWeight - 1) > 0.001;

    const isValidState =
        enabledCriteria.length > 0 &&
        !allWeightsZero &&
        !hasNegativeWeight &&
        !hasInvalidWeight;

    const maxWeight =
        enabledCriteria.length > 0
            ? Math.max(...enabledCriteria.map(c => Number(c.weight) || 0))
            : 0;

    const dominanceRatio =
        totalWeight > 0
            ? maxWeight / totalWeight
            : 0;

    const dominanceToastShown = useRef(false);

    useEffect(() => {
        if (dominanceRatio > 0.75 && totalWeight > 0) {
            if (!dominanceToastShown.current) {
                toast.error(
                    `One enabled criterion dominates ${(dominanceRatio * 100).toFixed(0)}% of the decision.`
                );
                dominanceToastShown.current = true;
            }
        } else {
            dominanceToastShown.current = false;
        }
    }, [dominanceRatio, totalWeight]);

    useEffect(() => {
        if (enabledCriteria.length === 0) {
            toast.error("At least one criterion must be enabled.");
        }
    }, [enabledCriteria.length]);

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Criteria
                </h2>

                <button
                    onClick={addCriterion}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-lg transition"
                >
                    +
                </button>
            </div>

            {/* Validation Messages */}
            <div className="space-y-3 mb-6">

                {enabledCriteria.length === 0 && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Enable at least one criterion.
                    </div>
                )}

                {allWeightsZero && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Total enabled weight is 0.
                    </div>
                )}

                {hasNegativeWeight && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Weights cannot be negative.
                    </div>
                )}

                {hasInvalidWeight && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Invalid weight detected.
                    </div>
                )}

                {/* {weightNotNormalized && !allWeightsZero && (
                    <div className="p-3 rounded-lg bg-yellow-100 text-yellow-700 text-sm">
                        Total enabled weight is {totalWeight.toFixed(2)}.
                        It will be rescaled automatically.
                    </div>
                )} */}

                {isValidState && (
                    <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                        Configuration valid.
                    </div>
                )}

                {dominanceRatio > 0.75 && totalWeight > 0 && (
                    <div className="p-3 rounded-lg bg-yellow-100 text-yellow-800 text-sm">
                        One criterion dominates {(dominanceRatio * 100).toFixed(0)}%.
                    </div>
                )}

                {hasDuplicateNames && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Duplicate criterion names detected.
                    </div>
                )}
            </div>

            {/* Criteria List */}
            <div className="space-y-4">

                {criteria.map((criterion) => (

                    <div
                        key={criterion.id}
                        className={`p-4 rounded-xl border transition
                            ${criterion.enabled
                                ? "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 hover:shadow-md"
                                : "bg-gray-100 border-gray-300 opacity-60"
                            }`}
                    >

                        {/* Name + Toggle + Delete */}
                        <div className="flex justify-between items-center mb-3">

                            <input
                                value={criterion.name}
                                disabled={!criterion.enabled}
                                onChange={(event) =>
                                    updateCriterion(
                                        criterion.id,
                                        "name",
                                        event.target.value
                                    )
                                }
                                className="flex-1 font-semibold text-lg bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-1 outline-none"
                            />

                            {/* TOGGLE BUTTON */}
                            <button
                                onClick={() =>
                                    updateCriterion(
                                        criterion.id,
                                        "enabled",
                                        !criterion.enabled
                                    )
                                }
                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${criterion.enabled ? "bg-green-500" : "bg-red-500"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${criterion.enabled ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>

                            <button
                                // disabled={criteria.length <= 1}
                                onClick={() =>
                                    deleteCriterion(criterion.id)
                                }
                                className={`ml-2 p-2 rounded-lg ${criteria.length <= 1
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-red-500 hover:bg-red-100"
                                    }`}
                            >
                                X
                            </button>
                        </div>

                        {/* Weight + Type */}
                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="text-sm text-gray-600">
                                    Weight
                                </label>

                                <input
                                    type="number"
                                    step="0.05"
                                    min="0"
                                    max="1"
                                    disabled={!criterion.enabled}
                                    value={criterion.weight}
                                    onChange={(event) => {

                                        const numericValue =
                                            Number(event.target.value);

                                        if (isNaN(numericValue)) return;
                                        if (numericValue < 0) return;

                                        updateCriterion(
                                            criterion.id,
                                            "weight",
                                            numericValue
                                        );
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    Type
                                </label>

                                <select
                                    disabled={!criterion.enabled}
                                    value={criterion.type}
                                    onChange={(event) =>
                                        updateCriterion(
                                            criterion.id,
                                            "type",
                                            event.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="benefit">
                                        Benefit ↑
                                    </option>
                                    <option value="cost">
                                        Cost ↓
                                    </option>
                                </select>
                            </div>

                        </div>

                    </div>

                ))}

            </div>
        </div>
    );
}