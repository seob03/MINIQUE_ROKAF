module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log(`Socket ${socket.id} connected`)

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
                    console.log(`Socket ${socket.id}가 ${previousRoom}에서 나갔습니다.`);
                }

                // 새 방에 참여
                socket.join(newRoom);
                console.log(`${newRoom}에 join 완료`);
            } catch (error) {
                console.error("join 처리 중 에러:", error);
            }
        })

        // 유저가 보낸 메세지를 해당 room에 제공하기
        socket.on('message-send', async (data) => {
            try {
                // console.log("message-send 이벤트 받음:", data);
                const timestamp = new Date().toISOString();
                // data.room에 해당하는 방에 메시지 브로드캐스트
                io.to(data.room).emit('message-broadcast', {
                    user: data.username,
                    text: data.text,
                    room: data.room,
                    image: data.image || "",
                    timestamp: timestamp
                });
            } catch (error) {
                console.error("message-send 처리 중 에러:", error);
            }
        })

        // 소켓 해제
        socket.on("disconnect", (reason) => {
            console.log(`Socket ${socket.id} disconnected. 이유: ${reason}`);
        });
    })
};
// 2025.2.7.