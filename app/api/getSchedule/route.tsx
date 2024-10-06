import { NextResponse, NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const schedules = await sql`
           SELECT 
            sm.id, ci.car_id, ci.car_name, 
            TO_CHAR(sm.start_time, 'YYYY-MM-DD') schedule_date,
            CASE WHEN DATE(sm.start_time) <> DATE(sm.end_time) THEN TO_CHAR(sm.end_time, 'YYYY-MM-DD') ELSE NULL END schedule_date_nxt,
            TO_CHAR(sm.start_time, 'YYYY-MM-DD HH24:MI:SS') start_time, 
            TO_CHAR(sm.end_time, 'YYYY-MM-DD HH24:MI:SS') end_time,
            sm.requestor_id, sm.requestor_info, sm.status,
            di.driver_id, di.driver_name, di.phone_number driver_phone
        FROM schedule_master sm
        LEFT JOIN car_info ci ON sm.car_id = ci.car_id
        LEFT JOIN driver_info di ON di.driver_id = sm.driver_id
        WHERE sm.id = ${id}
    `;
    return NextResponse.json(schedules.rows);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}
