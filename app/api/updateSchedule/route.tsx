import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: { json: () => any }) {
  try {
    const body = await request.json();
    const { id, driverId, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into schedule_master table
    const result = await sql`
      UPDATE schedule_master SET driver_id = ${driverId}, status = ${status}
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}
