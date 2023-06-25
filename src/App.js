import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';

function App() {
  const [messages, setMessages] = useState([]);

  const handleMessageSubmit = async (text) => {
    const newMessage = {
      message: text,
      sentTime: 'just now',
      sender: 'User',
    };
    setMessages([...messages, newMessage]);

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
    
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: messages.map((message) => message.message).join("\n") + "\n\nUser: " + text + "\nBot: ",//dunno how this works
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
      });

      const botMessage = {
        message: response.data.choices[0].text,
        sentTime: 'just now',
        sender: 'Bot',
      };

      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ position: 'relative', height: '500px' }}>
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messages.map((message, index) => (

                  //part that prints the message
                  <Message
                    key={index}
                    model={{
                      message: message.message,
                      sentTime: message.sentTime,
                      sender: message.sender,
                    }}
                  />
                  

                ))}
              </MessageList>
              <MessageInput
                onSend={(text) => handleMessageSubmit(text)}
                placeholder="Type message here"
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </header>
    </div>
  );
}

export default App;
