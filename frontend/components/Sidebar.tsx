import React from "react";
import type { metadata, graphAndMetaData, node, edge } from "shared";
import { fold, none, some, Option } from "fp-ts/option";
import { identity, constant, pipe } from "fp-ts/function";

interface Props {
  metadata: metadata;
}

const Sidebar = ({ metadata }: Props) => {
  console.log(metadata);
  return <div>foo</div>
};


export  {Sidebar};
