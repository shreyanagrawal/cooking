import { useEffect, useRef, useState } from "react";

const useSpeech = () => {
    const synthRef = useRef(window.speechSynthesis);
    const [voice, setVoice] = useState(null);
    const queueRef = useRef([]);
    const indexRef = useRef(0);
    const isPausedRef = useRef(false);
    const isSpeakingRef = useRef(false);
    const onCompleteRef = useRef(null);
    const onProgressRef = useRef(null);
    useEffect(() => {
        const loadVoices = () => {
            const voices = synthRef.current.getVoices();
            const selected =
                voices.find(v => v.name === "Rishi") || voices[0];
            setVoice(selected);
        };
        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
    }, []);
    const playNext = () => {
        if (isPausedRef.current) return;
        const queue = queueRef.current;
        if (indexRef.current >= queue.length) {
            isSpeakingRef.current = false;
            if (onCompleteRef.current) 
                onCompleteRef.current();
            return;
        }
        const currentIndex = indexRef.current;
        const text = queue[currentIndex];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.onend = () => {
            indexRef.current++;
            if (onProgressRef.current) 
                onProgressRef.current(indexRef.current, queue.length);
            setTimeout(playNext, 200);
        };
        synthRef.current.speak(utterance);
    };
    const speak = (title, content, { onComplete, onProgress }) => {
        if (!voice) return;
        onCompleteRef.current = onComplete;
        onProgressRef.current = onProgress;
        synthRef.current.cancel();
        queueRef.current = [];
        indexRef.current = 0;
        isPausedRef.current = false;
        isSpeakingRef.current = true;
        queueRef.current.push(title);
        if (title === "Method")
            queueRef.current.push("Here are the steps");
        else
            queueRef.current.push("Here are the items");
        if (Array.isArray(content)) {
            content.forEach((item, i) => {
                const prefix = title === "Ingredients" ? "" : `step ${i + 1}`;
                queueRef.current.push(`${prefix}: ${item}`);
            });
        } else {
            queueRef.current.push(content);
        }
        if (title === "Method") 
            queueRef.current.push("Enjoy!");
        playNext();
    };
    const pause = () => {
        isPausedRef.current = true;
        synthRef.current.pause();
    };
    const resume = () => {
        if (!isPausedRef.current) return;
        isPausedRef.current = false;
        synthRef.current.resume();
        playNext();
    };
    return {
        speak,
        pause,
        resume,
    };
};

export default useSpeech;