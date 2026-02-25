import type { Criterion } from '../types/decision'

interface Props {
    criteria: Criterion[],
    addCriterion: () => void;
    updateCriterion: (
        id: string,
        field: keyof Criterion,
        value: string | number
    ) => void;
    deleteCriterion: (id: string) => void;
}

const CriteriaPanel = ({
    criteria,
    addCriterion,
    updateCriterion,
    deleteCriterion,
}: Props) => {
    return (

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">

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


            <div className="space-y-4">

                {criteria.map(c => (

                    <div key={c.id}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition">

                        <div className="flex justify-between mb-3">

                            <input
                                value={c.name}
                                onChange={(e) =>
                                    updateCriterion(c.id, "name", e.target.value)
                                }
                                className="flex-1 font-semibold text-lg bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-1 outline-none"
                            />

                            <button
                                onClick={() => deleteCriterion(c.id)}
                                className="text-red-500 hover:bg-red-100 p-2 rounded-lg ml-2"
                            >
                                ✕
                            </button>

                        </div>


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
                                    value={c.weight}
                                    onChange={(e) =>
                                        updateCriterion(
                                            c.id,
                                            "weight",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            <select
                                value={c.type}
                                onChange={(e) =>
                                    updateCriterion(
                                        c.id,
                                        "type",
                                        e.target.value
                                    )
                                }
                                className="px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
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

                ))}

            </div>

        </div>
    )
}

export default CriteriaPanel