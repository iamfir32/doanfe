import {useWebSocket} from "../../context/WebsocketContext";
import {useEffect, useRef, useState} from "react";
import Marker from "./Marker";
import {useDispatch} from "react-redux";
import {setListVictim} from "../../reduces/slice/victimSlice";

const RenderMarker = () => {
    const [markers, setMarkers] = useState([]);
    const { stompClient, subscribeToTopic, unsubscribeFromTopic } = useWebSocket();
    const handleMessageRef = useRef();
    const dispatch=useDispatch();

    useEffect(() => {
        handleMessageRef.current = (message) => {
            const messageParsed = JSON.parse(message.body);

            setMarkers(prevMarkers => {
                const markerIndex = prevMarkers.findIndex(marker => marker.id === messageParsed.id);

                if (markerIndex !== -1) {
                    const updatedMarkers = [...prevMarkers];
                    updatedMarkers[markerIndex] = { ...updatedMarkers[markerIndex], ...messageParsed };
                    dispatch(setListVictim(updatedMarkers))
                    return updatedMarkers;
                } else {
                    dispatch(setListVictim([...prevMarkers, messageParsed]))
                    return [...prevMarkers, messageParsed];
                }
            });
        };
    }, []);

    useEffect(() => {
        const topic = "/topic/1/deviceLogs";

        subscribeToTopic(topic, handleMessageRef.current);

        return () => {
            unsubscribeFromTopic(topic);
        };
    }, [stompClient]);

    return <>
        {markers?.map((marker,i)=><Marker key={i} data={marker}/>)}
    </>;
}

export default RenderMarker;
