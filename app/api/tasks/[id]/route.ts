import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { option } from "@/app/api/auth/[...nextauth]/option";
import { connect } from "@/lib/dbConnect";
import Task from "@/models/taskSchema";

connect();

// GET a single task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try {
    const session = await getServerSession(option);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const params = await context.params;
    const { id } = params;// params is a Promise in Next.js 15
    const task = await Task.findOne({ _id: id, userId: session.user.id });
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Update task
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try {
    const session = await getServerSession(option);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const params = await context.params;
    const { id } = params;
    const body = await req.json();
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      body,
      { new: true }
    );
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Delete task
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try {
    const session = await getServerSession(option);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const params = await context.params;
    const { id } = params;
    const task = await Task.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
