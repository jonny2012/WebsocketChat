import { User, Message, Room } from "./models.js";

class Service {
  //    async RoomFind(room){

  //         const findRoom =  Message.findOne({room})
  //         return

  //     }

  async SaveUserMessage(room, roomId, username, message) {
    const user = await User.findOne({ username });
    const newMessage = await Message.create({
      room,
      roomId,
      user: user.username,
      message,
    });
    return newMessage;
  }
  async FindAllRoomMessages(room) {
    const Messages = await Room.find({ room })
      .populate("messages")
      .select({ messages: 1})
      .sort({ createdAt: 1 })

    return Messages;
  }
  async createUser(username, email, password) {
    const user = await User.create({ username, email, password });
    return user;
  }
  async createRoom(roomNr) {
    const newRoom = await Room.create({ room: roomNr });
    return newRoom;
  }
  async findRoom(roomNr) {
    const findedRoom = await Room.findOne({ room: roomNr });
    return findedRoom;
  }

  async AllUsers() {
    const user = await User.find();
    return user;
  }
  async OneUserbyId(userId) {
    const user = await User.findById({ _id: userId });
    return user;
  }
  async OneUserbyUsername(username) {
    const user = await User.findOne({ username });
    return user;
  }

  async SaveRoomNewMessage(room, username, message) {
    try {
      const isFindRoom = await Room.findOne({ room });
      const user = await User.findOne({ username });
      console.log(isFindRoom);
      if (!isFindRoom) {
        const newRoom = await Room.create({ room, users: user._id });
        const newUserMessage = await Message.create({
          roomId: newRoom._id,
          user: user.username,
          userId: user._id,
          message: message,
        });
        console.log(newUserMessage);
        await Room.updateOne(
          { _id: newRoom._id },
          { $push: { messages: newUserMessage._id } }
        );
      } else {
        const newMessage = await Message.create({
          roomId: isFindRoom._id,
          user:user.username,
          userId: user._id,
          message: message,
        });
        await Room.updateOne(
          { _id: isFindRoom._id },
          { $push: { messages: newMessage._id } }
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}
export default new Service();
