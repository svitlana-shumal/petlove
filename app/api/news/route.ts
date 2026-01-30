import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") || undefined;

    const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
    const perPage = Number(request.nextUrl.searchParams.get("perPage") ?? 6);
    const response = await api.get("/news", {
      params: { keyword, page, perPage },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 400) {
        return NextResponse.json(
          { error: "News servive not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
