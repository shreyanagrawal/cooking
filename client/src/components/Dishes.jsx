import React, { useContext, useMemo, useState } from 'react'
import DishesList from './utils/DishesList';
import '../assets/styles/style.css';
import { Link } from 'react-router';
import { dishesMap } from './utils/dishes';
const Dishes = () => {
  const {dishes,setDishes} = useContext(DishesList);
  const [filter,setFilter] = useState('all');
  const [showFilter,setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sortedAndFilteredDishes = useMemo(()=>{
    const filtered = dishes.filter(dish => {
      const matchSearch =  dish.dishName.toLowerCase().includes(searchTerm.toLowerCase()) || dish.tags.split(';').some(t => t.trim().toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filter.toLowerCase() === 'all' || dish.tags.split(';').some(t => t.trim().toLowerCase() === filter.toLowerCase());
      return matchSearch && matchesFilter;
    })
    return filtered;
  },[searchTerm,filter])
  const filters = ['All',...new Set(dishes.flatMap(dish=>dish.tags.split(';').map(tag=>tag.trim())))];
  return (
    <div className="container">
      <div className="filter-area">
        <p className="filter d-flex mb-0 justify-content-space-between align-items-center"><span>Filters</span><i className="fa fa-caret-down cursor-pointer" onClick={()=>setShowFilter(!showFilter)}></i></p>
        <div className={`tag-filters ${showFilter ? "show" : "hide"}`}>
          <section className="filters">
            <div className="filter-container d-flex flex-wra">
              {
                filters.map((filter)=>(
                  <span key={`f_${crypto.randomUUID()}`}className="filter-tag cursor-pointer" onClick={()=>setFilter(filter)}>{filter}</span>
                ))
              }
            </div>
          </section>
        </div>
      </div>
      <input type="search" className="search" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search your dish here..."/>
          <div className="recipe-parent d-flex cursor-pointer">
            {sortedAndFilteredDishes.map(dish=>(
                <div key={crypto.randomUUID()} className="recipe-card">
                  <Link  to={`/dish/${dish.dishName}`}>
                    <div className="image-container">
                      <img src={dish.dishUploader}/>
                    </div>
                    <p className="title">{dish.dishName}</p>
                    <p className="tag-container d-flex flex-wrap">{dish.tags.split(';').map((tag)=>(
                      <span key={`t_${crypto.randomUUID()}`}className="tag">{tag}</span>
                    ))}</p>
                  </Link>
                </div>
            ))}
        </div>
    </div>
  )
}
export default Dishes

