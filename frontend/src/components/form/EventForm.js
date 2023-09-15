import React, { useState, useEffect } from 'react';

import TextInput from './TextInput';
import UtilityButton from '../button/UtilityButton';

import { useLocation, useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';
import server from '../../utils/constants/server';

const EventForm = ({ onSave, onDelete, onUpdate, uid }) => {

    let { eventId } = useParams();

    console.log("EventForm props: ", eventId, uid);

    const navigate = useNavigate();

    const [event, setEvent] = useState({
        event_name: '',
        event_description: '',
        host_id: uid,
        duration: 60,
    });

    const [title, setTitle] = useState('Create Event');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (eventId) {
                setTitle('Edit Event');
                setEditing(true);
                const response = await axios.get(`${server.url}/events/${eventId}`);
                const fetchedEvent = response.data[0];
                console.log("fetchedEvent: ", fetchedEvent);
                setEvent({
                    event_name: fetchedEvent.event_name,
                    event_description: fetchedEvent.event_description,
                    host_id: fetchedEvent.host_id,
                    duration: fetchedEvent.duration,
                });
            }
        };
        fetchEvent();
    }, [eventId, uid]);

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleDelete = (e) => {
        e.preventDefault();
        onDelete(eventId);

        setTimeout(() => {
            navigate('/home');
        }, 2000);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!event.event_name || !event.event_description) {
            setError('Please enter all fields');
            return;
        }
        setError('');
        onUpdate(eventId, event);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!event.event_name || !event.event_description) {
            setError('Please enter all fields');
            return;
        }

        setError('');
        onSave(event);
        navigate('/home');
    };

    const handleBack = () => {
        navigate('/home');
    };

    const handleReset = () => {
        setEvent({
            event_name: event.event_name || '',
            event_description: event.event_description || '',
            duration: event.duration || 60,
        });
    };

    return (
        <div className='mx-auto mt-10 w-full max-w-lg p-6 bg-white shadow-md rounded-lg'>
            <h2 className='text-center text-2xl mb-4 font-semibold text-gray-700'>
                {title}
            </h2>
            <div className='w-full'>
                <form>
                    <TextInput
                        label="Name"
                        id="event_name"
                        name='event_name'
                        value={event.event_name}
                        onChange={handleChange}
                        className="mb-4"
                    />

                    <TextInput
                        label="Description"
                        id="event_description"
                        name='event_description'
                        value={event.event_description}
                        onChange={handleChange}
                        className="mb-6"
                    />

                    <div className='flex justify-between items-center'>

                        <UtilityButton
                                bg_color="bg-gray-500"
                                text_color='text-white'
                                hover_color='hover:bg-gray-600'
                                type='button'
                                onClick={handleBack}
                                text='Back'
                                className='w-1/2 mr-2'
                            />

                        <UtilityButton
                            bg_color="bg-blue-500"
                            text_color='text-white'
                            hover_color='hover:bg-blue-600'
                            type='button'
                            onClick={handleSubmit}
                            text='Save'
                            className='w-1/2 mr-2'
                        />

                        <UtilityButton
                            bg_color="bg-red-500"
                            text_color='text-white'
                            hover_color='hover:bg-red-600'
                            type='button'
                            onClick={handleReset}
                            text='Reset'
                            className='w-1/2 mr-2'
                        />
                        {editing && (
                            <>
                                <UtilityButton
                                    bg_color="bg-green-500"
                                    text_color='text-white'
                                    hover_color='hover:bg-green-600'
                                    type='button'
                                    onClick={handleUpdate}
                                    text='Update'
                                    className='w-1/4 mx-2'
                                />
                                <UtilityButton
                                    bg_color="bg-red-500"
                                    text_color='text-white'
                                    hover_color='hover:bg-red-600'
                                    type='button'
                                    onClick={handleDelete}
                                    text='Delete'
                                    className='w-1/4 ml-2'
                                />
                            </>
                        )}
                    </div>

                    {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}

                </form>

            </div>

        </div>
    );
};

export default EventForm;
