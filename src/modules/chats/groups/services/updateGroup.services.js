const { db } = require('../../../../db/db');

const updateGroup = async ({ groupId, conversationId, adminId, groupData }) => {
  try {
    const group = await db.Group.findOne({
      where: { id: groupId, isActive: true }
    });

    if (!group) {
      return { msg: "Group not found.", status: false, code: 404 };
    }

    const conversation = await db.Conversation.findOne({
      where: { id: conversationId, groupId: groupId,  isActive: true }
    });

    if (!conversation) {
      return { msg: "Conversation not found.", status: false, code: 404 };
    }

    

    const participant = await db.ConversationParticipants.findOne({
      where: {
        conversationId: conversationId,
        userId: adminId
      }
    });

    if (!participant || participant.role !== 'admin') {
      return { msg: "Only admins can update the group.", status: false, code: 403 };
    }

    const updatedGroup = await group.update({
      groupName: groupData.groupName,
      groupDescription: groupData.groupDescription,
      groupImage: groupData.groupImage
    });

    return {
      msg: "Group updated successfully.",
     data: updatedGroup,
      status: true,
      code: 200
    };

  } catch (error) {
    console.error("Error updating group:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = updateGroup;
