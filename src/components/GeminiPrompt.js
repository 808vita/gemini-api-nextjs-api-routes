import React, { useState } from "react";

const GeminiPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await JSON.parse(await res.json());
      console.log(data, "data response");
      console.log(data?.text_content, "text_content");

      setResponse(data?.text_content);
    } catch (error) {
      console.error(error);
      setResponse("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Ask Gemini anything!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default GeminiPrompt;
