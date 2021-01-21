import styled from 'styled-components';
import React from 'react';
import { LabeledElement, LabelTitle, Divider } from './SidebarElements';
import { Async } from './Async';
import { boolToYesNo, unixToLocaleDateTime } from '../lib/Helpers';
import type { nodeId, jsonNode } from "shared";

type Props = {
  nodeId: nodeId,
};

const Container = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
`;

const Node = ({ nodeId }: Props) => {
  const component = React.useMemo<JSX.Element>(() => (<Async url={`/node/${nodeId}`}
    render={(node: jsonNode) =>
    (
      <Container>
        <Divider />
        <h3> Node: {node.alias} </h3>
        <LabelTitle align="left">Details</LabelTitle>
        <LabeledElement label="Last Update" value={unixToLocaleDateTime(node.last_update)}/>
        <LabeledElement label="Public Key" value={node.pub_key} />
        <LabelTitle align="left">Networks</LabelTitle>
        {node.addresses.map(network =>
          <LabeledElement key={network.addr} label={network.network} value={network.addr} />
        )}
        <LabelTitle align="left">Features (required | known)</LabelTitle>
        {Object.values(node.features)
          .filter(({name}) => name !== "unknown")
          .map((feature) =>
          <LabeledElement key={feature.name} label={feature.name} value={`${boolToYesNo(feature.is_required)} || ${boolToYesNo(feature.is_known)}`} />
        )}
      </Container>
    )
    }>
  </Async>), [nodeId]);

  return component;
};

export { Node };
