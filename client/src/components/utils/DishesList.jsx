import { createContext } from "react";
const DishesList = createContext({
    dishes:[],
    setDishes:()=>{}
});
export default DishesList