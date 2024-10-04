import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Service from "./Service.js";
import { User } from "./models.js";
import { configDotenv } from "dotenv";
configDotenv(".env");

class Controller {
  async registerUser(req, res) {
    const { username, email, password } = req.body;
    try {
      if (!username || !password) {
        return res.json("Username or password is not entered");
      }
      const user = await Service.OneUserbyUsername(username);
      if (user) {
        return res.json("User is alrready registered");
      }

      const hashedpassword = await bcrypt.hash(password, 3);
      const newUser = await Service.createUser(username, email, hashedpassword);
      res.json(newUser);
    } catch (err) {
      console.log(err.message);
    }
  }
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.json("Username or password is not entered");
      }
      const user = await Service.OneUserbyUsername(username);
      if (!user) {
        return res.json("Wrong username");
      }
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.json("Wrong Passwod");
      }
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    } catch (err) {
      console.log(err.message);
    }
  }

  async checkAuth(req, res) {
    const user = req.user;
    try {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (err) {
      console.log(err.message);
    }
  }

  async getUserbyId(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) return res.json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      console.log(err.message);
    }
  }

  async getAllUsers(req, res) {
    const { username } = req.query;
    try {
      const users = await User.find();

      res.json(users);
    } catch (err) {
      console.log(err.message);
    }
  }
  async getAllMessages(req, res) {
    try {
      const { room } = req.params;
      const messages = await Service.FindAllRoomMessages(Number(room));

      res.json(messages);
    } catch (err) {
      console.log(err.message);
    }
  }


  async SaveRoomNewMessage(req, res){

  }
}

export default new Controller();
