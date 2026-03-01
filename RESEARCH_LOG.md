##  RESEARCH LOG ##

## 1. Initial research

    - went through various decision making models
    - came across integral linear programming,Analytic Hierarchy Process(AHP)
    - went through a literature survey at first : 
        "https://apps.dtic.mil/sti/pdfs/ADA630702.pdf"
        "https://creately.com/guides/rational-decision-making-model/"
        "https://d1wqtxts1xzle7.cloudfront.net/55281596/ajis-1-1-5-libre.pdf?1513181377=&response-content-disposition=inline%3B+filename%3DA_Survey_on_Multi_Criteria_Decision_Maki.pdf&Expires=1772393843&Signature=LQuh~gWpnBFCJqf93CSYwhjaPxvNzb5Fupzlwwm4v254goX8DQyAypIMbi1NwFMcKFQaIiyAhLC-I0txnX3baO44x0yzOJ8sZ0VeEXYXIWfoizhzcPlqoYNqP3lGDuGdrYFh9zGkjnXF8RDeimmwY7bliDAijTSHYiJPFv-aIqLjlkp7vtp2Gc6g0DBDiYgl4p9Tiev68cZ6mjRVRg23fX38MuE~zQdSMF61etJiMGfjDLJt42-Mg~kwBamLJOmrZDbGTX78eqJ96VNNZsBzVJ3p6lYR-NTyxrZZ4vWpwsEYwE83YoBjxvJuNz3okrOiRKrBvwt1xkEzLcP6pJ6Y0w__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA"


## 2. Search queries

    - decision making approaches/algorithms #literature survey
    - integral linear programming
    - react host toast doc
    - data normalization methods:
        - min-max normalization:"https://www.geeksforgeeks.org/machine-learning/data-normalization-in-data-mining/"
    - constraint optimization in linear programming
    - react vite commands
    - install tailwind css in react vite

## 3. AI tools used:
    - ChatGPT
    - perplexity

## 4. Prompts Used

    - In which cases do we use integral linear programming

    - what is meant by constraint optimization in linear programming

    - decision making algorithms

    - Duplicate Option names and Criteria names
        accepted:Non-blocking Warning
        rejected:Blocking Error(because the system logic works fine)
    
    - what if one criteria has bigger value than the others will there be any need for calculating the score

    - what if one criteria is only given a big value doesn't it dominate above the other criterias or what if the user only give input to only one critria leaving the others to be 0 also the same condition right? can we give some rate limit to ensure that the user is not making a false input decision

    -what if the budget of one place is free (0) and other is some value ,should the system choose the free one?how can we categorise criteria like on a trip we try to minimise budget and quality will be choosen as high factor.so how to categorise the critieria values into good and bad

    -all the criteria weight sums up to 1 , so we dont want the user to perform calculation each time he add a new value so i have to normalize the criteria value,can we use min max normalization here

    - used ai to add some tailwind css to the code for the ui

    - is human emotion a factor considered in decision making algorithms?

    -export interface Criterion {
        id: string;
        name: string;
        weight: number;
        type: "benefit" | "cost";
        enabled: boolean;
     }

    export interface Option {
        id: string;
        name: string;
        values: Record<string, number>;
    },

    - can you build a  reusable normalisation function that takes options and criterias as input and perform normalisation on the criterion based on the type as benefit or cost and return the normalised value.use min max algo for this.use (value - min) / (max - min) for benefit and (max - value) / (max - min) for cost.

    - <button                                 
        onClick={() =>updateCriterion(
        criterion.id,"enabled",
        !criterion.enabled
        )}                                 
        className={`ml-2 px-4 py-1 rounded-lg text-white font-semibold transition${criterion.enabled? "bg-green-500 hover:bg-green-600": "bg-red-500 hover:bg-red-600"}`}>
        {criterion.enabled ? "ON" : "OFF"}
      </button> 

    convert this into switch toggle button

## 5.What I Accepted From AI

    - Normalization formula
    - Cost vs benefit logic
    - after reviewing other methods i chose weighted sum approach becuase it is simple and effective
    - code after applying tailwind css
    - solution for criteria dominance issue
    - solution for duplicate option names and criteria names
    - added toogling of criteria which allowed the user to determine the importance of each criteria
    - added validation messages for various scenarios
    - added validation toasts and warnings
    - switch toggle criteria feature
    - test cases for the system


## 6.What I Rejected From AI

    - AI based scoring
    - overcomplicated mathematical models
    - Linear programming approach (not suitable for preference ranking)
    - Hardcoded restrictions
    - decimal scaling and z-score normalization logic(too complicated)
