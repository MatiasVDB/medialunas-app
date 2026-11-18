import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    // @ts-expect-error Firebase RN export no reconocido por TypeScript
    getReactNativePersistence,
    initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "app-medialunas-react-native.firebaseapp.com",
    projectId: "app-medialunas-react-native",
    storageBucket: "app-medialunas-react-native.firebasestorage.app",
    messagingSenderId: "463158385647",
    appId: "1:463158385647:web:c94e427860d83b6d4f341a"
};

// Evitamos inicializar Firebase más de una vez
const app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

// Inicializamos Firestore
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

