import { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';

export const useJournal = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await journalAPI.getEntries();
            
            // Debug logging for entries data
            console.log('Journal entries response:', response.data);
            
            // Handle the nested response format from backend
            const entriesData = response.data.entries || response.data || [];
            
            // Validate and clean entries data
            const validEntries = entriesData.map(entry => {
                // Ensure createdAt is a valid date
                if (entry.createdAt) {
                    const date = new Date(entry.createdAt);
                    if (isNaN(date.getTime())) {
                        console.warn('Invalid date found in entry:', entry.id, entry.createdAt);
                        entry.createdAt = new Date().toISOString(); // Use current date as fallback
                    }
                } else {
                    console.warn('Missing createdAt in entry:', entry.id);
                    entry.createdAt = new Date().toISOString(); // Use current date as fallback
                }
                return entry;
            });
            
            console.log('Processed entries:', validEntries);
            setEntries(validEntries);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const addEntry = async (entryData) => {
        try {
            console.log('Adding entry:', entryData);
            const response = await journalAPI.createEntry(entryData);
            
            // Handle the nested response format
            const newEntry = response.data.entry || response.data;
            console.log('New entry received:', newEntry);
            
            setEntries(prev => [newEntry, ...prev]);
            return newEntry;
        } catch (error) {
            console.error('Error adding entry:', error);
            throw error;
        }
    };

    const updateEntry = async (id, entryData) => {
        try {
            console.log('Updating entry:', id, entryData);
            const response = await journalAPI.updateEntry(id, entryData);
            
            // Handle the nested response format
            const updatedEntry = response.data.entry || response.data;
            console.log('Updated entry received:', updatedEntry);
            
            setEntries(prev => prev.map(entry => 
                entry.id === id ? updatedEntry : entry
            ));
            return updatedEntry;
        } catch (error) {
            console.error('Error updating entry:', error);
            throw error;
        }
    };

    const deleteEntry = async (id) => {
        try {
            console.log('Deleting entry:', id);
            await journalAPI.deleteEntry(id);
            setEntries(prev => prev.filter(entry => entry.id !== id));
        } catch (error) {
            console.error('Error deleting entry:', error);
            throw error;
        }
    };

    return {
        entries,
        loading,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
        refetch: fetchEntries
    };
};