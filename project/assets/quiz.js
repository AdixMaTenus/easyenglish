// Quiz functionality
document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.querySelector(".quiz");
  if (!quizForm) return;

  const lessonId = quizForm.dataset.lessonId;
  const checkBtn = quizForm.querySelector('[data-action="check"]');
  const resetBtn = quizForm.querySelector('[data-action="reset"]');
  const resultDiv = quizForm.querySelector(".result");
  const questions = quizForm.querySelectorAll(".question");

  // Check answers
  checkBtn.addEventListener("click", () => {
    let score = 0;
    let total = questions.length;
    let allAnswered = true;

    questions.forEach((question) => {
      const correctAnswer = question.dataset.correct;
      const selectedInput = question.querySelector('input[type="radio"]:checked');

      if (!selectedInput) {
        allAnswered = false;
        return;
      }

      const selectedAnswer = selectedInput.value;

      // Remove previous styles
      question.classList.remove("correct", "wrong");

      // Check if answer is correct
      if (selectedAnswer === correctAnswer) {
        question.classList.add("correct");
        score++;
      } else {
        question.classList.add("wrong");
      }
    });

    if (!allAnswered) {
      resultDiv.style.display = "block";
      resultDiv.style.background = "#fef3c7";
      resultDiv.style.borderColor = "#f59e0b";
      resultDiv.style.color = "#92400e";
      resultDiv.innerHTML = "⚠️ Please answer all questions before checking!";
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
    resultDiv.style.borderColor = borderColor;
    resultDiv.style.color = textColor;
    resultDiv.innerHTML = message;

    // Scroll to results
    resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Save to Firebase if user is logged in
    saveResult(lessonId, score, total);
  });

  // Reset quiz
  resetBtn.addEventListener("click", () => {
    // Clear all selections
    questions.forEach((question) => {
      question.classList.remove("correct", "wrong");
      const inputs = question.querySelectorAll('input[type="radio"]');
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
});