import { type ScoredOption } from "../types/decision";

interface Props {
    rankedOptions: ScoredOption[];
}

export default function ResultsPanel({
    rankedOptions,
}: Props) {

    const topOption = rankedOptions[0];

    return (

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Ranked Results
            </h2>


            <table className="w-full bg-white rounded-xl border border-gray-200">

                <thead>

                    <tr className="bg-gray-50">

                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                            Rank
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                            Option
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">
                            Score
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {rankedOptions.map((opt, index) => (

                        <tr key={opt.id}

                            className={`hover:bg-gray-50 ${index === 0 ?
                                'bg-emerald-50 border-l-4 border-emerald-400' : ''
                                }`}>

                            <td className="px-6 py-4 font-bold">
                                {index + 1}
                            </td>

                            <td className="px-6 py-4 font-semibold">
                                {opt.name}
                            </td>

                            <td className="px-6 py-4 text-right">

                                <span className={`px-3 py-1 rounded-full font-bold text-sm ${index === 0 ?
                                    'bg-emerald-100 text-emerald-800' :
                                    'bg-blue-100 text-blue-800'
                                    }`}>

                                    {opt.score.toFixed(4)}

                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


            {rankedOptions.length !== 0 && topOption ? (() => {

                return (
                    <div className="mt-8 border-t pt-6 space-y-3">

                        <h3 className="text-lg font-bold">
                            Winner: {topOption.name}
                        </h3>

                        <p className="text-gray-700">
                            {topOption.name} achieved the highest overall score of{" "}
                            <span className="font-bold">
                                {topOption.score.toFixed(4)}
                            </span>.
                        </p>

                    </div>
                );

            })() : (
                <div className="mt-8 pt-6">
                    <h3 className="text-lg font-bold">
                        No options to evaluate
                    </h3>
                </div>
            )}

        </div>

    );

}