// In summary, this Cloud Function triggers whenever a new message is created in the 'messages' collection.
// It uses the bad-words library to check if the message contains profane words.
// If it does, the function replaces the profane content with asterisks and updates the message with a notification about the ban.
// The user's UID is added to the 'banned' collection to indicate that they are banned.
// Additionally, the function checks the user's message count in the 'users' collection.
// If the user has sent more than 7 messages, they are also added to the 'banned' collection.
// The function helps moderate the chat application by preventing inappropriate content and banning users who violate the message count limit or use profane language.

// Import necessary modules and initialize Firebase Admin SDK
const functions = require('firebase-functions');
const Filter = require('bad-words');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Cloud Function to detect potentially harmful messages in the 'messages' collection
exports.detectEvilUsers = functions.firestore
  .document('messages/{msgId}')
  .onCreate(async (doc, ctx) => {

    // Initialize the 'bad-words' filter
    const filter = new Filter();
    const { text, uid } = doc.data(); // Extract 'text' and 'uid' from the newly created document

    // Check if the message contains profane words
    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text); // Replace profane words with asterisks (cleaned version)
      
      // Update the message to hide the profane content and notify about the ban
      await doc.ref.update({ text: `🤐 I got BANNED for life for saying... ${cleaned}` });

      // Add the user to the 'banned' collection in Firestore
      await db.collection('banned').doc(uid).set({});
    }

    // Check if the user has sent more than 7 messages
    const userRef = db.collection('users').doc(uid)
    const userData = (await userRef.get()).data();

    if (userData.msgCount >= 7) {
      // If the user has sent more than 7 messages, add them to the 'banned' collection
      await db.collection('banned').doc(uid).set({});
    } else {
      // If the user hasn't sent 7 messages yet, update their message count
      await userRef.set({ msgCount: (userData.msgCount || 0) + 1 });
    }

});
