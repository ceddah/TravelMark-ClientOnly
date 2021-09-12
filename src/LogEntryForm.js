import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { createLogEntry } from './API';

const LogEntryForm = ({ location, onClose }) => {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (err) {
            console.log(err);
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
            {error ? <h3 className="error">{error}</h3> : null}
            <label htmlFor="apiKey">SecretKey:</label>
            <input name="apiKey" type="password" required {...register('apiKey')} />
            <label htmlFor="title">Title:</label>
            <input name="title" required {...register('title')} />
            <label htmlFor="comments">Comments:</label>
            <textarea name="comments" rows={3} {...register('comments')} ></textarea>
            <label htmlFor="description">Description:</label>
            <textarea name="description" rows={3} {...register('description')} ></textarea>
            <label htmlFor="image">Image:</label>
            <input name="image" {...register('image')} />
            <label htmlFor="visitDate">Visit Date:</label>
            <input name="visitDate" type="date" required {...register('visitDate')} />
            <label htmlFor="visitDate">Rate your Experience 0-10:</label>
            <input name="rating" type="number" min="0" max="10" defaultValue="5" {...register('rating')} />
            <button disabled={loading}>{loading ? 'Loading...' : 'Create Log Entry'}</button>
        </form>
    )
}

export default LogEntryForm
