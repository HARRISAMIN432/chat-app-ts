import { leaveAllRooms } from "./socket/helpers";

export const initializeSocket = async (io) => {
  io.on("connection", async (socket) => {
    try {
      const user = socket.user;
      console.log("User connected", socket.id);
      socket.join(user._id.toString());

      socket.on("disconnect", async () => {
        leaveAllRooms(socket);
      });
    } catch (error) {
      console.log("Socket connection error", error);
      socket.emit("Internal Error", { error: "Internal Server Error" });
    }
  });
};
