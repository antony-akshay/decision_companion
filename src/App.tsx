import { useMemo, useState } from "react";
import CriteriaPanel from "./components/CriteriaPanel"
import type { Criterion, Option } from "./types/decision";
import { Toaster } from "react-hot-toast";
import OptionsPanel from "./components/OptionsPanel";
import ResultsPanel from "./components/ResultsPanel";
import { calculateScores, rankOptions } from "./utils/decisionMath";

function App() {

  const [criteria, setCriteria] =
    useState<Criterion[]>([
      { id: "c1", name: "Budget", weight: 0.3, type: "cost" },
      { id: "c2", name: "Weather", weight: 0.3, type: "benefit" },
      { id: "c3", name: "Safety", weight: 0.4, type: "benefit" }
    ]);

  const addCriterion = () => {

    setCriteria([
      ...criteria,
      {
        id: `c${Date.now()}`,
        name: "New Criterion",
        weight: 0,
        type: "benefit"
      }
    ]);

  };

  const [options, setOptions] =
    useState<Option[]>([
      {
        id: "o1", name: "Paris",
        values: { c1: 1500, c2: 8, c3: 7 }
      },
      {
        id: "o2", name: "Tokyo",
        values: { c1: 2000, c2: 9, c3: 9 }
      }
    ]);

  const addOption = () => {

    const id = `o${Date.now()}`;

    const values: Record<string, number> = {};

    criteria.forEach(c =>
      values[c.id] = 0
    );

    setOptions([
      ...options,
      {
        id,
        name: "New Option",
        values
      }
    ]);

  };

  const normalizedCriteria = useMemo(() => {

    const total =
      criteria.reduce(
        (s, c) => s + Number(c.weight || 0),
        0
      );

    if (total === 0) {
      return criteria.map(c => ({
        ...c,
        weight: 0
      }));
    }

    return criteria.map(c => ({
      ...c,
      weight: Number(c.weight) / total
    }));

  }, [criteria]);

  console.log(normalizedCriteria);

  const rankedOptions =
    useMemo(() => {

      return rankOptions(
        calculateScores(
          options,
          normalizedCriteria
        )
      );

    }, [options, normalizedCriteria]);

    console.log(rankedOptions)

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* PANELS */}

        <div className="grid lg:grid-cols-2 gap-8">

          <CriteriaPanel
            criteria={criteria}
            addCriterion={addCriterion}

            updateCriterion={(id, f, v) =>
              setCriteria(
                criteria.map(c =>
                  c.id === id ?
                    { ...c, [f]: v } : c
                )
              )
            }

            deleteCriterion={(id) =>
              setCriteria(
                criteria.filter(
                  c => c.id !== id
                )
              )
            }

          />

          <OptionsPanel

            options={options}
            criteria={criteria}

            addOption={addOption}

            updateOptionName={(id, name) =>
              setOptions(
                options.map(o =>
                  o.id === id ?
                    { ...o, name } : o
                )
              )
            }

            updateOptionValue={(o, c, v) =>
              setOptions(
                options.map(opt =>
                  opt.id === o ?
                    {
                      ...opt,
                      values: {
                        ...opt.values,
                        [c]: Number(v)
                      }
                    } : opt
                )
              )
            }

            deleteOption={(id) =>
              setOptions(
                options.filter(
                  o => o.id !== id
                )
              )
            }

          />



        </div>
        <ResultsPanel
          rankedOptions={rankedOptions}

        />

      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  )
}

export default App
