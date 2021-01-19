import type { NextApiRequest, NextApiResponse } from "next";
import type { apiResponse, edge } from "./types";
import { Option, some, fold } from "fp-ts/Option"
import { pipe } from 'fp-ts/function'

const findEdge = (_: (string | string[])): Option<edge> => some(["foo", "bar", "baz"]);

export default (req: NextApiRequest, res: NextApiResponse<apiResponse<edge>>) => {
  let id = req.query.id;
  if (!id) return res.status(400).json({ error: "Specify an ID to find" })

  pipe(
    findEdge(id),
    fold(
      () => res.status(404).json({ error: "Not found" }),
      (edge) => res.status(200).json({ data: edge })
    )
  )
}
