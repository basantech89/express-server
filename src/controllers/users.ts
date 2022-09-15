import { Request, Response } from 'express'

import dbClient from '../utils/db'

const getUsers = async (req: Request, res: Response) => {
  try {
    const { rows } = await dbClient.query(`SELECT user_id, first_name, last_name, email FROM users`)
    return res.status(200).json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error.' })
  }
}

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id
    const { rows } = await dbClient.query(
      `SELECT user_id, first_name, last_name, email FROM users WHERE user_id = $1;`,
      [userId]
    )
    return res.status(200).json({ success: true, data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error.' })
  }
}

export { getUser, getUsers }
