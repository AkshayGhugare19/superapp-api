const { socketType, messageStatus } = require("./config/enums");
const { sendMessage, updateMessage } = require("./modules/chats/services");
const updateBulkMessages = require("./modules/chats/services/updateBulkMessages.service");

function initSocketConnections(io) {

    const onlineUsers = {};
    console.log('onlineUsers', onlineUsers);

    io.on("connection", (socket) => {
        console.log("⚡: New user connected: ", socket.id);

        const userId = socket.handshake.query.userId;
        if (userId) {
            onlineUsers[userId] = socket.id;
            socket.userId = userId;
        }

        // Notify all clients about the updated online status
        io.emit(socketType.USER_STATUS_UPDATE, onlineUsers);

        // Joining the chat room
        socket.on(socketType.JOIN_ROOM, (roomId) => {
            socket.join(roomId);
            console.log(`User ${userId} joined the room: ${roomId}`);
        });

        // Leaving the chat room
        socket.on(socketType.LEAVE_ROOM, (roomId) => {
            socket.leave(roomId);
            console.log(`User ${userId} left the room: ${roomId}`);
        });

        // Real-time message handling
        socket.on(socketType.SENT_MESSAGE, async ({ senderId, receiverId, message, conversationId, tenderId }) => {

            const receiverSocketId = onlineUsers[receiverId];
            const messagePayload = { senderId, receiverId, message, conversationId, status: messageStatus.Sent };
            const response = await sendMessage(messagePayload);

            if (tenderId) {
                io.to(tenderId).emit(socketType.RECEIVE_MESSAGE, messagePayload);
            } else {
                // Emit the message to the receiver if online
                if (receiverSocketId) {
                    messagePayload.status = messageStatus.Delivered
                    io.to(receiverSocketId).emit(socketType.RECEIVE_MESSAGE, messagePayload);
                    await updateMessage({ messageId: response.data.id, status: messageStatus.Delivered })
                }
    
                // Emit the message back to the sender
                io.to(socket.id).emit(socketType.RECEIVE_MESSAGE, messagePayload);
            }
        });

        // Update all messages if they are read
        socket.on(socketType.READ_MESSAGE, async (conversationId) => {
            await updateBulkMessages({ conversationId })
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            if (socket.userId) {
                delete onlineUsers[socket.userId];
                io.emit(socketType.USER_STATUS_UPDATE, onlineUsers);
            }
            console.log("🔥: User disconnected:", socket.id);
        });
    });
}

module.exports = initSocketConnections;
