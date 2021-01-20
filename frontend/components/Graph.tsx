import React from "react";
import type { graph } from "shared";
import { fold, none, some, Option } from "fp-ts/option";
import { identity, constant, pipe } from "fp-ts/function";

import dynamic from 'next/dynamic'
const ForceGraph3D = dynamic(() => import('react-force-graph').then(x => x.ForceGraph3D, e => null as never));

interface Props {
  graph: graph;
}

const Graph = ({ graph }: Props) => {
  let [graphComponent, setGraphComponent] = React.useState<Option<JSX.Element>>(none);

  React.useEffect(() => {
    const graphData = {
          nodes: graph.nodes.map(([id]) => ({ id })),
          links: graph.edges.map(([_, source, target]) => ({ source, target })),
    };

    setGraphComponent(some(
      <ForceGraph3D
        nodeColor={"#95dffd"}
        linkColor={"#2c3b7c"}
        nodeOpacity={1}
        linkResolution={1}
        linkOpacity={0.2}
        nodeResolution={3}
        warmupTicks={10}
        cooldownTicks={1}
        numDimensions={3}
        dagMode={"radialout"}
        enablePointerInteraction={false}
        rendererConfig={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        graphData={graphData}
      />
    ))
  }, []);

  return pipe(
    graphComponent,
    fold(
      constant(<>"Only client side"</>),
      identity
    )
  )
};


export default Graph;
