import React, { useState, useEffect } from "react";
import axios from "axios";
import server from "../../utils/constants/server";
import { v1 as uuidv1 } from 'uuid';
import { Link, useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
export default function Voting() {
    const navigate = useNavigate();
    const [place_candidates, setPlaceCandidates] = useState([]);
    const [time_candidates, setTimeCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const { eventId, uid } = useParams();
    const { state } = useLocation();
    const handleVote = async(e) => {
        try{
            e.preventDefault();
            const data = new FormData(e.target);
            let obj = {};
            obj.place_candidates_id = data.getAll("place_candidates_id")
            obj.time_candidates_id = data.getAll("time_candidates_id")
            obj.uid = data.get("uid") //user id
            obj.eventId = data.get("eventId") //event id
            await axios.put(server.url + "/vote/update_vote/"+obj.eventId+"/"+obj.uid, obj)
            .then((response)=>{
                if(response.status === 200)
                alert("Vote submitted successfully!")
                navigate("/event/"+obj.eventId);
                
            })
            // .catch(()=>{
            //     
            // })
            console.log(server.url + "/vote",);
        }   
        catch (e) {
            console.log(e);
        }
    }


    
    useEffect(() => {
        async function retrieveRestaurantInfo() {
        setLoading(true);
            try {
                await axios({
                    method: 'get',
                    url: server.url + "/vote/place_candidates/"+ eventId
                }).then((response) => {
                    setPlaceCandidates(response.data);
                })
            } 
            catch (e) {
                console.log(e);
            }
        }
        retrieveRestaurantInfo();
        setLoading(false);
    }, [eventId])

    //request list of timeslots from backend
    useEffect(() => {
        //Todo: refactor into a service
        async function retrieveTimeInfo() {
            try {
                setLoading(true);
                await axios({
                    method: 'get',
                    url: server.url + "/vote/time_candidates/" + eventId
                }).then((response) => {
                    setTimeCandidates(response.data);
                });
            } 
            catch (e) {
                console.log(e);
            }
        }
        retrieveTimeInfo();
        setLoading(false);
    }, [eventId])


    console.log(state);
    //allow user to vote for a restaurant
    //allow user to vote for a time slot
    if (loading) {
        return <div>loading...</div>
    }

    return (
        <>
            <h1 className="text-center">Voting page for {state.event.event_name} </h1>
            <br/> 
            <form onSubmit={handleVote} className="text-center">
                <input type="hidden" name="uid" value={uid} />
                <input type="hidden" name="eventId" value={eventId} />
                <div className="d-flex justify-content-around" > 
                    <ul className="grid gap-3 md:grid-rows-5">
                        <h3>Restaurants</h3>
                            {place_candidates.map((place) => (
                                <li key={uuidv1()}>
                                        <input type="checkbox" id={place.place_candidates_id} value={place.place_candidates_id} name="place_candidates_id" className="hidden peer"/>
                                        <label htmlFor ={place.place_candidates_id} className="
                                            inline-flex items-center justify-between w-full p-5 text-black-500 bg-white border-2 border-gray-200 rounded-lg 
                                            cursor-pointer dark:hover:text-black-300 dark:border-gray-700 peer-checked:border-yellow-400 hover:text-gray-600 
                                            dark:peer-checked:text-black-300 peer-checked:text-black-600 hover:bg-gray-50 dark:text-black-400 dark:bg-gray-800 
                                            dark:hover:bg-gray-700">
                                        <div className="block">
                                            <div className="w-full text-lg font-semibold">{place.name}</div>
                                            <div className="w-full text-sm font-semibold">{place.address}</div>
                                        </div>
                                        </label>
                                </li>
                            ))}
                    </ul>
                    <ul className="grid gap-3 md:grid-rows-5">
                        <h3>Timeslots</h3>
                            {time_candidates.map((timeslot) => (
                                <li key={uuidv1()}>
                                        <input type="checkbox" id={timeslot.date+timeslot.time} value={timeslot.time_candidates_id} name="time_candidates_id" className="hidden peer"/>
                                        <label htmlFor ={timeslot.date+timeslot.time} className="
                                        inline-flex items-center justify-between w-full p-5 text-black-500 bg-white border-2 border-gray-200 rounded-lg 
                                        cursor-pointer dark:hover:text-black-300 dark:border-gray-700 peer-checked:border-yellow-400 hover:text-gray-600 
                                        dark:peer-checked:text-black-300 peer-checked:text-black-600 hover:bg-gray-50 dark:text-black-400 dark:bg-gray-800 
                                        dark:hover:bg-gray-700">
                                        <div className="block">
                                            <div className="w-full text-lg font-semibold">{timeslot.date}</div>
                                            <div className="w-full text-sm font-semibold">{timeslot.time}</div>
                                        </div>
                                        </label>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="p-4 flex">
                    <div className="w-11/12 flex justify-end">
                        <div className="">
                            <Link to={"/event/"+eventId}><button type="button" className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded">Back</button></Link>
                        </div>
                        <div className="w-9/12"/>
                        <div className="">
                            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </>


    );
}

