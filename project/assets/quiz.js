// Quiz functionality - Updated for multiple quizzes per page
document.addEventListener("DOMContentLoaded", () => {
  const quizForms = document.querySelectorAll(".quiz");
  if (!quizForms.length) return;

  console.log(`Found ${quizForms.length} quizzes on page`);

  quizForms.forEach((quizForm, quizIndex) => {
    const lessonId = quizForm.dataset.lessonId;
    const checkBtn = quizForm.querySelector('[data-action="check"]');
    const resetBtn = quizForm.querySelector('[data-action="reset"]');
    const resultDiv = quizForm.querySelector(".result");
    const questions = quizForm.querySelectorAll(".question");

    console.log(`Quiz ${quizIndex + 1} initialized:`, lessonId, "Questions:", questions.length);

    // Check answers
    if (checkBtn) {
      checkBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(`Check button clicked for quiz ${quizIndex + 1}`);
        
        let score = 0;
        let total = questions.length;
        let allAnswered = true;

        questions.forEach((question, index) => {
          const correctAnswers = question.dataset.correct.split(',').map(a => a.trim());
          const isCheckboxQuestion = question.querySelector('input[type="checkbox"]') !== null;
          
          let selectedValues = [];

          if (isCheckboxQuestion) {
            // For checkbox questions (multiple answers)
            const selectedCheckboxes = question.querySelectorAll('input[type="checkbox"]:checked');
            selectedValues = Array.from(selectedCheckboxes).map(cb => cb.value.trim());
            
            console.log(`Quiz ${quizIndex + 1} - Checkbox Question ${index + 1}:`, {
              correct: correctAnswers,
              selected: selectedValues
            });

            if (selectedValues.length === 0) {
              allAnswered = false;
              return;
            }
          } else {
            // For radio questions (single answer)
            const selectedInput = question.querySelector('input[type="radio"]:checked');
            
            console.log(`Quiz ${quizIndex + 1} - Radio Question ${index + 1}:`, {
              correct: correctAnswers,
              selected: selectedInput ? selectedInput.value : 'none'
            });

            if (!selectedInput) {
              allAnswered = false;
              return;
            }
            selectedValues = [selectedInput.value.trim()];
          }

          // Remove previous styles
          question.classList.remove("correct", "incorrect");

          // Check if answers are correct
          const isCorrect = arraysEqual(selectedValues.sort(), correctAnswers.sort());
          
          if (isCorrect) {
            question.classList.add("correct");
            score++;
          } else {
            question.classList.add("incorrect");
          }
        });

        if (!allAnswered) {
          resultDiv.style.display = "block";
          resultDiv.style.background = "#fef3c7";
          resultDiv.style.border = "1px solid #f59e0b";
          resultDiv.style.color = "#92400e";
          resultDiv.innerHTML = "⚠️ Please answer all questions before checking!";
          resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }

        // Calculate percentage
        const percentage = Math.round((score / total) * 100);
        let message = "";
        let bgColor = "";
        let borderColor = "";
        let textColor = "";

        if (percentage >= 80) {
          message = `🌟 Excellent! You got ${score} out of ${total} correct (${percentage}%)`;
          bgColor = "#d1fae5";
          borderColor = "#10b981";
          textColor = "#065f46";
        } else if (percentage >= 60) {
          message = `👍 Good job! You got ${score} out of ${total} correct (${percentage}%)`;
          bgColor = "#dbeafe";
          borderColor = "#3b82f6";
          textColor = "#1e40af";
        } else {
          message = `📖 Keep practicing! You got ${score} out of ${total} correct (${percentage}%)`;
          bgColor = "#fef3c7";
          borderColor = "#f59e0b";
          textColor = "#92400e";
        }

        resultDiv.style.display = "block";
        resultDiv.style.background = bgColor;
        resultDiv.style.border = `1px solid ${borderColor}`;
        resultDiv.style.color = textColor;
        resultDiv.innerHTML = message;

        // Scroll to results
        setTimeout(() => {
          resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);

        console.log(`Quiz ${quizIndex + 1} Result:`, score, "/", total);

        // Save to Firebase if user is logged in
        if (typeof saveResult === 'function') {
          saveResult(lessonId, score, total);
        } else {
          console.warn("saveResult function not found");
        }
      });
    }

    // Reset quiz
    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(`Reset button clicked for quiz ${quizIndex + 1}`);
        
        // Clear all selections
        questions.forEach((question) => {
          question.classList.remove("correct", "incorrect");
          const inputs = question.querySelectorAll('input[type="radio"], input[type="checkbox"]');
          inputs.forEach((input) => {
            input.checked = false;
          });
        });

        // Hide result
        resultDiv.style.display = "none";
        resultDiv.innerHTML = "";

        // Scroll to top of quiz
        quizForm.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });

  // Helper function to compare arrays
  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
});