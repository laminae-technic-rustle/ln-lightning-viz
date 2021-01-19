import type { NextApiRequest, NextApiResponse } from "next";
import type { apiResponse, node } from "./types";
import { Option, some, fold } from "fp-ts/Option"
import { pipe } from 'fp-ts/function'

const findNode = (_: (string | string[])): Option<node> => some(["foo", "bar"]);

export default (req: NextApiRequest, res: NextApiResponse<apiResponse<node>>) => {
  let id = req.query.id;
  if (!id) return res.status(400).json({ error: "Specify an ID to find" })

  pipe(
    findNode(id),
    fold(
      () => res.status(404).json({ error: "Not found" }),
      (node) => res.status(200).json({ data: node })
    )
  )
}
