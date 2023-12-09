import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyB2TD5ljU9KiM4wSPNsxsBZzkt8RguIU3k',
	authDomain: 'todo-nextjs-ad41c.firebaseapp.com',
	projectId: 'todo-nextjs-ad41c',
	storageBucket: 'todo-nextjs-ad41c.appspot.com',
	messagingSenderId: '1033917109104',
	appId: '1:1033917109104:web:ca72ea5aff96fad8a475b5',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
