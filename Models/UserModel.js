import mongoose from "mongoose";;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: false
    },
    avatar: {
        type: String,
        require: false
    },

    activated: {
        type: Boolean,
        required: false,
        default: false
    },
}, {
    timestamps: true
})

export default mongoose.model('user', userSchema, 'users');