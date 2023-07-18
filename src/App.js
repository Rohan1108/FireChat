// This code is a simple chat application using React and Firebase.
// It allows users to sign in with their Google account and send/receive messages in real-time.
// Firebase is used for authentication, database (Firestore), and analytics.
// The chat messages are stored in Firestore, and the application uses Firebase's real-time update capabilities to display new messages as they are added.

import React, { useRef, useState } from 'react';
import './App.css';

// Import Firebase libraries
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

// Import Firebase hooks for React
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Firebase configuration and initialization
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
})

// Initialize Firebase services
const auth = firebase.auth(); // Authentication service
const firestore = firebase.firestore(); // Firestore (database) service
const analytics = firebase.analytics(); // Analytics service


// Main component of the App
function App() {
  // Check if the user is authenticated (signed in)
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {/* If the user is signed in, display the ChatRoom, otherwise show the SignIn component */}
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

// Component for signing in using Google
function SignIn() {
  // Function to sign in with Google using a popup
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

// Component for signing out the current user
function SignOut() {
  // Show the sign-out button only if a user is signed in
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

// Component for the chat room, where messages are displayed and sent
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages'); // Reference to the 'messages' collection in Firestore
  const query = messagesRef.orderBy('createdAt').limit(25); // Query to get the latest 25 messages

  // Retrieve messages from Firestore using the query
  const [messages] = useCollectionData(query, { idField: 'id' });

  // State to manage the form input for sending messages
  const [formValue, setFormValue] = useState('');

  // Function to send a message
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    // Add a new message to the Firestore collection
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    // Clear the input field and scroll to the latest message
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>
      {/* Display all messages and use the ChatMessage component */}
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      {/* A dummy element to enable smooth scrolling to the latest message */}
      <span ref={dummy}></span>
    </main>

    {/* Form for sending a new message */}
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
      <button type="submit" disabled={!formValue}>🕊️</button>
    </form>
  </>)
}

// Component to display an individual chat message
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  // Determine if the message is sent or received to apply appropriate styling
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      {/* Display the user's profile photo or a default avatar */}
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
