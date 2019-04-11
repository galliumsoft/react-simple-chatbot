import styled from 'styled-components';
import defaultTheme from '../../theme';

const OptionElement = styled.a`
  background: ${({ theme }) => theme.botBubbleColor};
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: ${({ theme }) => theme.botFontColor};
  display: inline-block;
  font-size: 11px;
  padding: 7px;

  &:hover { opacity: .7; }
`;

OptionElement.defaultProps = {
  theme: defaultTheme,
};

export default OptionElement;
