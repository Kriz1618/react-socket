import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("/");

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(false);

  useEffect(() => {
    const receiveMessage = (message) => {
      console.log("12", "message", message);
      setMessages([JSON.parse(message), ...messages]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
    socket.emit("message", JSON.stringify({ ...newMessage, from: username }));
  };

  const handledSetUsername = (event) => {
    event.preventDefault();
    if (!username) {
      setUsername('Guest');      
    }
    setUser(true);
  }

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      {!user ? (
        <form className="bg-zinc-900 p-10 rounded-xl">
          <h1 className="text-2xl font-bold my-2 mb-6">Username</h1>
          <input
            type="text"
            placeholder="Type your username..."
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-zinc-500 p-2 w-full text-black rounded-md mb-4"
            value={username}
            autoFocus
          />
          <button onClick={handledSetUsername} className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 mr-2">Send</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-10 rounded-xl">
          <h1 className="text-2xl font-bold my-2 mb-6">Simple Chat React</h1>
          <input
            name="message"
            type="text"
            placeholder="Write your message..."
            onChange={(e) => setMessage(e.target.value)}
            className="border-2 border-zinc-500 p-2 w-full text-black rounded-md"
            value={message}
            autoFocus
          />

          <ul className="h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <li
                key={index}
                className={`my-2 p-2 table text-sm rounded-md ${
                  message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
                }`}
              >
                <b>{message.from}</b>: {message.body}
              </li>
            ))}
          </ul>
        </form>
      )}
    </div>
  );
}

export default App;
