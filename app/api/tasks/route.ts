import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { option } from "../auth/[...nextauth]/option";
import { connect } from "@/lib/dbConnect";
import Task from "@/models/taskSchema";




export async function GET(req: NextRequest) {
  await connect();
  const session = await getServerSession(option);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { search, status } = Object.fromEntries(req.nextUrl.searchParams);
  const pageParam = req.nextUrl.searchParams.get("page") || "1";
  const limitParam = req.nextUrl.searchParams.get("limit") || "10";

  const page = Number(pageParam);
  const limit = Number(limitParam);

  const query: any = { userId: session.user.id };

  // ✅ Search by title OR description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (status && status !== "all") {
    query.status = status;
  }

  // Count total tasks that match the query
  const totalTasks = await Task.countDocuments(query);

  // Get paginated tasks
  const tasks = await Task.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalTasks / limit);

  return NextResponse.json({
    tasks,
    pagination: {
      totalTasks,
      totalPages,
      currentPage: page,
      limit,
    },
  });
}


export async function POST(req: NextRequest) {
  await connect();
//   const userid = "68bc55bcc53efa021e79fe1f"
  const session = await getServerSession(option);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title, description } = await req.json();
  const task = await Task.create({
    title,
    description,
    userId: session.user.id,
  });

  return new NextResponse(JSON.stringify(task), { status: 201 });
}
