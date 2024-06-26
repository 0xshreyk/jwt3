import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password : {type : String, required: true},
    avatar_url : { type: String, required: true},
});
const userModel = mongoose.model("Users", userSchema);

export default userModel;