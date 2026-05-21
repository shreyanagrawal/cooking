import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import axios from "axios";
import Preloader from './utils/Preloader.jsx';
import { useNavigate } from 'react-router';
import imageCompression from "browser-image-compression"
import ("../assets/styles/addrecipe.css")
import {getImage} from './utils/ImageLoader'; 
const API_URL = import.meta.env.VITE_API_URL;
const AddRecipe = () => {
    const [dish,setDish] = useState(null);
    const [edit,setEdit] = useState(false);
    const [image, setImage] = useState("");
    const [dishList,setDishList]=useState();
    const [loading, setLoading] = useState(false);
    const [dishName,setDishName] = useState("");
    const navigate = useNavigate("/");
    const {register, handleSubmit, reset, formState:{errors}, setValue} = useForm();
    const submitData = async(data)=> {
        try{
            setLoading(true);
            if(edit){
                const finalData = {...data, dishUploader: image, ingredients:data.ingredients.replaceAll("\n",";"),method:data.method.replaceAll("\n",";"),tags:data.tags.replaceAll("\n",";")};
                const resData = await axios.patch(`${API_URL}api/editRecipe`,finalData);
                if(resData.status === 200){
                    reset();
                    setImage("");
                    setDishName("");
                    setEdit(false);
                }
                else 
                    window.alert("Failed to save the data");
            } else {
                const finalData = {...data, dishUploader: image};
                const resData = await axios.post(`${API_URL}api/recipe`,finalData);
                if(resData.status === 200){
                    reset();
                    setImage("");
                    setDishName("");
                }
                else 
                    window.alert("Failed to save the data");
            }
        } catch (error) {
            window.alert("Failed to save the data")
        } finally {
            setLoading(false);
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = reject;
        });
    };


    const uploadImage =async (e) => {
        const file= e.target.files[0];
        if(!file)
            return;
        
        try{
            const base64 = await convertToBase64(file);
            setImage(base64);
            
        } catch (error){
            window.error("Some error has occurred")
        }
    }
    const fetchData = async (e)=>{
        try{
            setLoading(true);
            setDishName(e.target.value);
            const resData = await axios.post(`${API_URL}api/recipeData`,{dish:e.target.options[e.target.selectedIndex].text});
            if(resData.status === 200){
                const dishData = resData.data.dish;
                setValue("dishName", dishData.dishName);
                setValue("ingredients", dishData.ingredients.replaceAll(';', '\n'));
                setValue("method", dishData.method.replaceAll(';', '\n'));
                setValue("tags", dishData.tags.replaceAll(';', '\n'));
                setValue("dishUploader", dishData.dishUploader);
                setImage(getImage(dishData.dishUploader));
                setDish(dishData);
            } else {
                setImage("");
                reset();
            } 
        }catch (error){
            window.alert("Unable to fetch the data");
            reset();
        } finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        getDishList();
    },[])    
    const getDishList = async()=>{
        try{
            const dishList = await axios.get(`${API_URL}api/getList`)
            if(dishList.status=== 200)
                setDishList(dishList.data.dishes);
        } catch (err){
            window.alert("Unable to fetch the data");
        }  
    }       
    useEffect(()=>{
        if(!edit){
            setDish(null);
            setImage(null);
            setDishName("")
        } else 
            getDishList();
        reset();
    },[edit]);
    
    return (
        <> 
            <i className="fa fa-arrow-left cursor-pointer" onClick={()=>navigate("/")}></i>
            {loading ? <Preloader /> :
                <div>
                    <h2 style={{textAlign: "center", textDecoration: "underline"}}>{edit ? "Edit Recipe" : "Add New Recipe"}</h2>
                    <form onSubmit={handleSubmit(submitData)}>
                        <div className="select-container">
                            <i className="fa fa-pencil" onClick={()=>setEdit(!edit)} style={{"marginRight":"10px", "cursor": "pointer"}}></i>
                            <select name="dishes" className="select-dish" onChange={(e)=>fetchData(e)} disabled={!edit} value={dishName}>
                                <option value="" disabled selected>Select Dish</option>
                                {dishList && dishList.map((dish)=>(
                                    <option key={crypto.randomUUID()}value={dish.dishName.toLowerCase().replaceAll(' ','-')} >{dish.dishName}</option> 
                                ))}
                            </select>
                        </div>
                        <div className="d-flex flex-wrap">
                            <div className="d-flex cooking-form">
                                <div className="imageUplaoder">
                                    <input type="file" name="dishUploader" className="dishUploader"  style={{"border":"0px solid"}}{...register("dishUploader",{
                                        validate: (value) => {
                                            if (image) return true;
                                            return value.length > 0 || "Please upload an image";
                                        },
                                        onChange: uploadImage
                                    })}/>
                                    {errors.dishUploader && <span className="error">{errors.dishUploader.message}</span>}
                                </div>
                                <div className="d-flex">
                                    <input type="text" name="dishName" className="input-form" placeholder="Enter Dish name" disabled = {edit} {...register("dishName",{
                                        required: "Please provide the valid dish name",
                                    })}/>
                                    {errors.dishName && <span className="error">{errors.dishName.message}</span>}
                                    <textarea name="ingredients" className="textArea-form" style={{"height": "100%"}} placeholder="Enter ingredients here, separate them by semi-colon" {...register("ingredients",{
                                        required: "Please enter the ingredients"
                                    })}></textarea>
                                    {errors.ingredients && <span className="error">{errors.ingredients.message}</span>}
                                    <textarea name="method" className="textArea-form" style={{"height": "100%"}} placeholder="Enter steps here, separate them by semi-colon" {...register("method",{
                                        required: "Please enter the method"
                                    })}></textarea>
                                    {errors.method && <span className="error">{errors.method.message}</span>}
                                    <textarea name="tags" className="textArea-form" style={{"height": "100%"}} placeholder="Enter categories here, separate them by semi-colon" {...register("tags",{
                                        required: "Please enter the categories of this food"
                                    })}></textarea>
                                    {errors.tags && <span className="error">{errors.tags.message}</span>}
                                </div>
                            </div>
                            <div className="iamgeContainer" style={{"maxHeight": "500px"}}>
                                {image && image!== null && <img src={getImage(image)}/>}
                            </div>
                        </div>
                        <div className="submit-button-container" style={{"width": "100%","display":"block"}}>
                            <button type="submit" disabled={loading}>Submit</button>
                        </div>
                    </form>
                </div>
            }
        </>
        
    )
}
export default AddRecipe