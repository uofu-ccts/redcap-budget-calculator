import { createContext} from 'react';

// A great overview of Contexts used with Hooks was made by "The Net Ninja" at https://youtu.be/v1s_rbZbqQI
// Another great one is by Boris Yordanov, "Working with the REact Context API" at https://www.toptal.com/react/react-context-api

export const BudgetContext = createContext(42);

export default BudgetContext;