import { PaginatedData } from "~/models/pagination";
import { pool } from "./client";
import { objectKeyToCamel } from "../key-transformer";

export async function getPaginatedData(
  query: string,
  pageSize: number,
  currentPage: number,
  params?: any[],
): Promise<PaginatedData<any[]>> {
  const client = await pool.connect();

  try {
    await client.query(`
      DROP TABLE IF EXISTS temp;
    `);

    await client.query(
      `
      CREATE TEMPORARY TABLE temp AS
      ${query}  
    `,
      params,
    );

    const dataQry = `
      SELECT * 
      FROM temp
      OFFSET ${currentPage * pageSize} ROWS
      FETCH FIRST ${pageSize} ROWS ONLY
    `;
    const { rows: data } = await client.query(dataQry);

    const {
      rows: [{ count }],
    } = await client.query(`
        SELECT COUNT(*) count
        FROM temp;
      `);

    return {
      data: data.map((d) => objectKeyToCamel(d)),
      pagination: {
        currentPage,
        totalPages: Math.ceil(count / pageSize),
        pageSize,
        totalItems: +count,
      },
    };
  } finally {
    client.release();
  }
}
