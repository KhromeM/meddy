import { createContext, useContext, useState, useEffect } from "react";
import {
	getAuth,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	GoogleAuthProvider,
} from "firebase/auth";
import { app } from "./firebase-config";
const auth = getAuth(app);

const authContext = createContext();
export const useAuth = () => useContext(authContext);

export const AuthProvider = ({ children }) => {
	const auth = useGetAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useGetAuth = () => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, []);

	const login = async () => {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	};
	const logout = () => {
		signOut(auth);
		//clearData() // implement clear out user data on logout
	};

	return { user, login, logout };
};
