import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io("https://chat-app-yt.onrender.com", {
        query: { userId: authUser._id },
        transports: ["websocket", "polling"], // Ensure compatibility with different transports
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.disconnect(); // Use `disconnect` to clean up
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
