import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse the request body
    const { car_id, start_time, end_time, requestor_id, requestor_info } = body;

    if (
      !car_id ||
      !start_time ||
      !end_time ||
      !requestor_id ||
      !requestor_info
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into schedule_master table
    const result = await sql`
      INSERT INTO schedule_master (car_id, start_time, end_time, requestor_id, requestor_info, status)
      VALUES (${car_id}, ${start_time}, ${end_time}, ${requestor_id}, ${requestor_info}, 'Requested')
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json(
      { error: "Failed to save schedule" },
      { status: 500 }
    );
  }
}
