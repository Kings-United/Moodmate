import { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';

export const useJournal = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEntries = async (limit = 50) => {
        try {
            setLoading(true);
            setError(null);
            const response = await journalAPI.getEntries(limit);
            setEntries(response.data.entries);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to fetch entries');
        } finally {
            setLoading(false);
        }
    };

    const createEntry = async (entryData) => {
        try {
            const response = await journalAPI.createEntry(entryData);
            const newEntry = response.data.entry;
            setEntries(prev => [newEntry, ...prev]);
            return newEntry;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to create entry');
        }
    };

    const updateEntry = async (id, entryData) => {
        try {
            const response = await journalAPI.updateEntry(id, entryData);
            const updatedEntry = response.data.entry;
            setEntries(prev => prev.map(entry =>
                entry.id === id ? updatedEntry : entry
            ));
            return updatedEntry;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to update entry');
        }
    };

    const deleteEntry = async (id) => {
        try {
            await journalAPI.deleteEntry(id);
            setEntries(prev => prev.filter(entry => entry.id !== id));
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to delete entry');
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return {
        entries,
        loading,
        error,
        fetchEntries,
        createEntry,
        updateEntry,
        deleteEntry
    };
};