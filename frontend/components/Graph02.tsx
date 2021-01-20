import React from "react";
import type { graphAndMetaData, node, edge } from "shared";
import { fold, none, some, Option } from "fp-ts/option";
import { identity, constant, pipe } from "fp-ts/function";

import dynamic from 'next/dynamic'
const ForceGraph3D = dynamic(() => import('react-force-graph').then(x => x.ForceGraph3D, e => null as never));

interface Props {
  graphAndMetaData: graphAndMetaData;
  min: number,
    max: number
}

// Three filters
// Big Daddy's --> More than x connections
// Median --> Average connections
// Lone Rangers --> Less than x connections

const Graph = ({ graphAndMetaData, min, max }: Props) => {
  const { graph, metadata } = graphAndMetaData;
  let [graphComponent, setGraphComponent] = React.useState<Option<JSX.Element>>(none);

  React.useEffect(() => {
    const included: { [key: string]: boolean } = {};
    for (let [key, value] of Object.entries(metadata.nodeConnections)) {
      included[key] = value >= min && value <= max;
    };

    const nodes: Array<{id: string}> = [];
    for (let [id, _] of graph.nodes) {
      if(included[id]) {
        nodes.push({id});
      }
    };
    
    const links: Array<{source: string, target: string}> = [];
    for (let [_, source, target] of graph.edges) {
      if(included[source] && included[target]) {
        links.push({source, target});
      }
    };

    const graphData = {
      nodes,
      links
    };

    setGraphComponent(some(
      <ForceGraph3D
        linkColor={"#2c3b7c"}
        nodeOpacity={1}
        nodeAutoColorBy={"#95dffd"}
        linkVisibility={true}
        linkCurvature={0.1}
        nodeResolution={6}
        nodeRelSize={graphData.nodes.length / 150}
        warmupTicks={25}
        cooldownTicks={1}
        numDimensions={3}
        dagMode={"radialin"}
        onNodeClick={(n, _) => alert(n.id)}
        enablePointerInteraction={true}
        enableNodeDrag={false}
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
