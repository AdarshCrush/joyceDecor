 


import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      title,
       category,
      images,
      video,
      description,
      features,
      rating,
      reviews,
      userId, // ✅ you’re passing this from frontend
    } = data;

    if (!title  || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Create new Post and connect User (if provided)
    const newPost = await prisma.post.create({
      data: {
        title,
         category,
        images: images ?? [],
        video: video ?? [],
        description,
        features: features ?? [],
        rating,
        reviews,
        ...(userId && { user: { connect: { id: userId } } }), // ✅ connect user
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
