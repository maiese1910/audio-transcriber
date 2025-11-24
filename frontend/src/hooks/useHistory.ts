import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

export interface TranscriptionItem {
    id: string;
    filename: string;
    text: string;
    date: Date;
}

export const useHistory = () => {
    const [history, setHistory] = useState<TranscriptionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'transcriptions'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: TranscriptionItem[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    filename: data.filename,
                    text: data.text,
                    date: data.createdAt?.toDate() || new Date(),
                });
            });
            setHistory(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addToHistory = async (filename: string, text: string) => {
        try {
            await addDoc(collection(db, 'transcriptions'), {
                filename,
                text,
                createdAt: Timestamp.now(),
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return { history, loading, addToHistory };
};
