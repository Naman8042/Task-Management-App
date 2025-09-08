import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { option } from "@/app/api/auth/[...nextauth]/option";
import { connect } from "@/lib/dbConnect";
import Task from "@/models/taskSchema";

connect();

interface RouteContext {
  params: {
    id: string;
  };
}

// 🔎 GET a single task
export async function GET( context: RouteContext) {
  try {
    const session = await getServerSession(option);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
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

// ✏️ Update task
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(option);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
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

// 🗑 Delete task
export async function DELETE(context: RouteContext) {
  try {
    const session = await getServerSession(option);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
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
