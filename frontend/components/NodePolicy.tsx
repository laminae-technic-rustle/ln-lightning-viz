import React from 'react';
import { LabeledElement  } from './SidebarElements';
import type { nodePolicy } from "shared";
import { boolToYesNo, unixToLocaleDateTime } from '../lib/Helpers';

type Props = {
  policy: nodePolicy,
};

const NodePolicy = ({ policy }: Props) => {
  return (<>
        <LabeledElement label="Last Update" value={unixToLocaleDateTime(policy.last_update)}/>
    <LabeledElement label="Time Lock Delta" value={String(policy.time_lock_delta)} />
    <LabeledElement label="Min HTLC" value={String(policy.min_htlc)} />
    <LabeledElement label="Max HTLC (msat)" value={String(policy.max_htlc_msat)} />
    <LabeledElement label="Fee Base Rate (msat)" value={String(policy.fee_base_msat)} />
    <LabeledElement label="Disabled" value={boolToYesNo(policy.disabled)} />
  </>)
};

export { NodePolicy };
