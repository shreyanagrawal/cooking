import "../assets/styles/dish.css";
import { useNavigate, useParams } from "react-router";
import React, { useContext, useState } from "react";
import useSpeech from "./hooks/useSpeech";
import DishesList from "./utils/DishesList.jsx";

const Dish = () => {
    const {dishes,setDishes} = useContext(DishesList);
    const { name } = useParams();
    const { speak, pause, resume } = useSpeech();
    const [player, setPlayer] = useState({
        status: "idle",
        section: null,
        progress: 0,
    });
    const navigate = useNavigate();
    const handlePlay = (title, content) => {
        const section = title.toLowerCase();
        if (player.section !== section) {
                speak(title, content, {
                    onComplete: () => {
                        setPlayer({ status: "idle", section: null, progress: 0 });
                    },
                    onProgress: (current, total) => {
                        setPlayer(prev => ({...prev, progress: (current / total) * 100}));
                },
            });
            setPlayer({ status: "playing", section, progress: 0 });
            return;
        }
        if (player.status === "playing") {
            pause();
            setPlayer(prev => ({ ...prev, status: "paused" }));
        } else {
            resume();
        setPlayer(prev => ({ ...prev, status: "playing" }));
        }
    };
    const getIcon = (section) => {
        if (player.section !== section) return <i className="fas fa-play"></i>;
        return player.status === "playing" ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>;
    };
    return (
        <div className="dish row">
            <i className="fa fa-arrow-left cursor-pointer" onClick={()=>navigate("/")}></i>
            {dishes.map((dish) => dish.dishName === name ? (
                <div key={dish.name}>
                    <h2 className="dish-name">{dish.dishName}</h2>
                    <div className="dish-box row d-flex" style={{borderRadius: "30px", alignItems: "center"}}>
                        <div className="col-md-6 col-sm-12 image-container">
                            <img src={dish.dishUploader} alt={dish.dishName} />
                        </div>
                        <div className="col-md-6 preparation-conatiner" style={{paddingLeft: "40px"}}>
                            <h3 className="ingredients-head">Ingredients</h3>
                            <ul>
                                {dish.ingredients.split(";").map((i, idx) => (<li key={idx}>{i}</li>))}
                            </ul>
                            <div className="native-player">
                                <button className="play-btn" onClick={() => handlePlay("Ingredients", dish.ingredients)}>{getIcon("ingredients")}</button>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: player.section === "ingredients" ? `${player.progress}%` : "0%"}}></div>
                                </div>
                            </div>
                            <h3 className="method-head">Method</h3>
                            <ul>
                                {dish.method.split(";").map((m, idx) => ( <li key={idx}>{m}</li>))}
                            </ul>
                            <div className="native-player" style={{marginBottom: 0}}>
                                <button className="play-btn" onClick={() => handlePlay("Method", dish.method)}>{getIcon("method")}</button>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: player.section === "method" ? `${player.progress}%` : "0%"}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        ) : null
      )}
    </div>
  );
};
export default Dish;