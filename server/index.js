require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cloudinary = require("./utils/cloudinaryConfig");

const dishModel = require("./models/dishModel");
app.use(cors());
app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

app.post("/api/recipe" ,async(req,res)=>{
    try{
        let dish = req.body;
        console.log(dish);
        const url = await cloudinaryUploadData(dish.dishUploader);
        if(url)
            dish.dishUploader = url;
        const resData = await new dishModel(dish).save();
        if(resData)
            return res.status(200).json({success: true, resData});
        else 
            return res.status(400).json({error: true, message:"Failed to save the data"});
    } catch (error){
        if(error)
            return res.status(500).json({error: true, message:error.message});
    }
});

app.post("/api/recipeData" ,async(req,res)=>{
    const dishName = req.body.dish
    try{
        const dish = await dishModel.findOne({dishName});
        if(dish)
            return res.status(200).json({success: true, dish});
        else 
            return res.status(400).json({error: true, message:"Failed to fetch the data"});
    } catch (error){
        if(error)
            return res.status(500).json({error: true, message:error.message});
    }
});

app.get("/api/getList", async(req,res)=>{
    try{
        const dishes = await dishModel.find({}, "dishName")
        if(dishes)
            return res.status(200).json({success: true, dishes})
        else 
            return res.status(404).json({success: false, message: "No dish found"})
    } catch (error){
        return res.status(500).json({error: true, message: "Server Internal Error occurred"})
    }
});

app.get("/api/get", async(req,res)=>{
    try{
        const dishes = await dishModel.find()
        if(dishes)
            return res.status(200).json({success: true, dishes})
        else 
            return res.status(404).json({success: false, message: "No dish found"})
    } catch (error){
        return res.status(500).json({error: true, message: "Server Internal Error occurred"})
    }
});

app.patch('/api/editRecipe', async (req, res) => {
    try {
        const { name } = req.body.dishName;
        const updatedDish = await dishModel.findOneAndUpdate(name,
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedDish) {
            return res.status(404).json({
                message: "Dish not found"
            });
        }
        res.status(200).json(updatedDish);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

const cloudinaryUploadData=async (image)=>{
    try {
        console.log(image);

        const uploadedImage =
            await cloudinary.uploader.upload(
                image,
                {
                    folder: "mern_uploads",
                }
            );

        console.log(uploadedImage);

        return uploadedImage.secure_url;

    } catch (err) {
        return null
    }
}
mongoose.connect(process.env.MONGO_URI);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});