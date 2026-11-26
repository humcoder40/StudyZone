import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isR2Configured, uploadObject } from "@/lib/r2";

export const runtime = "nodejs";

const bodySchema = z.object({
  dataUrl: z.string().min(1),
  purpose: z.string().default("handwriting"),
  filename: z.string().optional(),
});

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } | null {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

export async function GET() {
  return NextResponse.json({
    configured: isR2Configured(),
  });
}

export async function POST(req: Request) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        {
          error:
            "Cloudflare R2 is not configured yet. Add R2_* env vars (see FEATURES.local.md).",
          configured: false,
        },
        { status: 503 },
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Log in to upload files." },
        { status: 401 },
      );
    }

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid upload body" }, { status: 400 });
    }

    const file = parseDataUrl(parsed.data.dataUrl);
    if (!file) {
      return NextResponse.json({ error: "Invalid data URL" }, { status: 400 });
    }
    if (!file.mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }
    if (file.buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (max 8 MB)" }, { status: 400 });
    }

    const ext =
      file.mimeType === "image/png"
        ? "png"
        : file.mimeType === "image/webp"
          ? "webp"
          : "jpg";
    const key = `uploads/${session.user.id}/${parsed.data.purpose}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const uploaded = await uploadObject({
      key,
      body: file.buffer,
      contentType: file.mimeType,
    });

    const asset = await prisma.asset.create({
      data: {
        userId: session.user.id,
        storageKey: uploaded.storageKey,
        mimeType: file.mimeType,
        bytes: file.buffer.length,
        purpose: parsed.data.purpose,
      },
      select: { id: true, storageKey: true, purpose: true, bytes: true },
    });

    return NextResponse.json({
      ok: true,
      asset,
      publicUrl: uploaded.publicUrl,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
