// Save result to Firestore
function saveResult(lessonId, score, total) {
  const user = auth.currentUser;
  
  if (!user) {
    console.log("User not logged in, result not saved");
    return;
  }

  // Determine lesson name based on lessonId
  let lessonName = "Module 6 - Reading";
  if (lessonId === "module6-grammar") {
    lessonName = "Module 6 - Grammar";
  } else if (lessonId === "module6-reading") {
    lessonName = "Module 6 - Reading";
  }

  console.log("Saving result:", { lessonName, score, total, uid: user.uid });

  db.collection("results")
    .add({
      uid: user.uid,
      lesson: lessonName,
      score: score,
      total: total,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
      console.log("Result saved successfully with ID:", docRef.id);
      
      // Show success message
      const resultDiv = document.querySelector(".result");
      if (resultDiv) {
        setTimeout(() => {
          const currentText = resultDiv.innerHTML;
          resultDiv.innerHTML = currentText + "<br><small style='margin-top: 8px; display: block; font-weight: normal;'>✅ Result saved to your account!</small>";
        }, 500);
      }
    })
    .catch((error) => {
      console.error("Error saving result:", error);
      
      // Show error message
      const resultDiv = document.querySelector(".result");
      if (resultDiv) {
        setTimeout(() => {
          const currentText = resultDiv.innerHTML;
          resultDiv.innerHTML = currentText + "<br><small style='margin-top: 8px; display: block; color: #dc2626; font-weight: normal;'>⚠️ Failed to save result. Error: " + error.message + "</small>";
        }, 500);
      }
    });
}