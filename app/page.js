"use client"; // Mark this as a client component

import { useState } from "react";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: 2, // Index of the correct answer (0-based)
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: 1,
  },
  // Add more questions as needed
];

export default function Home() {
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let totalScore = 0;
    responses.forEach((response, index) => {
      if (response === questions[index].answer) {
        totalScore += 1; // Increment score for each correct answer
      }
    });
    setScore(totalScore);

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "User", marks: totalScore }), // Replace with actual user name if needed
    });

    if (response.ok) {
      setSubmitted(true);
      // Optionally reset the form
      setResponses(Array(questions.length).fill(null));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Quiz Application</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="text-gray-800">
              <p className="font-semibold">{question.question}</p>
              {question.options.map((option, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`question${index}`}
                    value={i}
                    checked={responses[index] === i}
                    onChange={() => handleChange(index, i)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            Submit
          </button>
        </form>
        {submitted && <p className="text-green-500 text-center mt-4">Score Submitted: {score}</p>}
      </div>
    </div>
  );
}
