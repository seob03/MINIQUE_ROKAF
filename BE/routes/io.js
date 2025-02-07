module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log(`Socket ${socket.id} connected`)

        // 특정 room에 join 요청오면 해당 room에 시켜주기
        socket.on('ask-join', async (data) => {
            try {
                console.log(`Socket ${socket.id} 요청: join room ${data}`);
                socket.join(data);
                console.log("join 완료");
            } catch (error) {
                console.error("join 처리 중 에러:", error);
            }
        })

        // 유저가 보낸 메세지를 해당 room에 제공하기
        socket.on('message-send', async (data) => {
            try {
                console.log("message-send 이벤트 받음:", data);
                const timestamp = new Date().toISOString();
                // data.room에 해당하는 방에 메시지 브로드캐스트
                io.to(data.room).emit('message-broadcast', {
                    user: data.username,
                    text: data.text,
                    room: data.room,
                    timestamp: timestamp
                });
            } catch (error) {
                console.error("message-send 처리 중 에러:", error);
            }
        })

        // 소켓 해제
        socket.on("disconnect", async () => {
            console.log(`Socket ${socket.id} disconnected`)
        })
    })
};
// 2025.2.7.