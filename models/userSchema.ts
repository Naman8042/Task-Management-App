import mongoose, { Document } from "mongoose";

interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    bio?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { 
        type: String, 
        required: false, 
        default: function(this: IUser) {
            return this.email.split('@')[0];
        }
    },
    bio: {
        type: String,
        required: false,
        maxlength: 500,
    },
    // -------------------------
}, { timestamps: true });


export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);