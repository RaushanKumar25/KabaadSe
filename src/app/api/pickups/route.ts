import { NextRequest, NextResponse } from "next/server";
import {
  GET as getHandler,
  POST as postHandler,
  PATCH as patchHandler,
  DELETE as deleteHandler,
} from "@/app/api/pickup/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return getHandler();
}

export async function POST(request: NextRequest) {
  return postHandler(request);
}

export async function PATCH(request: NextRequest) {
  return patchHandler(request);
}

export async function DELETE(request: NextRequest) {
  return deleteHandler(request);
}
