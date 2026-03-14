import RedisService from "./services/RedisService.js";
import { leaveAllRooms } from "./socket/helpers.js";
import { notifyConversationOnlineStatus } from "./socket/socketConversation.js";

export const initializeSocket = async (io) => {
  io.on("connection", async (socket) => {
    try {
      const user = socket.user;
      console.log("User connected", socket.id);
      socket.join(user._id.toString());
      await RedisService.addUserSession(user.id, socket.id);
      await notifyConversationOnlineStatus(io, socket, true);

      socket.on("disconnect", async () => {
        await notifyConversationOnlineStatus(io, socket, false);
        await RedisService.removeUserSessions(user.id, socket.id);
        const isOnline = await RedisService.isUserOnline(user.id);
        if (!isOnline) {
          await notifyConversationOnlineStatus(io, socket, false);
          leaveAllRooms(socket);
        }
      });
    } catch (error) {
      console.log("Socket connection error", error);
      socket.emit("Internal Error", { error: "Internal Server Error" });
    }
  });
};
