import { useMemo, useState } from "react";
import CriteriaPanel from "../components/CriteriaPanel";
import OptionsPanel from "../components/OptionsPanel";
import ResultsPanel from "../components/ResultsPanel";
import type { Criterion, Option } from "../types/decision";
import { calculateScores, rankOptions } from "../utils/decisionMath";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {

  const defaultCriteria: Criterion[] = [
    { id: "c1", name: "Budget", weight: 0.3, type: "cost", enabled: true },
    { id: "c2", name: "Weather", weight: 0.3, type: "benefit", enabled: true },
    { id: "c3", name: "Safety", weight: 0.4, type: "benefit", enabled: true },
  ];

  const defaultOptions: Option[] = [
    {
      id: "o1",
      name: "Paris",
      values: { c1: 1500, c2: 8, c3: 7 },
    },
    {
      id: "o2",
      name: "Tokyo",
      values: { c1: 2000, c2: 9, c3: 9 },
    },
  ];

  const [criteria, setCriteria] = useState<Criterion[]>(defaultCriteria);
  const [options, setOptions] = useState<Option[]>(defaultOptions);

  /* ===============================
     CLEAR ALL
  =============================== */

  const clearAll = () => {
    const confirm = window.confirm(
      "Are you sure you want to clear all criteria and options?"
    );

    if (!confirm) return;

    setCriteria([]);
    setOptions([]);

    toast.success("All data cleared.");
  };

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      {
        id: `c${Date.now()}`,
        name: "New Criterion",
        weight: 0,
        type: "benefit",
        enabled: true,
      },
    ]);
  };

  const addOption = () => {
    const id = `o${Date.now()}`;
    const values: Record<string, number> = {};

    criteria.forEach((c) => (values[c.id] = 0));

    setOptions([
      ...options,
      {
        id,
        name: "New Option",
        values,
      },
    ]);
  };

  const normalizedCriteria = useMemo(() => {
    const enabled = criteria.filter((c) => c.enabled);

    const total = enabled.reduce(
      (sum, c) => sum + Number(c.weight || 0),
      0
    );

    if (total === 0) {
      return enabled.map((c) => ({
        ...c,
        weight: 0,
      }));
    }

    return enabled.map((c) => ({
      ...c,
      weight: Number(c.weight) / total,
    }));
  }, [criteria]);

  const rankedOptions = useMemo(() => {
    return rankOptions(
      calculateScores(options, normalizedCriteria)
    );
  }, [options, normalizedCriteria]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER WITH CLEAR BUTTON */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Decision Matrix
          </h1>

          <button
            onClick={clearAll}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow transition"
          >
            Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <CriteriaPanel
            criteria={criteria}
            addCriterion={addCriterion}
            updateCriterion={(id, field, value) =>
              setCriteria(
                criteria.map((c) =>
                  c.id === id ? { ...c, [field]: value } : c
                )
              )
            }
            deleteCriterion={(id) =>
              setCriteria(criteria.filter((c) => c.id !== id))
            }
          />

          <OptionsPanel
            options={options}
            criteria={criteria}
            addOption={addOption}
            updateOptionName={(id, name) => {
              const normalized = name.trim().toLowerCase();

              const alreadyExists = options.some(
                (o) =>
                  o.id !== id &&
                  o.name.trim().toLowerCase() === normalized
              );

              if (alreadyExists) {
                toast.error("Option name must be unique.");
                return;
              }

              setOptions(
                options.map((o) =>
                  o.id === id ? { ...o, name } : o
                )
              );
            }}
            updateOptionValue={(optionId, criterionId, value) =>
              setOptions(
                options.map((opt) =>
                  opt.id === optionId
                    ? {
                        ...opt,
                        values: {
                          ...opt.values,
                          [criterionId]: Number(value),
                        },
                      }
                    : opt
                )
              )
            }
            deleteOption={(id) =>
              setOptions(options.filter((o) => o.id !== id))
            }
          />
        </div>

        <ResultsPanel rankedOptions={rankedOptions} />
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}