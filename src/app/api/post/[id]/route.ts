import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// ✅ GET /api/post/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id },
      // include: { user: true }, // optional
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching post by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch post", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/post/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
       category,
      images,
      video,
      description,
      features,
      rating,
      reviews,
     } = body;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
         ...(category && { category }),
        ...(images && { images }),
        ...(video && { video }),
        ...(description && { description }),
        ...(features && { features }),
        ...(rating !== undefined && { rating }),
        ...(reviews !== undefined && { reviews }),
       },
      include: { user: true }, // optional
    });

    return NextResponse.json(
      { message: "Post updated successfully", post: updatedPost },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/post/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post", details: error.message },
      { status: 500 }
    );
  }
}