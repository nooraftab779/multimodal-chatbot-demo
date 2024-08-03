import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const App = () => {
  const [messages, setMessages] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8000/ws', {
    onOpen: () => console.log('WebSocket connection established.'),
    onClose: () => console.log('WebSocket connection closed.'),
    onMessage: (message) => setMessages((prev) => [...prev, message.data]),
  });

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && readyState === WebSocket.OPEN) {
            sendMessage(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
        };

        setTimeout(() => mediaRecorder.stop(), 5000); // Stop recording after 5 seconds for demo purposes
      })
      .catch(error => console.error('Error accessing the microphone', error));
  };

  return (
    <div>
      <h1>Multimodal Chatbot</h1>
      <button onClick={startRecording}>Start Recording</button>
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default App;

