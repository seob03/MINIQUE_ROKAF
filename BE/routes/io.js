const { MongoClient, ObjectId } = require('mongodb');

module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log(`✅ Socket ${socket.id} connected`)

        // 특정 room에 join 요청오면 해당 room에 시켜주기
        socket.on('ask-join', async (newRoom) => {
            try {
                // 현재 소켓이 참여 중인 방을 확인
                const currentRooms = Array.from(socket.rooms);
                // 첫 번째 요소는 socket.id이므로 실제 방 목록은 두 번째부터
                const previousRoom = currentRooms.length > 1 ? currentRooms[1] : null; // 현재 소켓이 참여한 첫 번째 방을 찾음
                if (previousRoom && previousRoom !== newRoom) {
                    // 이전 방에서 나가기
                    socket.leave(previousRoom);
                    console.log(`🔴 Socket ${socket.id}가 ${previousRoom}에서 나갔습니다.`);
                }

                // 새 방에 참여
                socket.join(newRoom);
                console.log(`🟢 ${newRoom}에 join 완료`);
            } catch (error) {
                console.error("join 처리 중 에러:", error);
            }
        })

        // 메시지 읽음 처리
        socket.on("message-read", async ({ roomId, messageIds, username }) => {
            let client;
            if (!username || !messageIds.length) return;
            console.log("log 3")
            if (!username) return
            try {
                const url = "mongodb://127.0.0.1:27017";
                const dbName = "forum"
                client = new MongoClient(url);
                await client.connect();
                const db = client.db(dbName);
                const messagesCollection = db.collection("chatMessages");
                console.log('messageIds@@@:', messageIds)

                // 메시지 조회 후, 작성자가 아닌 메시지만 필터링
                const messages = await messagesCollection.find({ _id: { $in: messageIds.map(id => new ObjectId(id)) }, room: roomId }).toArray();
                const filteredMessageIds = messages.filter(msg => msg.user !== username).map(msg => msg._id);
                console.log("Filtered message IDs:", filteredMessageIds);
                if (filteredMessageIds.length > 0) {
                    const result = await messagesCollection.updateMany(
                        { _id: { $in: filteredMessageIds }, room: roomId },
                        { $set: { isRead: true } }
                    );
                    console.log(`📖 ${username}님이 ${roomId}의 ${result.modifiedCount}개 메시지를 읽음`);
                    // 읽음 상태를 실시간으로 모든 사용자에게 전파
                    io.to(roomId).emit("message-read-broadcast", { messageIds: filteredMessageIds })
                } else {
                    console.log("No messages to mark as read for", username);
                }
            } catch (error) {
                console.error("메시지 읽음 처리 오류:", error);
            } finally {
                if (client) {
                    await client.close(); // MongoDB 연결 종료
                }
            }
        });

        // 유저가 보낸 메세지를 해당 room에 제공하기
        socket.on('message-send', async (data) => {
            let client
            try {
                const timestamp = new Date().toISOString();
                const url = "mongodb://127.0.0.1:27017";
                const dbName = "forum";
                client = new MongoClient(url);
                await client.connect();
                const db = client.db(dbName);
                const messagesCollection = db.collection("chatMessages");

                // MongoDB에 메시지 저장
                const result = await messagesCollection.insertOne({
                    user: data.username,
                    text: data.text,
                    room: data.room,
                    image: data.image || "",
                    timestamp: timestamp,
                    isRead: false
                });
                const messageId = result.insertedId; // MongoDB에서 자동 생성된 _id 가져오기

                // data.room에 해당하는 방에 메시지 브로드캐스트
                io.to(data.room).emit('message-broadcast', {
                    _id: messageId.toString(),
                    user: data.username,
                    text: data.text,
                    room: data.room,
                    image: data.image || "",
                    timestamp: timestamp,
                    isRead: false // 새 메시지는 기본적으로 읽지 않은 상태
                });
            } catch (error) {
                console.error("message-send 처리 중 에러:", error);
            } finally {
                if (client) {
                    await client.close(); // MongoDB 연결 종료
                }
            }
        })

        // 소켓 해제
        socket.on("disconnect", (reason) => {
            console.log(`❌ Socket ${socket.id} disconnected. 이유: ${reason}`);
        });
    })
};
// 2025.2.7.