import { ThemeContext } from './utils/ThemeContext';
import React, { useContext, useEffect } from 'react'
const ThemeSwitcher = (props) => {
    const {theme,setTheme} = useContext(ThemeContext);
    useEffect(()=>{
        document.querySelector('body').setAttribute('data-theme',theme);    
    },[theme])
    const toggleTheme = () =>{
        document.querySelector('body').removeAttribute('data-theme');
        theme =='dark' ? setTheme (prevTheme=>'light') : setTheme(prevTheme=>'dark')        
    }
  return (
    <>
        <div className="switchTheme" style={{position:"absolute", right: "70px", top: "20px"}}>
            <i className="icons sun fa fa-sun"></i>
            <label className="switch">
            <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
            <span className="slider round"></span>
            </label>
            <i className="icons moon fa fa-moon"></i>
        </div>
        {props.children}
    </>  
  )
}
export default ThemeSwitcher
