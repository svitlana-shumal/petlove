import { isAxiosError } from "axios";
import { nextServer } from "./api";
import { FetchFriendsResponse } from "@/types/friends";

export async function fetchFriendsClient(): Promise<FetchFriendsResponse> {
  try {
    const { data } = await nextServer.get<FetchFriendsResponse>("/friends");
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }

      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Fetching friends failed",
      );
    }
    throw new Error("Fetching friends failed");
  }
}
