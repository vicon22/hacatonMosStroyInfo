const cluster = require("cluster");
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    const httpServer = http.createServer();

    setupMaster(httpServer, {
        loadBalancingMethod: "least-connection",
    });

    setupPrimary();

    cluster.setupMaster({
        serialization: "advanced",
    });

    httpServer.listen(3001);

    for (let i = 0; i < Math.floor(numCPUs / 2); i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} started`);

    const httpServer = http.createServer();
    const io = new Server(httpServer, {
        path: "/chat"
    });

    // use the cluster adapter
    io.adapter(createAdapter());

    // setup connection with the primary process
    setupWorker(io);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id)
        socket.on('join_room', (roomId) => {
            socket.join(roomId)
            console.log(`user with id-${socket.id} joined room - ${roomId}`)
        })

        socket.on('send-message', (data) => {
            console.log(data, 'DATA')
            socket.to(data.roomId).emit('receive-message', data)
        })

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id)
        })
    })
}