## ## BUILD PROCESS ## ##

[Workspace](https://excalidraw.com/#json=g3HL3d8m0vNKcNY8iKixW,nTMMmolTANQbqA66XVi8gQ)

## 1. Initial Approach

- At first, I interpreted the goal as building a comparison tool.
- After understanding the requirements, I realized this is not about feature count — the building process and thinking matter more.

---

## 2. Stack Selection

Initially, I planned to build a mobile application.  
But since the system should be easily accessible to any user, I decided to build a website.

- React  
- TypeScript (to avoid runtime errors)

---

## 3. First Design Thinking

### DAY 1:

I read through the document and wondered: what is a decision?

I thought about a scenario of buying a laptop to decide how to model this system.  
If I’m buying a laptop, I would consider specs like RAM, battery, etc., and prioritize them based on my needs.

So the normal human thought process would be:
- Set priorities for needs  
- Compare options based on those priorities  
- Get the best option  

I already had some idea about the Weighted Sum Method and also read about Integer Linear Programming.

#### First Idea:
- Hardcoded criteria like Budget, Specs, etc.

Rejected because:
- Violates dynamic requirement

#### Second Idea:
- Use AI for decision making

Rejected because:
- Black-box approach  
- Violates core expectation (no transparency)

#### Third Idea:
- Use Integer Linear Programming

Rejected because:
- It requires optimization under constraints, not prioritization of criteria

---

### DAY 2:

I read an article on Multi-Criteria Decision Making (MCDM) methods and understood there are various methods like:
- AHP  
- Integral Linear Programming  
- Weighted Sum Method  

The documentation was confusing, so I looked into other explanations (used AI to understand the models).

Later, I chose the Weighted Sum Method because:
- It is simple  
- Transparent  
- Strong for single-dimensional scoring problems  

I decided to break down the ambiguity of the problem into smaller parts and solve them one by one.

#### Final Decision:
- Implement a weighted multi-criteria decision model  
- Fully transparent  
- No hardcoding  

---

### DAY 3:

Started building the system design and architecture.

Based on previous project experience, I decided to go with a modular approach by separating:
- Criteria
- Options
- Scoring logic  

At first, I just looked at the requirements and started building without considering edge cases.

I built a simple C code to understand the logic I read online, then started building the system in React.

---

### DAY 4:

Created the React project scaffold using Vite and chose TypeScript for type safety and to avoid runtime errors.

Started building the system design and architecture.

I wanted to make sure the system is built for a user, not a developer.

---

### DAY 5:

Built the Criteria Panel first and then thought about various scenarios and edge cases.

### #1 Weight Normalization Issue

In the early stages, I believed all criteria weights should strictly sum to 1.  
Most weighted decision models are presented in normalized form (sum = 1).

Reasons:
- Each weight represents a fixed percentage of total importance  
- Final score remains bounded between 0 and 1  
- Large weights like 50, 70, 30 would drastically change raw score magnitude  

Later, I realized only the relative proportions matter.

Example:
- 3, 3, 4  
- 0.3, 0.3, 0.4  

Both produce identical rankings.

Instead of forcing users to manually adjust weights to sum to 1, I allowed them to enter any values and normalized internally.

---

### #2 Invalid Input Issues

- Zero weights  
- Negative weights  
- Disabled criteria  

---

### #3 Cost vs Benefit Issue

Initially, I treated all criteria as “higher value is better.”

This worked for:
- Safety score  
- Weather rating  

But not for:
- Price  

If all criteria use the same normalization formula, price values will dominate the final score.

I looked for other scaling strategies and found Min-Max Normalization suitable.

Min-max normalization:
- Benefit: (value − min) / (max − min)  
- Cost: (max − value) / (max − min)  

Design improvement:

I introduced a type for each criterion:

- Benefit (higher is better)
- Cost (lower is better)

Instead of blocking the user for mistakes, I decided to show warning messages and proceed with calculation.

---

### DAY 6:

Started building the Options Panel and considered various scenarios and edge cases.

### #1 Identical Name Issue

Encountered this while building the Options Panel.  
Later applied the same validation for the Criteria Panel.

---

### DAY 7:

Started building the Results Panel and fixed the identical name issue in both Criteria and Options panels.

Issues found:

### #1 Identical Values for Options

If two options have the same values for all criteria, the system gives the same score, resulting in a tie.

Solution:
- Show a warning message to the user.

### #2 Criteria Dominance Issue

If a user gives:
- Price weight = 90  
- Battery weight = 10  

Then price dominates the final score.  
It feels like the user already decided before using the system.

This is not a model issue but a user input issue.

Solution:
- Show a warning message and proceed.

---

### DAY 8:

System was working but felt like just a calculator.

New idea:
Allow users to evaluate the impact of each criterion.

Instead of deleting a criterion (lazy design),  
I added a toggle switch to enable/disable criteria.

This allows users to:
- See the impact of each criterion  
- Try different combinations  
- Understand decision sensitivity  

Used AI to build the toggle switch button.

---

### DAY 9:

In the normalization function, I used Math.max and Math.min.

Problem:
- Division by zero if all values are the same.

Solution:
- Added a check to prevent division by zero.

Additional improvements:
- Added an info button explaining benefit vs cost
- Added a clear button to reset the system
- Added example values for criteria and options

---

## 4. Architectural Changes

- v1: Straight calculator with raw data  
- v2: Added validation and edge case handling  
- v3: Added toggle to enable/disable criteria  
- v4: Normalized weights internally instead of forcing users  

---

## 5. Refactoring

### v1:
- Scoring logic embedded inside UI component  
- Toggle added  
- Root page started as App.tsx  
- Later introduced HomePage.tsx for readability  

Issue:
- Logic tightly coupled with UI  
- Hard to read and maintain  

Solution:
- Moved scoring logic to a utility file  

---

## 6. Mistakes and Corrections

- Initially embedded state inside components, later moved state to root  
- Early version did not properly separate cost vs benefit  
- Forgot to normalize weights  
- Did not handle edge cases like:
  - Duplicate criteria  
  - Zero weights  
  - Negative weights  
  - Dominance  
- Unhandled division by zero in normalization  

---

## 7. Trade-offs

Chose simplicity over:

- Advanced optimization algorithms  
- Machine learning models  
- Constraint solvers  

---

## 8. What Changed During Development

Initially, the goal was to produce rankings.

Later, I realized correctness in decision modeling is more important than just output.

That led to:

- Implementing normalization  
- Introducing cost vs benefit distinction  
- Studying dominance effects  

Focused on User Experience:

- Automatic weight normalization  
- Dynamic criteria  
- Score breakdown instead of only final result  
- Validation messages  
- Toast warnings

Most improvements did not come from adding features, but from identifying limitations during testing and reshaping the structure.