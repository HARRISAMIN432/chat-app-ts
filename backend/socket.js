import { leaveAllRooms } from "./socket/helpers.js";
import { notifyConversationOnlineStatus } from "./socket/socketConversation.js";

export const initializeSocket = async (io) => {
  io.on("connection", async (socket) => {
    try {
      const user = socket.user;
      console.log("User connected", socket.id);
      socket.join(user._id.toString());

      await notifyConversationOnlineStatus(io, socket, true);

      socket.on("disconnect", async () => {
        leaveAllRooms(socket);
      });
      await notifyConversationOnlineStatus(io, socket, false);
    } catch (error) {
      console.log("Socket connection error", error);
      socket.emit("Internal Error", { error: "Internal Server Error" });
    }
  });
};
