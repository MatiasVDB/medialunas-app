import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    where,
} from 'firebase/firestore';

import { auth, db } from '../firebase/config';
import type { Place } from '../types/place';

const placesCollection = collection(db, 'places');

// Guardar un lugar
export const savePlace = async (place: Place) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No hay un usuario autenticado');
    }

    const docRef = await addDoc(placesCollection, {
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        userId: user.uid,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
};

// Obtener los lugares del usuario
export const getPlaces = async (): Promise<Place[]> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No hay un usuario autenticado');
    }

    const placesQuery = query(
        placesCollection,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(placesQuery);

    return snapshot.docs.map((document) => ({
        id: document.id,
        name: document.data().name,
        latitude: document.data().latitude,
        longitude: document.data().longitude,
    }));
};