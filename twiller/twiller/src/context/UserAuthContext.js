// Assuming firebase.js contains your Firebase setup
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";  // Import your Firebase setup

// Create a user authentication context
const userAuthContext = createContext();

export function UserAuthContextProvider(props) {
    const [user, setUser] = useState(null);

    // Log in with email and password
    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Sign up with email and password
    async function signUp(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Signed up user:", user);
        } catch (error) {
            console.error("Sign up error:", error.code, error.message);
        }
    }

    // Log out
    function logOut() {
        return signOut(auth);
    }

    // Google Sign-In with a popup
    async function googleSignIn() {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account'  // Ensures account selection every time
        });

        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google sign-in result:", result.user);
            setUser(result.user);
            return result.user;  // Returning the signed-in user
        } catch (error) {
            console.error("Google sign-in error:", error.message);
            throw new Error(error.message);  // Throwing the error for potential external handling
        }
    }

    // Monitor auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed:", currentUser);
            setUser(currentUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Handle redirect results (optional, based on your app flow)
    useEffect(() => {
        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log("Redirect result:", result.user);
                    setUser(result.user);
                }
            } catch (error) {
                console.error("Error handling redirect result:", error);
            }
        };

        checkRedirectResult();
    }, []);

    return (
        <userAuthContext.Provider
            value={{ user, logIn, signUp, logOut, googleSignIn }}
        >
            {props.children}
        </userAuthContext.Provider>
    );
}

// Custom hook to use the auth context
export function useUserAuth() {
    return useContext(userAuthContext);
}
