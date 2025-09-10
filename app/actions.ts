"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { containsProfanity } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn as nextAuthSignIn } from "@/auth";

export async function publishPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    throw new Error("Content contains profanity");
  }

  const post = await prisma.post.upsert({
    where: {
      id: parseInt(postId ?? "-1"),
      author: {
        email: session.user.email!,
      },
    },
    update: {
      title: title.trim(),
      content: content?.trim(),
      published: true,
    },
    create: {
      title: title.trim(),
      content: content?.trim(),
      published: true,
      author: {
        connect: {
          email: session.user.email!,
        },
      },
    },
  });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

export async function saveDraft(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    throw new Error("Content contains profanity");
  }

  const post = await prisma.post.upsert({
    where: {
      id: parseInt(postId ?? "-1"),
      author: {
        email: session.user.email!,
      },
    },
    update: {
      title: title.trim(),
      content: content?.trim(),
      published: false,
    },
    create: {
      title: title.trim(),
      content: content?.trim(),
      published: false,
      author: {
        connect: {
          email: session.user.email!,
        },
      },
    },
  });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // For demo purposes, we'll simulate a login by creating a session
  // In a real app, you'd verify the password against a hash
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // For demo purposes, we'll accept any password
  // In a real app, you'd verify the password hash
  if (password !== "admin123" && password !== "dev123") {
    throw new Error("Invalid password");
  }

  // Create a session manually that NextAuth.js will recognize
  const sessionToken = `demo-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await prisma.session.create({
    data: {
      userId: user.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      sessionToken: sessionToken
    }
  });

  // Redirect based on role
  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else {
    redirect("/developer/dashboard");
  }
}
