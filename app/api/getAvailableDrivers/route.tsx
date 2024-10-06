import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  try {
    // SQL query to get available drivers, filtering based on the date range
    const drivers = await sql`
        SELECT di.driver_id, di.driver_name
        FROM driver_info di
        LEFT JOIN schedule_master sm ON sm.driver_id = di.driver_id AND sm.status <> 'Rejected'
          AND (
            (sm.start_time < ${endDate} AND sm.end_time > ${startDate})
          )
        WHERE di.status = 'active'
          AND sm.driver_id IS NULL 
        GROUP BY di.driver_id
        ORDER BY di.driver_name ASC;
    `;

    return NextResponse.json(drivers);
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    return NextResponse.json(
      { error: "Failed to fetch available drivers" },
      { status: 500 }
    );
  }
}
