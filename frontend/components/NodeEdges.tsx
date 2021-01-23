import styled from "styled-components";
import React from "react";
import { LabeledElement, LabelTitle, Divider } from "./SidebarElements";
import { Async } from "./Async";
import { unixToLocaleDateTime } from "../lib/Helpers";
import { NodePolicy } from "./NodePolicy";
import type { nodeId, jsonEdge } from "shared";

type Props = {
  nodeId: nodeId;
};

const Container = styled.div`
  background-color: #efefef;
  border-radius: 0.5rem;
  padding: 0.25rem 1rem;
`;

const EdgeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NodeEdges = ({ nodeId }: Props) => {
  const component = React.useMemo<JSX.Element>(
    () => (
      <Async
        url={`/node/${nodeId}/edges`}
        render={(edges: Array<jsonEdge>) => (
          <Container>
            <h3> Channels ({edges.length})</h3>
            {edges.map((edge, i) => {
              return (
                <EdgeContainer key={edge.channel_id}>
                  <LabelTitle align="left">Details</LabelTitle>
                  <LabeledElement
                    label="Last Update"
                    value={unixToLocaleDateTime(edge.last_update)}
                  />
                  <LabeledElement label="Channel Id" value={edge.channel_id} />
                  <LabeledElement
                    label="Channel Point"
                    value={edge.chan_point}
                  />
                  <LabeledElement label="Node 1" value={edge.node1_pub} />
                  <LabeledElement label="Node 2" value={edge.node2_pub} />
                  <LabeledElement
                    label="Capacity"
                    value={String(edge.capacity)}
                  />
                  <LabelTitle align="left">Policies</LabelTitle>
                  {/* 
                 I would have much preferred to use optional values for 
                 the node policies as well. But as there is no explicit
                 JSON decoding step, that makes it tricky / more verbose.
              */}
                  <LabelTitle align="left" fontsize={0.8}>
                    Node 1
                  </LabelTitle>
                  {edge.node1_policy ? (
                    <NodePolicy policy={edge.node1_policy} />
                  ) : (
                    <p>No policy</p>
                  )}
                  <LabelTitle align="left" fontsize={0.8}>
                    Node 2
                  </LabelTitle>
                  {edge.node2_policy ? (
                    <NodePolicy policy={edge.node2_policy} />
                  ) : (
                    <p>No policy</p>
                  )}

                  {i < edges.length - 1 && <Divider />}
                </EdgeContainer>
              );
            })}
          </Container>
        )}
      ></Async>
    ),
    [nodeId]
  );
  return component;
};

export { NodeEdges };
