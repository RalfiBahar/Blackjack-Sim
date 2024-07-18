import { NextRequest, NextResponse } from "next/server";
import { refreshCache } from "../../services/fileCacheManager";

export async function GET(req: NextRequest) {
  try {
    await refreshCache();
    return NextResponse.json(
      { message: "Cache refreshed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing cache:", error);
    return NextResponse.json(
      { error: "Failed to refresh cache" },
      { status: 500 }
    );
  }
}
