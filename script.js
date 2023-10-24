          // DOM-based JavaScript
          document.addEventListener("DOMContentLoaded", function () {
            const chatBox = document.getElementById("chat-box");
            const userInput = document.getElementById("user-input");
            const sendButton = document.getElementById("send-button");

            sendButton.addEventListener("click", sendMessage);

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

            function createMessage(sender, text, className) {
              const message = document.createElement("div");
              message.className = `chat-message ${className}`;
              message.innerHTML = `
                  <span>${sender}</span>
                  <p>${text}</p>
              `;
              return message;
            }

            function makeChatGPTRequest(messageText) {
              const apiKey = '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';
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
          });