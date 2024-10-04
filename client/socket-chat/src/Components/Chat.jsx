import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./chat.css";

const sockets = io.connect("http://localhost:5000/");

export const Chat = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({});
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [oldMessages, setOldMessages] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/messages/${searchParams.room}`)
      .then((response) => setOldMessages(response.data[0].messages));
  }, [searchParams.room]);

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search));

    setSearchParams(params);

    sockets.emit("join", params);
  }, [location.search]);

  useEffect(() => {
    sockets.on("message", ({ data }) => {
      
      setMessages((prev) => [...prev, data.user]);
    });
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value) {
      sockets.emit("sendMessage", { message: value, params: searchParams });
    }
    console.log(value);
    setValue("");
  };
  return (
    <div className="chat_container">
      <div className="chat_title-box">
        <h1>Chat</h1>
      </div>
      <div className="msg_box">
        {oldMessages &&
          oldMessages.map(({ message, user }, i) => (
            <div
              className={
                user === searchParams.name
                  ? "right_msg common"
                  : "left_msg common"
              }
              key={i + message}
            >
              {user}:{message}
            </div>
          ))}
        {messages &&
          messages.map(({ message, name }, i) => (
            <div
              className={
                name === searchParams.name
                  ? "right_msg common"
                  : "left_msg common"
              }
              key={i}
            >
              {name}:{message}
            </div>
          ))}
      </div>
      <form className="send_message" onSubmit={handleSubmit}>
        <input
        className="send_input"
          type="text"
          placeholder="message"
          value={value}
          onChange={handleChange}
        />
        <button className="send_msg" type="submit">Send message</button>
      </form>
    </div>
  );
};
