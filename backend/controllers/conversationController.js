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
        return res.status(400).json({ message: "Invalid connect ID" });
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

      res.json({
        success: true,
        message: "Connect ID is valid",
      });
    } catch (error) {
      console.error("Error checking connect code", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getConversations(req, res) {
    console.log("We have arrived");
    try {
      console.log("Step 1: Starting getConversations");
      const userId = req.user._id;
      console.log("User ID:", userId);

      console.log("Step 2: Fetching friendships");
      const friendships = await Friendship.find({
        $or: [{ requester: userId }, { recipient: userId }],
      })
        .populate([
          { path: "requester", select: "id fullName username connectCode" },
          { path: "recipient", select: "id fullName username connectCode" },
        ])
        .lean();

      console.log("Friendships fetched:", friendships.length);

      if (!friendships.length) {
        console.log("No friendships found, returning empty array");
        return res.json({ data: [] });
      }

      // extract friend ids
      console.log("Step 3: Extracting friend IDs");
      const friendIds = friendships.map((friend) =>
        friend.requester._id.toString() === userId.toString()
          ? friend.recipient._id.toString()
          : friend.requester._id.toString(),
      );
      console.log("Friend IDs:", friendIds);

      console.log("Step 4: Fetching conversations");
      const conversations = await Conversation.find({
        participants: {
          $all: [userId],
          $in: friendIds,
          $size: 2,
        },
      });
      console.log("Conversations fetched:", conversations.length);

      console.log("Step 5: Mapping conversations");
      const conversationsMap = new Map();
      conversations.forEach((conversation) => {
        const friendId = conversation.participants.find(
          (p) => p.toString() !== userId.toString(),
        );
        console.log("Mapping conversation for friendId:", friendId);
        conversationsMap.set(friendId.toString(), conversation);
      });

      console.log("Step 6: Preparing conversations data");
      const conversationsData = await Promise.all(
        friendships.map(async (friendship) => {
          const isRequester =
            friendship.requester._id.toString() === userId.toString();
          const friend = isRequester
            ? friendship.recipient
            : friendship.requester;

          const conversation = conversationsMap.get(friend._id.toString());
          if (!conversation) {
            console.log(
              "No conversation found for friend:",
              friend._id.toString(),
            );
          }

          return {
            conversationId: conversation?.id || null,
            lastMessage: conversation?.lastMessagePreview || null,
            unreadCounts: {
              [friendship.requester._id.toString()]:
                conversation?.unreadCounts?.get(
                  friendship.requester._id.toString(),
                ) || 0,
              [friendship.recipient._id.toString()]:
                conversation?.unreadCounts?.get(
                  friendship.recipient._id.toString(),
                ) || 0,
            },
            friend: {
              id: friend._id.toString(),
              username: friend.username,
              fullName: friend.fullName,
              connectCode: friend.connectCode,
              online: false,
            },
          };
        }),
      );

      console.log("Step 7: Sending response");
      res.json({ data: conversationsData });
    } catch (error) {
      console.error("Error fetching conversations", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default ConversationController;
