// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUzZePHpFQmtrY58ntwtRW7oU3OJjt5ks",
  authDomain: "easy-english-44ab9.firebaseapp.com",
  projectId: "easy-english-44ab9",
  storageBucket: "easy-english-44ab9.firebasestorage.app",
  messagingSenderId: "278778661841",
  appId: "1:278778661841:web:b2851a9a6a64770dca2ef0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login handler
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          console.log("Successfully signed in:", result.user.displayName);
        })
        .catch((error) => {
          console.error("Error signing in:", error);
          alert("Failed to sign in. Please try again.");
        });
    });
  }
});

// Auth state observer
auth.onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const profile = document.getElementById("userProfile");
  const userName = document.getElementById("userName");
  const userPhoto = document.getElementById("userPhoto");

  if (user) {
    // User is signed in
    if (loginBtn) loginBtn.style.display = "none";
    if (profile) profile.style.display = "flex";
    if (userName) userName.textContent = user.displayName || user.email;
    if (userPhoto) {
      userPhoto.src = user.photoURL || "https://via.placeholder.com/36";
      userPhoto.alt = user.displayName || "User";
    }
    
    console.log("User is signed in:", user.displayName);
  } else {
    // User is signed out
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (profile) profile.style.display = "none";
    
    console.log("User is signed out");
  }
});

// Logout function
function logout() {
  auth.signOut()
    .then(() => {
      console.log("Successfully signed out");
      // Redirect to home page
      if (window.location.pathname.includes("results.html")) {
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    });
}

// Save result to Firestore
function saveResult(lessonId, score, total) {
  const user = auth.currentUser;
  
  if (!user) {
    console.log("User not logged in, result not saved");
    return;
  }

  // Determine lesson name
  let lessonName = "Lesson 1";
  if (lessonId === "lesson2") {
    lessonName = "Lesson 2";
  }

  db.collection("results")
    .add({
      uid: user.uid,
      lesson: lessonName,
      score: score,
      total: total,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
      console.log("Result saved with ID:", docRef.id);
      
      // Show success message
      const resultDiv = document.querySelector(".result");
      if (resultDiv) {
        const currentText = resultDiv.innerHTML;
        resultDiv.innerHTML = currentText + "<br><small style='margin-top: 8px; display: block;'>✅ Result saved to your account!</small>";
      }
    })
    .catch((error) => {
      console.error("Error saving result:", error);
      
      // Show error message
      const resultDiv = document.querySelector(".result");
      if (resultDiv) {
        const currentText = resultDiv.innerHTML;
        resultDiv.innerHTML = currentText + "<br><small style='margin-top: 8px; display: block; color: #dc2626;'>⚠️ Failed to save result. Please check your connection.</small>";
      }
    });
}