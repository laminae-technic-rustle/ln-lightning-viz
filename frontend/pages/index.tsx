import Head from "next/head";
import React from "react";
import type { graphAndMetaData, node, edge } from "shared";
import { Async } from "../components/Async";
import { Graph } from "../components/Graph";
import { Sidebar } from "../components/Sidebar";
import { fold, none, some, Option } from "fp-ts/option";

type viewState = {
  min: number,
  max: number
};

const Page = () => {
  const [options, setOptions] = react.useState<Option<viewState>>(none);

  return (
    <>
      <Head>
        <title>LN Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Async url="/graph-with-metadata"
        render={(data: graphAndMetaData) =>
          {
            return (<>
              <Graph graphAndMetaData={data.graph}
                min={data.metadata.min}
                max={data.metadata.max} />
              <Sidebar metadata={data.metadata}/>
            </>)
        }
        }>
      </Async>


    </>
  );
};

export default Page;
