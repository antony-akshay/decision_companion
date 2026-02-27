import toast from "react-hot-toast";
import { type Criterion, type Option } from "../types/decision";
import { useEffect, useRef } from "react";

interface Props {

    options: Option[];
    criteria: Criterion[];

    addOption: () => void;

    updateOptionName:
    (id: string, name: string) => void;

    updateOptionValue:
    (o: string, c: string, v: string) => void;

    deleteOption:
    (id: string) => void;
}

export default function OptionsPanel({
    options,
    criteria,
    addOption,
    updateOptionName,
    updateOptionValue,
    deleteOption
}: Props) {

    const identicalToastShown = useRef(false);

    useEffect(() => {

        if (options.length < 2) {
            identicalToastShown.current = false;
            return;
        }

        let foundIdentical = false;

        for (let i = 0; i < options.length; i++) {
            for (let j = i + 1; j < options.length; j++) {

                const optionA = options[i];
                const optionB = options[j];

                const identicalAcrossCriteria =
                    criteria.every(c =>
                        Number(optionA.values[c.id] || 0) ===
                        Number(optionB.values[c.id] || 0)
                    );

                if (identicalAcrossCriteria) {
                    foundIdentical = true;
                    break;
                }
            }

            if (foundIdentical) break;
        }

        if (foundIdentical) {
            if (!identicalToastShown.current) {
                toast(
                    "Two options have identical values across all criteria. Ranking will result in a tie.",
                    { icon: "⚖️" }
                );
                identicalToastShown.current = true;
            }
        } else {
            identicalToastShown.current = false;
        }

    }, [options, criteria]);

    return (

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">

            <div className="flex justify-between mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                    Options
                </h2>

                <button
                    onClick={addOption}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg transition"
                >
                    + Option
                </button>

            </div>


            <div className="space-y-4">

                {options.map(opt => (

                    <div key={opt.id}

                        className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border-2 border-emerald-200 hover:shadow-lg transition">

                        <div className="flex justify-between mb-4">

                            <input
                                value={opt.name}
                                onChange={(e) =>
                                    updateOptionName(
                                        opt.id,
                                        e.target.value
                                    )}
                                className="w-full text-xl font-bold bg-transparent border-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-3 py-1 outline-none"
                            />


                            <button
                                onClick={() => deleteOption(opt.id)}
                                className="text-red-500 hover:bg-red-100 p-2 rounded-xl ml-2"
                            >
                                ✕
                            </button>

                        </div>


                        <div className="space-y-3">

                            {criteria.map(c => (

                                <div key={c.id}

                                    className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">

                                    <span className="font-medium text-gray-700 min-w-[120px]">
                                        {c.name}
                                    </span>


                                    <input
                                        type="number"
                                        value={opt.values[c.id] || ''}
                                        onChange={(e) =>
                                            updateOptionValue(
                                                opt.id,
                                                c.id,
                                                e.target.value
                                            )}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}