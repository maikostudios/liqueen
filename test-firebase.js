// Test Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqgFkuQzU8TLgBbXCKcKenwQKDke4VYeA",
  authDomain: "liqueen.firebaseapp.com",
  projectId: "liqueen",
  storageBucket: "liqueen.firebasestorage.app",
  messagingSenderId: "369721543995",
  appId: "1:369721543995:web:faa51f6bfaab56cdbf3b1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Test authentication
async function testFirebaseAuth() {
  try {
    console.log("🔥 Testing Firebase Authentication...");
    
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      "maikostudios@gmail.com", 
      "123456$"
    );
    
    console.log("✅ Authentication successful!");
    console.log("User:", userCredential.user.email);
    console.log("UID:", userCredential.user.uid);
    
    return true;
  } catch (error) {
    console.error("❌ Authentication failed:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    return false;
  }
}

// Run test
testFirebaseAuth().then(success => {
  if (success) {
    console.log("🎉 Firebase is configured correctly!");
  } else {
    console.log("🚨 Firebase configuration needs attention.");
  }
});
