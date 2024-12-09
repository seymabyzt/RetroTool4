import { db } from "@/firebaseConfig";
import {
  addDoc,
  deleteDoc,
  deleteField,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  getDocs,
  updateDoc,
  query, where,
  getDoc,
  documentId,
  DocumentData,
  QuerySnapshot,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

export async function addUserToRoom(roomID: string, userID: string, isAdmin: boolean) {
    try {
        const usersRef = doc(db, roomID, 'users'); // "rooms" koleksiyonu altında odalar
        await setDoc(usersRef, {
            users: arrayUnion(userID), // "users" dizisine kullanıcı ekle
            admins: isAdmin ? [{ userID, isAdmin }] : [],
        });
        console.log("User added to room!");
    } catch (error) {
        console.error("Error adding user: ", error);
    }
}

export async function removeUserFromRoom (roomID: string, userID: string) {
    try {
        const userRef = doc(db, roomID, "users");
        await deleteDoc(userRef);
        console.log("User removed from room!");
    } catch (error) {
        console.error("Error removing user: ", error);
    }
};