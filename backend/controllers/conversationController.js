import Conversation from "../models/Conversation.js";
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";

class ConversationController {
  static async checkConnectCode(req, res) {
    try {
      const userId = req.user._id;
      const { connectCode } = req.query;
      const friend = await User.findOne({ connectCode });
      if (!friend || friend._id.toString() === userId.toString()) {
        return res.status(400).json({ message: "Invalid Connect ID" });
      }
      const existingFriendship = await Friendship.findOne({
        $or: [
          { requester: userId, recipient: friend._id },
          { requester: friend._id, recipient: userId },
        ],
      });
      if (existingFriendship) {
        return res.status(400).json({ message: "Friendship already exists" });
      }
      res.status(200).json({
        success: true,
        message: "Connect ID is valid",
      });
    } catch (error) {
      console.log("Error checking connect code", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getConversations(req, res) {
    try {
      const userId = req.user._id.toString();

      const friendships = await Friendship.find({
        $or: [{ requester: userId }, { recipient: userId }],
      })
        .populate([
          { path: "requester", select: "username fullName connectCode" },
          { path: "recipient", select: "username fullName connectCode" },
        ])
        .lean();

      if (!friendships.length) return res.json({ data: [] });

      const friendIds = friendships.map((f) =>
        f.requester._id.toString() === userId
          ? f.recipient._id.toString()
          : f.requester._id.toString(),
      );

      const conversations = await Conversation.find({
        participants: { $all: [userId], $size: 2 },
        participants: { $in: friendIds },
      }).lean();

      const conversationMap = new Map();
      conversations.forEach((conv) => {
        const friendId = conv.participants.find((p) => p.toString() !== userId);
        if (friendId) conversationMap.set(friendId.toString(), conv);
      });

      const conversationsData = friendships.map((f) => {
        const isRequester = f.requester._id.toString() === userId;
        const friend = isRequester ? f.recipient : f.requester;

        const conv = conversationMap.get(friend._id.toString()) || {};

        return {
          conversationId: conv._id?.toString() || null,
          lastMessage: conv.lastMessagePreview || null,
          unreadCounts: {
            [f.requester._id.toString()]:
              conv.unreadCounts?.[f.requester._id.toString()] || 0,
            [f.recipient._id.toString()]:
              conv.unreadCounts?.[f.recipient._id.toString()] || 0,
          },
          friend: {
            id: friend._id.toString(),
            username: friend.username,
            fullName: friend.fullName,
            connectCode: friend.connectCode,
            online: false,
          },
        };
      });

      return res.status(200).json({ data: conversationsData });
    } catch (error) {
      console.error("Error fetching conversations", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default ConversationController;
