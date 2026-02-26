import { useEffect } from "react";
import { type Criterion } from "../types/decision";
import toast from "react-hot-toast";

interface CriteriaPanelProps {
    criteria: Criterion[];
    addCriterion: () => void;
    updateCriterion: (
        id: string,
        field: keyof Criterion,
        value: string | number
    ) => void;
    deleteCriterion: (id: string) => void;
}

export default function CriteriaPanel({
    criteria,
    addCriterion,
    updateCriterion,
    deleteCriterion,
}: CriteriaPanelProps) {

    /* ===============================
       Derived Validation State
    =============================== */



    const totalWeight = criteria.reduce(
        (sum, criterion) => sum + Number(criterion.weight || 0),
        0
    );

    const hasNegativeWeight = criteria.some(
        (criterion) => Number(criterion.weight) < 0
    );

    const hasInvalidWeight = criteria.some(
        (criterion) =>
            isNaN(Number(criterion.weight)) ||
            Number(criterion.weight) === undefined
    );

    const allWeightsZero = totalWeight === 0;

    const weightNotNormalized =
        totalWeight !== 0 &&
        Math.abs(totalWeight - 1) > 0.001;

    const isValidState =
        criteria.length > 0 &&
        !allWeightsZero &&
        !hasNegativeWeight &&
        !hasInvalidWeight;

    const maxWeight =
        criteria.length > 0
            ? Math.max(...criteria.map(c => Number(c.weight) || 0))
            : 0;

    const dominanceRatio =
        totalWeight > 0
            ? maxWeight / totalWeight
            : 0;


    useEffect(() => {
        if (dominanceRatio > 0.75 && totalWeight > 0) {
            // if (!dominanceToastShown.current) {
            //     toast(
            //         `One criterion dominates ${(dominanceRatio * 100).toFixed(0)}% of the decision.`,
            //         { icon: "⚠" }
            //     );
            //     dominanceToastShown.current = true;
            // }
        // } else {
        //     dominanceToastShown.current = false;
        toast.error(`One criterion dominates ${(dominanceRatio * 100).toFixed(0)}% of the decision.`,)
        }
    }, [
        allWeightsZero,
        hasNegativeWeight,
        hasInvalidWeight,
        dominanceRatio,
        totalWeight,
        criteria.length
    ]);
    /* ===============================
       Render
    =============================== */



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

                {criteria.length === 0 && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        At least one criterion is required.
                    </div>
                )}

                {allWeightsZero && criteria.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Total weight is 0. Assign weight to at least one criterion.
                    </div>
                )}

                {hasNegativeWeight && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Weights cannot be negative.
                    </div>
                )}

                {hasInvalidWeight && (
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        Invalid weight detected. Please enter valid numbers.
                    </div>
                )}

                {weightNotNormalized && !allWeightsZero && (
                    <div className="p-3 rounded-lg bg-yellow-100 text-yellow-700 text-sm">
                        Total weight is {totalWeight.toFixed(2)}.
                        Weights will be proportionally rescaled during scoring.
                    </div>
                )}

                {isValidState && (
                    <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                        Criteria configuration is valid.
                    </div>
                )}

                {dominanceRatio > 0.75 && totalWeight > 0 && (
                    <div className="p-3 rounded-lg bg-yellow-100 text-yellow-800 text-sm">
                        One criterion dominates {(dominanceRatio * 100).toFixed(0)}% of the decision.
                        Ensure this reflects your true preference.
                    </div>
                )}

            </div>


            {/* Criteria List */}
            <div className="space-y-4">

                {criteria.map((criterion) => (

                    <div
                        key={criterion.id}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition"
                    >

                        {/* Name + Delete */}
                        <div className="flex justify-between mb-3">

                            <input
                                value={criterion.name}
                                onChange={(event) =>
                                    updateCriterion(
                                        criterion.id,
                                        "name",
                                        event.target.value
                                    )
                                }
                                className="flex-1 font-semibold text-lg bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-1 outline-none"
                            />

                            <button
                                disabled={criteria.length <= 1}
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