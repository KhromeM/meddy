import { createContext, useContext, useState, useEffect } from "react";
import {
	getFirestore,
	doc,
	collection,
	onSnapshot,
	getDoc,
	setDoc,
	updateDoc,
	getDocs,
} from "firebase/firestore";

import { app } from "./firebase-config.js";

const db = getFirestore(app);

export const fetchDoc = (collection, document, setter) => {
	getDoc(doc(db, collection, document)).then((doc) => {
		setter(doc.data());
	});
};

export const fetchDocs = async (col) => {
	let data = [];

	let getDocHelper = () =>
		getDocs(collection(db, col)).then((docs) => {
			docs.forEach((doc) => {
				data.push(doc.data());
			});
		});
	await getDocHelper();
	return data;
};
export const createDoc = (collection, document, data) => {
	setDoc(doc(db, collection, document), data)
		.then(() => {
			console.log("Document Created");
		})
		.catch((error) => {
			console.log("Document creation error: ", error);
		});
};

export const modifyDoc = (collection, document, data) => {
	updateDoc(doc(db, collection, document), data)
		.then(() => {
			console.log("Document Created");
		})
		.catch((error) => {
			console.log("Document creation error: ", error);
		});
};

// import { useAuth } from "./AuthService.jsx";

// const dataContext = createContext();
// export const useData = () => useContext(dataContext);

// export const DataProvider = ({ children }) => {
// 	const data = useDatabase();
// 	return <dataContext.Provider value={data}>{children}</dataContext.Provider>;
// };

// const useDatabase = () => {
// 	const { user } = useAuth();
// 	const [userData, setUserData] = useState(false);

// 	useEffect(() => {
// 		if (user) {
// 			fetchDoc("users", user.uid, setUserData);
// 		} else {
// 			setUserData(false);
// 		}
// 	}, [user]);

// 	return { userData, createDoc, modifyDoc, fetchDoc, fetchDocs };
// };
