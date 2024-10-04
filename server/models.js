import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  roomId:{type:mongoose.Types.ObjectId, ref:"room"},
  user:{type:String, required:true},
  userId:{ type:mongoose.Types.ObjectId, ref:"user"},
  message: { type:String, required:true},
},{timestamps:true});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique:true},
  email:{type:String, required:true},
  password:{type:String, required:true},
});

const RoomSchema = new mongoose.Schema({
  room:{type:Number, required:true, unique:true},
  users:[{type:mongoose.Types.ObjectId, ref:"user"}],
  messages:[{type:mongoose.Types.ObjectId, ref:"message"}]
})

const Room = mongoose.model("room", RoomSchema)
const Message = mongoose.model("message", MessageSchema);
const User = mongoose.model("user", UserSchema);

export { Message,  User, Room };
