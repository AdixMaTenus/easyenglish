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
      
      // Disable button during sign-in
      loginBtn.disabled = true;
      loginBtn.style.opacity = "0.6";
      loginBtn.innerHTML = '<span>Signing in...</span>';
      
      auth.signInWithPopup(provider)
        .then((result) => {
          console.log("✅ Successfully signed in:", result.user.displayName);
        })
        .catch((error) => {
          console.error("❌ Error signing in:", error);
          
          // Re-enable button
          loginBtn.disabled = false;
          loginBtn.style.opacity = "1";
          loginBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.96L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            Google
          `;
          
          // Show detailed error message
          let errorMessage = "Failed to sign in. ";
          
          switch(error.code) {
            case 'auth/unauthorized-domain':
              errorMessage += "This domain is not authorized. Please contact the administrator.";
              console.error("Add your Vercel domain to Firebase Console → Authentication → Settings → Authorized domains");
              break;
            case 'auth/popup-blocked':
              errorMessage += "Pop-up was blocked by your browser. Please allow pop-ups for this site.";
              break;
            case 'auth/popup-closed-by-user':
              errorMessage += "Sign-in was cancelled.";
              return; // Don't show alert for user cancellation
            case 'auth/network-request-failed':
              errorMessage += "Network error. Please check your connection.";
              break;
            default:
              errorMessage += "Please try again.";
          }
          
          alert(errorMessage);
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
    
    console.log("✅ User is signed in:", user.displayName);
  } else {
    // User is signed out
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (profile) profile.style.display = "none";
    
    console.log("✅ User is signed out");
  }
});

// Logout function
function logout() {
  auth.signOut()
    .then(() => {
      console.log("✅ Successfully signed out");
      // Redirect to home page if on results page
      if (window.location.pathname.includes("results.html")) {
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("❌ Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    });
}

// Save result to Firestore - UPDATED FOR ALL MODULES WITH SPECIFIC TOPICS
function saveResult(lessonId, score, total) {
  const user = auth.currentUser;
  
  if (!user) {
    console.log("⚠️ User not logged in, result not saved");
    return;
  }

  // MODULE LOGIC FOR ALL MODULES WITH SPECIFIC TOPICS
  let lessonName = "Unknown Module";
  
  // Module 1 Grammar
  if (lessonId === "module1-grammar-questions") {
    lessonName = "Module 1 - Grammar: Question Types";
  } else if (lessonId === "module1-grammar-present") {
    lessonName = "Module 1 - Grammar: Present Tenses";
  }
  // Module 1 Reading
  else if (lessonId === "module1-reading-brain") {
    lessonName = "Module 1 - Reading: Human Brain";
  } else if (lessonId === "module1-reading-stress") {
    lessonName = "Module 1 - Reading: Stress";
  } else if (lessonId === "module1-reading-iq") {
    lessonName = "Module 1 - Reading: IQ";
  }
  // Module 2 Grammar
  else if (lessonId === "module2-grammar-nouns") {
    lessonName = "Module 2 - Grammar: Countable/Uncountable Nouns";
  } else if (lessonId === "module2-grammar-reported") {
    lessonName = "Module 2 - Grammar: Reported Speech";
  }
  // Module 2 Reading
  else if (lessonId === "module2-reading-nanobots") {
    lessonName = "Module 2 - Reading: Nanobots";
  } else if (lessonId === "module2-reading-pepper") {
    lessonName = "Module 2 - Reading: Pepper Robot";
  } else if (lessonId === "module2-reading-edison") {
    lessonName = "Module 2 - Reading: Edison";
  }
  // Module 3 Grammar
  else if (lessonId === "module3-grammar-passive") {
    lessonName = "Module 3 - Grammar: Passive Voice";
  } else if (lessonId === "module3-grammar-conditional2") {
    lessonName = "Module 3 - Grammar: Second Conditional";
  }
  // Module 3 Reading
  else if (lessonId === "module3-reading-ufo") {
    lessonName = "Module 3 - Reading: UFO Tour";
  } else if (lessonId === "module3-reading-space") {
    lessonName = "Module 3 - Reading: Space Colonization";
  } else if (lessonId === "module3-reading-cgi") {
    lessonName = "Module 3 - Reading: CGI Art";
  }
  // Module 4 Grammar
  else if (lessonId === "module4-grammar-compound") {
    lessonName = "Module 4 - Grammar: Compound Words";
  } else if (lessonId === "module4-grammar-comparisons") {
    lessonName = "Module 4 - Grammar: Comparisons";
  } else if (lessonId === "module4-grammar-wish") {
    lessonName = "Module 4 - Grammar: Wish/If Only";
  }
  // Module 4 Reading
  else if (lessonId === "module4-reading-bigbang") {
    lessonName = "Module 4 - Reading: Big Bang Theory";
  } else if (lessonId === "module4-reading-cyclical") {
    lessonName = "Module 4 - Reading: Cyclical Universe";
  } else if (lessonId === "module4-reading-aging") {
    lessonName = "Module 4 - Reading: Aging Research";
  }
  // Fallback for old module IDs
  else if (lessonId === "module1-grammar") {
    lessonName = "Module 1 - Grammar";
  } else if (lessonId === "module1-reading") {
    lessonName = "Module 1 - Reading";
  } else if (lessonId === "module2-grammar") {
    lessonName = "Module 2 - Grammar";
  } else if (lessonId === "module2-reading") {
    lessonName = "Module 2 - Reading";
  } else if (lessonId === "module3-grammar") {
    lessonName = "Module 3 - Grammar";
  } else if (lessonId === "module3-reading") {
    lessonName = "Module 3 - Reading";
  } else if (lessonId === "module4-grammar") {
    lessonName = "Module 4 - Grammar";
  } else if (lessonId === "module4-reading") {
    lessonName = "Module 4 - Reading";
  }

  console.log("💾 Saving module result:", { 
    lessonName, 
    score, 
    total, 
    percentage: Math.round((score / total) * 100) + '%',
    uid: user.uid 
  });

  db.collection("results")
    .add({
      uid: user.uid,
      lesson: lessonName,
      score: score,
      total: total,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
      console.log("✅ Module result saved successfully with ID:", docRef.id);
      
      // Show success message
      const resultDiv = document.querySelector(".result");
      if (resultDiv) {
        setTimeout(() => {
          const currentText = resultDiv.innerHTML;
          resultDiv.innerHTML = currentText + "<br><small style='margin-top: 8px; display: block; font-weight: normal; color: #10b981;'>✅ Result saved to your account!</small>";
        }, 500);
      }
    })
    .catch((error) => {
      console.error("❌ Error saving module result:", error);
      
      // Show error message
      const resultDiv = document.querySelector(".result");
      if (resultDiv) {
        setTimeout(() => {
          const currentText = resultDiv.innerHTML;
          resultDiv.innerHTML = currentText + "<br><small style='margin-top: 8px; display: block; color: #dc2626; font-weight: normal;'>⚠️ Failed to save result</small>";
        }, 500);
      }
    });
}

// Utility function to check if user is logged in
function isUserLoggedIn() {
  return auth.currentUser !== null;
}

// Utility function to get current user info
function getCurrentUser() {
  return auth.currentUser;
}