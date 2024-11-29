const express = require("express");
const app = express();
require('./DB/db');
const cors = require("cors");
const router = require('./Routes/routes');
const port = process.env.PORT || 8000;
const io = require('socket.io')(8080, ({
      cors: "https://studentportalbackend.onrender.com"
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(router);
app.use("/uploads", express.static("./Upload"));

let users = [];
io.on('connection', (socket) => {
      console.log('New client connected', socket.id);
      // Handle incoming messages
      socket.on('adduser', Eaglerdata => {
            const Eagler_id = Eaglerdata.eageluser._id
            const isuserexist = users.find(user => user.Eaglerdata === Eagler_id)
            if (!isuserexist) {
                  const user = { Eaglerdata: Eagler_id, socketID: socket.id };
                  users.push(user)
                  // Broadcast the message to all connected clients
                  io.emit('getuser', users);
            }

      });

      socket.on('sendMessage', ({ SenderID, receiverId, message }) => {
            const reciver = users.find(user => user.Eaglerdata === receiverId);
            const sender= users.find(user => user.Eaglerdata === SenderID);
            if (reciver) {
                  io.to(reciver.socketID).to(sender.socketID).emit('getMessage', {
                        SenderID,
                        receiverId,
                        message
                  })
            }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
            users = users.filter(user => user.socketID !== socket.id)
            console.log('Client disconnected');
            io.emit('getuser', users);
      });
});

app.get('/', (req, res) => {
      res.status(201).json("express running...");
});


app.listen(port, () => {
      console.log("server is running...");
});