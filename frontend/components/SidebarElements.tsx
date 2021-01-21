import styled from 'styled-components'

const LabelTitle = styled.label<{ align?: string, fontsize?: number }>`
  display: block;
  padding-top: 0.5rem;
  padding-bottom: 0;
  text-align: ${(props) => props.align || `center`};
  font-size: ${(props) => `${props.fontsize}rem` || `1rem`};
  width: 100%;
`;

const LabeledElementContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  & div {
    max-width: 50%;
  }
`;
const Label = styled.h4`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 300;
`;
const Value = styled.h4`
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
`;

const Divider = styled.div`
  width: 80%;
  height: 2px;
  margin: 1rem 0;
  align-self: center;
  border-radius: 1px;
  background: rgba(44, 59, 124, 0.2);
`;
const LabeledElement = ({ label, value }: { label: string, value: string }) =>
  <LabeledElementContainer>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </LabeledElementContainer>
export { LabelTitle, LabeledElement, Divider }
