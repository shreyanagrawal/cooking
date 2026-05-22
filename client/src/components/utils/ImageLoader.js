

export const getImage=(src)=>{
    if(src.startsWith("https") || src.startsWith("http"))
        return src
    else {
        if (src.startsWith("iVBORw0K")) 
            return "data:image/png;base64,"+src;
        if (src.startsWith("/9j/")) 
            return "data:image/jpeg;base64,"+src;
        if (src.startsWith("R0lGOD")) 
            return "data:image/gif;base64,"+src;
        if (src.startsWith("UklGR")) 
            return "data:image/webp;base64,"+src;
    }
}  
