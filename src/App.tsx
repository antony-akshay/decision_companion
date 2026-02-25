import { useState } from "react";
import CriteriaPanel from "./components/CriteriaPanel"
import type { Criterion } from "./types/decision";

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

        </div>


      </div>

    </div>
  )
}

export default App
