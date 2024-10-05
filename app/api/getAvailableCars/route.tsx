import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  console.log("startDate: " + startDate + ", endDate: " + endDate);

  try {
    // SQL query to get available cars, filtering based on the date range
    const cars = await sql`
        SELECT ci.car_id, ci.car_name
        FROM car_info ci
        LEFT JOIN schedule_master sm ON sm.car_id = ci.car_id
          AND (
            (sm.start_time < ${endDate} AND sm.end_time > ${startDate})
          )
        WHERE ci.status = 'available'
          AND sm.car_id IS NULL 
        GROUP BY ci.car_id
        ORDER BY ci.car_name ASC;
    `;

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching available cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch available cars" },
      { status: 500 }
    );
  }
}
