import Head from "next/head";
import React from "react";
import type { graphAndStatistics, nodeId } from "shared";
import { Async } from "../components/Async";
import { Graph } from "../components/Graph";
import { Sidebar } from "../components/Sidebar";
import { fold, none, some, Option } from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";

type element = "node" | "edge";

type options = {
  min: number;
  max: number;
  forceMode: "radialin" | "radialout";
};

type state = {
  hovered: Option<nodeId>;
  selected: Option<nodeId>;
};

const Page = () => {
  const [options, setOptions] = React.useState<Option<options>>(none);
  const [state, setState] = React.useState<state>({
    hovered: none,
    selected: none,
  });

  return (
    <>
      <Head>
        <title>LN Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Async
        url="/graph-with-statistics"
        callback={(data: graphAndStatistics) =>
          setOptions(
            some({
              min: data.statistics.min,
              max: Math.round(data.statistics.average),
              hovered: none,
              selected: none,
              forceMode: "radialin",
            })
          )
        }
        render={(data: graphAndStatistics) => {
          return pipe(
            options,
            fold(constant(<>Loading</>), (options: options) => (
              <>
                <Graph
                  graphAndStatistics={data}
                  options={options}
                  setState={setState}
                />
                <Sidebar
                  statistics={data.statistics}
                  options={options}
                  setOptions={setOptions}
                  state={state}
                />
              </>
            ))
          );
        }}
      ></Async>
    </>
  );
};

export type { options, state, element };
export default Page;
