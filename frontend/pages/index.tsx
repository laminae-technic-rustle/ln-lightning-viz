import Head from "next/head";
import React from "react";
import type { graphAndMetaData, node, edge } from "shared";
import { Async } from "../components/Async";
import { Graph } from "../components/Graph";
import { Sidebar } from "../components/Sidebar";
import { fold, none, some, Option } from "fp-ts/option";
import { constant, pipe } from "fp-ts/function";

type options = {
  min: number,
  max: number
  forceMode: "radialin" | "radialout";
};

const Page = () => {
  const [options, setOptions] = React.useState<Option<options>>(none);

  return (
    <>
      <Head>
        <title>LN Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Async url="/graph-with-metadata"
        callback={(data: graphAndMetaData) =>
          setOptions(some({
            min: data.metadata.min,
            max: data.metadata.max,
            forceMode: "radialin"
          }))
        }
        render={(data: graphAndMetaData) => {
          return pipe(
            options,
            fold(
              constant(<>Loading</>),
              (options: options) => <>
                <Graph graphAndMetaData={data}
                  options={options} />
                <Sidebar metadata={data.metadata}
                  options={options}
                  setOptions={setOptions}
                />
              </>
            )
          )

        }
        }>
      </Async>


    </>
  );
};

export type { options };
export default Page;
