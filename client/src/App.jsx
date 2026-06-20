import React, { useEffect, useState } from 'react';
import './App.css'
import { ThemeContext } from './components/utils/ThemeContext';
import Dishes from './components/Dishes';
import Dish from './components/Dish';
import ThemeSwitcher from './components/ThemeSwitcher';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import AddRecipe from './components/AddRecipe';
import DishesList from './components/utils/DishesList';
const API_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';
import Preloader from './components/utils/Preloader';
function App() {
  const [theme,setTheme] = useState('dark');
  const [dishes, setDishes] =useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    fetchDishes();
  },[])
  const fetchDishes = async()=>{
    try{
      const resData = await axios.get(`${API_URL}api/get`);
      if(resData.status === 200){
        setLoading(false);
        setDishes(resData.data.dishes)
      }
    } catch (err){
      setLoading(false);
      window.alert("Some error has occurred")
    }
  }
  return (
    <>
      {loading ?  <Preloader /> :
        <DishesList.Provider value={{dishes,setDishes}}>
          <ThemeContext.Provider value={{theme , setTheme}}>
            <ThemeSwitcher>
              <div className="container">
                <BrowserRouter>
                  <Routes>
                    {dishes && <Route path="/" element={<Dishes />}/>}
                    <Route path="/dish/:name" element={<Dish/>}/>
                    <Route path="/addDish" element={<AddRecipe fetchDishes={fetchDishes}/>}/>
                  </Routes>
                  <Link to={"/addDish"} className="add-dish">
                    <i className="fa-solid fa-utensils"></i>
                  </Link>
                </BrowserRouter>
              </div>
            </ThemeSwitcher>
          </ThemeContext.Provider>
        </DishesList.Provider>
      }
    </>
  )
}
export default App