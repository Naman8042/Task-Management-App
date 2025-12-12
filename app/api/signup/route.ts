import { connect } from "@/lib/dbConnect";
import User from "@/models/userSchema"; // Assuming this model has a 'name' field now
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";



export async function POST(request: NextRequest) {
  await connect();
  try {
    const reqBody = await request.json();

    if (!reqBody) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body not found",
        },
        { status: 400 }
      );
    }

    const { email, password, name } = reqBody;
    console.log(reqBody);

    // Basic validation for name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required for registration",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        { status: 409 }
      ); 
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,

      name,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    const userResponse = {
      _id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name, 
      createdAt: savedUser.createdAt,
    };

    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
        savedUser: userResponse,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during registration.",
      },
      { status: 500 }
    );
  }
}
