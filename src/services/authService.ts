import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase/config';

export const signInUser = async () => {
    try {
        const credential = await signInAnonymously(auth);
        return credential.user;

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};