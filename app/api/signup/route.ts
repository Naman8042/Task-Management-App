import { connect } from "@/lib/dbConnect";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    if (!reqBody) {
      return NextResponse.json({
        success: false,
        message: "req Body not found",
      });
    }
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({ email: email });
    if (user) {
      return NextResponse.json({
        success: false,
        message: "User already exits",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    const userResponse = {
      _id: savedUser._id,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    };

    return NextResponse.json({
      message: "User registed Successfully",
      status: 201,
      success: true,
      savedUser:userResponse,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
