import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const password = searchParams.get("password");

  const apiUrl =
    "http://devs.apps.friendship.ngo:8080/appsvault-api/user/get-by-username-password?appsId=2&username=" +
    username +
    "&password=" +
    password;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "V2kGIwEJs4oko7aXfYJiq8WzVnwEOC9oKzMobU16M4zj0fMLQlwcxpt0uT8a2096YmrTJzgc9j7IRDMWTJfXSEZQ4mpldesy",
      },
    });

    const responseBody = await response.text();

    if (response.ok) {
      return NextResponse.json(JSON.parse(responseBody), {
        status: 200,
      });
    } else {
      return NextResponse.json(
        { message: "Login failed. Please check your username and password." },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "An error occurred during login." },
      { status: 500 }
    );
  }
}
