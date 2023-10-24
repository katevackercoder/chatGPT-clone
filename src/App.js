import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const apiKey = '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';

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    setMessages([...messages, { text: userInput, isUser: true }]);
    setUserInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci/completions',
        {
          prompt: userInput,
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const botResponse = response.data.choices[0].text;
      setMessages([...messages, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('OpenAI API request failed:', error);
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    function createMessage(sender, text, className) {
      const message = document.createElement("div");
      message.className = `chat-message ${className}`;
      message.innerHTML = `
          <span>${sender}</span>
          <p>${text}</p>
      `;
      return message;
    }

    const sendMessage = () => {
      console.log("sendMessage function called");

      const messageText = userInput.value.trim();
      if (messageText !== "") {
        const userMessage = createMessage("You:", messageText, "user");
        chatBox.appendChild(userMessage);

        const isQuestion = messageText.endsWith('?');
        if (isQuestion) {
          makeChatGPTRequest(messageText);
        } else {
          const botResponse = createMessage("ChatGPT:", "I received your message.", "bot");
          chatBox.appendChild(botResponse);
        }

        userInput.value = "";
      }
    };

    const makeChatGPTRequest = (messageText) => {
      const requestData = {
        model: 'text-davinci-002',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: messageText,
          },
        ],
      };

      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          const botResponse = createMessage("ChatGPT:", data.choices[0].message.content, "bot");
          chatBox.appendChild(botResponse);
        })
        .catch((error) => {
          console.error('Error communicating with OpenAI:', error);
        });
    };

    sendButton.addEventListener("click", sendMessage);
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-box" id="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.isUser ? 'user' : 'bot'}`}
          >
            <span>{message.isUser ? 'You:' : 'ChatGPT:'}</span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="user-input">
        <input
          type="text"
          id="user-input"
          placeholder="Type a message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button id="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
function sendMessage() {
  console.log("sendMessage function called");

  const messageText = userInput.value.trim();
  if (messageText !== "") {
    const userMessage = createMessage("You:", messageText, "user");
    chatBox.appendChild(userMessage);

    const isQuestion = messageText.endsWith('?');
    if (isQuestion) {
      makeChatGPTRequest(messageText);
    } else {
      const botResponse = createMessage("ChatGPT:", "I received your message.", "bot");
      chatBox.appendChild(botResponse);
    }

    userInput.value = "";
  }
}

function makeChatGPTRequest(messageText) {
  const requestData = {
    model: 'text-davinci-002',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: messageText,
      },
    ],
  };

  fetch('https://api.openai.com/v1/engines/davinci/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      const botResponse = createMessage("ChatGPT:", data.choices[0].text, "bot");
      chatBox.appendChild(botResponse);
      chatBox.scrollTop = chatBox.scrollHeight;
      userInput.value = "";function makeChatGPTRequest(messageText) {
  const requestData = {
    model: 'text-davinci-002',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: messageText,
      },
    ],
  };

  fetch('https://api.openai.com/v1/engines/davinci/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      const botResponse = createMessage("ChatGPT:", data.choices[0].message.content, "bot");
      chatBox.appendChild(botResponse);
      // Scroll to the bottom of the chat box
      chatBox.scrollTop = chatBox.scrollHeight;
      const botResponseText = data.choices[0].message.content;
      if (botResponseText.endsWith('?')) {
        makeChatGPTRequest(botResponseText);
      }
    })
    .catch((error) => {
      console.error('Error communicating with OpenAI:', error);
    });
}

    })
    .catch((error) => {
      console.error('Error communicating with OpenAI:', error);
    });
}
