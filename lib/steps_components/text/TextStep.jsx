import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bubble from './Bubble';
import Image from './Image';
import ImageContainer from './ImageContainer';
import Loading from '../common/Loading';
import TextStepContainer from './TextStepContainer';

class TextStep extends Component {
  /* istanbul ignore next */
  state = {
    loading: true,
    promiseText : false
  };

  componentDidMount() {
    const {
      step,
      speak,
      previousValue,
      triggerNextStep,
    } = this.props;
    const { component, delay, waitAction } = step;
    const isComponentWatingUser = component && waitAction;

    if(step.metadata && step.metadata.promise){
      console.log("previousValue : ", previousValue)
      this.setState({ promiseText : true})
      setTimeout(() => {
        this.setState({promiseText : false})
        this.setState({ loading: false }, () => {
          if (!isComponentWatingUser && !step.rendered) {
            triggerNextStep();
          }
          speak(step, previousValue);
        });
      }, 5000);
    }
    else{
      setTimeout(() => {
        this.setState({ loading: false }, () => {
          if (!isComponentWatingUser && !step.rendered) {
            triggerNextStep();
          }
          speak(step, previousValue);
        });
      }, delay);  
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.changedConversation){
      const {
        step,
        speak,
        previousValue,
        triggerNextStep,
      } = nextProps;
      const { component, delay, waitAction } = step;
      const isComponentWatingUser = component && waitAction;
      
      setTimeout(() => {
        this.setState({ loading: false }, () => {
          if (!isComponentWatingUser && !step.rendered) {
            triggerNextStep();
          }
          speak(step, previousValue);
        });
      }, delay);
    }
  }

  getMessage = () => {
    const { previousValue, step } = this.props;
    const { message } = step;

    return message ? message.replace(/{previousValue}/g, previousValue) : '';
  }

  renderMessage = () => {
    const {
      step,
      steps,
      previousStep,
      triggerNextStep,
    } = this.props;
    const { component } = step;

    if (component) {
      return React.cloneElement(component, {
        step,
        steps,
        previousStep,
        triggerNextStep,
      });
    }

    return this.getMessage();
  }

  render() {
    const {
      step,
      isFirst,
      isLast,
      avatarStyle,
      bubbleStyle,
      hideBotAvatar,
      hideUserAvatar,
    } = this.props;
    const { loading, promiseText } = this.state;
    const { avatar, user } = step;

    const showAvatar = user ? !hideUserAvatar : !hideBotAvatar;

    return (
      <TextStepContainer className={`rsc-ts ${user ? 'rsc-ts-user' : 'rsc-ts-bot'}`} user={user}>
        <ImageContainer className="rsc-ts-image-container" user={user}>
          {
            isFirst && showAvatar && (
              <Image
                className="rsc-ts-image"
                style={avatarStyle}
                showAvatar={showAvatar}
                user={user}
                src={avatar}
                alt="avatar"
              />
            )
          }
        </ImageContainer>
        <Bubble
          className="rsc-ts-bubble"
          style={bubbleStyle}
          user={user}
          showAvatar={showAvatar}
          isFirst={isFirst}
          isLast={isLast}
        >
          {loading || promiseText ? <Loading /> : this.renderMessage()}
        </Bubble>
      </TextStepContainer>
    );
  }
}

TextStep.propTypes = {
  avatarStyle: PropTypes.objectOf(PropTypes.any).isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  bubbleStyle: PropTypes.objectOf(PropTypes.any).isRequired,
  hideBotAvatar: PropTypes.bool.isRequired,
  hideUserAvatar: PropTypes.bool.isRequired,
  previousStep: PropTypes.objectOf(PropTypes.any),
  previousValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  speak: PropTypes.func,
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  steps: PropTypes.objectOf(PropTypes.any),
  triggerNextStep: PropTypes.func.isRequired,
};

TextStep.defaultProps = {
  previousStep: {},
  previousValue: '',
  speak: () => {},
  steps: {},
};

export default TextStep;
