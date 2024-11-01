import { PaginatedData } from "~/ts-type/models/pagination";
import { pool } from "./client";
import { objectKeyToCamel } from "../key-transformer";

export async function getPaginatedData<T extends T[] = any[]>(
  query: string,
  pageSize: number,
  currentPage: number,
  params?: any[],
): Promise<PaginatedData<T>> {
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
      data: data.map((d) => objectKeyToCamel(d)) as T,
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
