import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { api } from "../api";

export async function GET() {
  try {
    const response = await api.get("/friends");
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: "Friends service not found" },
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
