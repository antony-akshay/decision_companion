# Decision Companion System

## WORKSPACE

    [Workspace](https://excalidraw.com/#json=g3HL3d8m0vNKcNY8iKixW,nTMMmolTANQbqA66XVi8gQ)

## Live Demo

    [click here](https://decision-companion-olvc68mqv-akshays-projects-a0cbf75f.vercel.app/)

## 1. Problem Understanding

The goal of this project is to design and build a Decision Companion System that assists users in making structured, rational decisions.

This system is not a static comparison tool. It dynamically accepts:

- Multiple options from the user
- Multiple user-defined criteria
- Weights for each criterion
- Criterion type (Benefit or Cost)

The system evaluates options using a transparent weighted multi-criteria decision model and produces ranked recommendations.

Most real-world decisions are not binary. They involve balancing cost, benefits, trade-offs, and personal priorities.

This system is fully explainable and does not rely on AI scoring.

user needs a decision making system that can help him make a decision based on his preferences and priorities.

---

## 2. Assumptions

- Users can quantify criteria numerically.
- Users understand relative importance through weights.
- Weights may or may not sum to 1 (the system normalizes internally).
- Each criterion applies to all options.
- All decisions are static snapshots (no real-time API data).
- Criteria values may exist on different numeric scales.
- Users should have full control over importance — even if that leads to dominance of one criterion.

---

## 3. Design Approach

The system is designed to be easy for users to understand and use.  
Dynamic criteria and option inputs allow users to make decisions based on their own priorities and preferences.

I used the Weighted Linear Combination (WLC) method to solve the problem.

Final Score = Σ (Normalized Value × Weight)

I chose Weighted Sum over:

- Linear Programming
- Constraint Optimization
- Pure AI-based ranking

Because:

- The problem is preference-based, not constraint-optimization-based.
- Users want prioritization, not feasibility solving.
- Weighted Sum is fully explainable and transparent.

This method aligns with the requirement that the logic should not be a black box.

---

## 4. Why I Structured the Solution This Way

A meaningful decision should have the following features:

- Defining what matters (needs)
- Defining what the options are
- Choosing the best option based on those needs

So I structured the system around these stages.

I designed the system to make criteria the primary driver of decisions because in real life, people don’t start with numbers — they start with priorities.

### Weighted Sum Instead of Complex Models

I considered more advanced models but intentionally chose simplicity.  
The goal is not to find an objectively optimal solution.

The goal is to provide a clear, explainable structure that helps users think through their priorities.

### Explicit Cost vs Benefit Modeling

Instead of assuming “higher is better,” each criterion explicitly declares its type (Benefit or Cost).  
This makes the model honest about what the user is optimizing.

### Extensibility

I structured the system generically so it can be used for different types of decision-making problems while remaining easy to understand and use.

I added an example of how to use to use the system by making a default decision calculation for travel planning so that the user can understand how to use the system.since it is like a form filling process, it is not intuitive to understand how to use it.

---

## 5. System Architecture

[data flow diagram](https://github.com/antony-akshay/decision_companion/blob/main/data_flow_diagram.png)

High-Level Flow:

User Input  
    ↓  
Criteria Definition  
    ↓  
Option Definition  
    ↓  
Normalization Engine  
    ↓  
Weighted Scoring Engine  
    ↓  
Ranking Engine  

The scoring engine is isolated in a pure utility module to maintain separation of concerns.

---

## 6. Key Design Decisions

### 1. Dynamic Criteria

Criteria are not hardcoded. Users can define:

- Name
- Weight
- Type (Benefit/Cost)

### 2. Cost vs Benefit Handling

Benefit normalization:
(value - min) / (max - min)

Cost normalization:
(max - value) / (max - min)

### 3. Explainability

The system:

- Shows weighted contributions
- Shows final aggregated score

### 4. Modularity

- UI separated from scoring logic
- Scoring engine implemented as pure functions
- Easy to extend to backend

### 5. Trade-offs

- Assumes criteria are independent and additive.
- Tie-breaking is not deeply handled.
- An option with unacceptable values (e.g., too expensive) may still rank higher if heavily weighted.
- Slight computational overhead due to normalization and validation.

---

## 7. Edge Cases Considered

- Weights not summing to 1
- Zero weights
- Identical final scores
- Large numeric ranges
- Negative values
- Missing input validation
- Identical values for options
- Identical weights for criteria
- Identical names for criteria
- Identical names for options
- Division by zero in normalization
- Dominance issue when one criteria has a very high weight

---

## 8. How to Run

Local development:

1. Clone the repository
2. Run:
   npm install
   npm start
3. Open:
   http://localhost:5173

---

## 9. Improvements With More Time

- Sensitivity analysis (weight variation simulation)
- Better visualizations (charts and graphs for clearer understanding)
- Authentication and decision history storage
- Learning from user inputs over time
- Better handling of equal-preference scenarios for criteria
- More explainability and transparency
- Instead of only showing final scores and contributions, optionally use AI to generate a summary explanation of the decision process for better user understanding
- the current model is focused on one domain and what if a scenario like "i need to buy a car, a house and a phone at the same time" then various dimensions will be considered.i will try to build a system that can handle such scenarios.

- i will make the system such that user just have to prompt like "i need to make a decision on this subject" and i have now build a system where the user has some options(found by him) available in front of him and sets his priority or needs to evaluate which options suits his need.if i had more time the system will be build such that the user can give a prompt like "i need a laptop for video editing and a price range" and the system sets the criterias which ensures that the user does not leave any criterias behind and options will be filled accordingly by the system (data needed like options and criteria will be outsourced) the data obatined is then evaluated by our algorithm/system to rank the options/decisons

