import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { option } from "../auth/[...nextauth]/option"; 
import { connect } from "@/lib/dbConnect"; 
import User from "@/models/userSchema"; 



export async function GET(req: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(option);

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log(session.user)
    const userId = session.user.id;

    const user = await User.findById(userId).select('email name bio createdAt'); 
    console.log(user)

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("GET Profile Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(option);

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const { name, bio } = await req.json();
    
    const updatePayload: { name?: string; bio?: string } = {};

    if (typeof name === 'string' && name.trim()) {
      updatePayload.name = name.trim();
    }
    
    if (typeof bio === 'string') {
        updatePayload.bio = bio.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatePayload,
      { new: true, runValidators: true }
    ).select('email name bio createdAt'); 
    if (!updatedUser) {
      return new Response("User not found", { status: 404 });
    }

    
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("PUT Profile Error:", error);
    return new Response("Failed to update profile", { status: 500 });
  }
}