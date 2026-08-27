export const resizeTextArea=(e)=>{
    const textarea = e.currentTarget;
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
}