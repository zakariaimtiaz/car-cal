import { sql } from "@vercel/postgres";

export async function initializeDb() {
  try {
    // SQL query to create car_info table
    await sql`
      CREATE TABLE IF NOT EXISTS car_info (
        car_id SERIAL PRIMARY KEY,
        car_name VARCHAR(100) NOT NULL,
        car_type VARCHAR(50),
        license_plate VARCHAR(20) NOT NULL UNIQUE,
        capacity INT NOT NULL,
        fuel_type VARCHAR(20),
        status VARCHAR(20) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // SQL query to create driver_info table
    await sql`
      CREATE TABLE IF NOT EXISTS driver_info (
        driver_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        license_number VARCHAR(50) NOT NULL UNIQUE,
        phone_number VARCHAR(15) NOT NULL,
        email VARCHAR(100),
        status VARCHAR(20) DEFAULT 'active',
        hire_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // SQL query to create car_driver_mapping table
    await sql`
      CREATE TABLE IF NOT EXISTS car_driver_mapping (
        mapping_id SERIAL PRIMARY KEY,
        car_id INT NOT NULL,
        driver_id INT NOT NULL,
        assigned_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_car
          FOREIGN KEY (car_id)
          REFERENCES car_info(car_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_driver
          FOREIGN KEY (driver_id)
          REFERENCES driver_info(driver_id)
          ON DELETE CASCADE
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS schedule_master (
        id SERIAL PRIMARY KEY,
        car_id INT NOT NULL,
        driver_id INT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log(
      "Tables car_info, driver_info, and car_driver_mapping created or already exist"
    );
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}
