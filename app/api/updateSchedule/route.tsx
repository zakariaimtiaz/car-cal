import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse the JSON body from the request
    const { id, startTime, endTime, status, carId, driverId } = body;

    // Insert into schedule_master table
    const result = await sql`
      UPDATE schedule_master SET start_time = ${startTime}, end_time = ${endTime}, 
      status = ${status}, car_id = ${carId}, driver_id = ${driverId}
      WHERE id = ${id} AND status = 'Requested' 
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
