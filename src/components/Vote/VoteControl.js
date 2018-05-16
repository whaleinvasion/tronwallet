import React, { Component } from 'react';
import { Button, Affix, Card } from 'antd';
import styles from './index.less';

const { Meta } = Card;

class VoteControl extends Component {
  static defautlProps = {
    totalRemaining: 0,
    totalTrx: 0,
    onStartVote: () => {},
  };

  state = {
    // isVotting: false,
    affix: false,
  };

  onStartClick = () => {
    // this.setState({ isVotting: true }, this.props.onStartVote);
  };

  onChangeAffix = affix => this.setState({ affix });

  renderSubmitButton = () => {
    const { totalRemaining, totalTrx, onSubmit } = this.props;

    if (totalRemaining < 0) {
      return (
        <Button type="primary" disabled>
          SUBMIT
        </Button>
      );
    }
    return (
      <Button
        type="primary"
        onClick={onSubmit}
        disabled={Number(totalTrx) === Number(totalRemaining)}
        icon="check-circle-o"
      >
        SUBMIT
      </Button>
    );
  };

  renderSubmit = () => {
    const { totalRemaining, onResetVotes } = this.props;
    const { affix } = this.state;
    const affixStyle = affix ? { position: 'absolute' } : null;
    return (
      <Affix offsetTop={0} style={affixStyle} onChange={this.onChangeAffix}>
        <Card style={{ width: 350 }}>
          <Meta
            title={
              <h1 className={totalRemaining < 0 ? styles.totalRemainingDanger : ''}>
                {Number(totalRemaining).toLocaleString()}
              </h1>
            }
            description="Votes Remaining"
          />
          <div className={styles.containerVoteButtons}>
            <Button
              size="large"
              onClick={() => onResetVotes(null)}
              icon="close-circle-o"
              style={{ marginRight: 5 }}
            >
              RESET
            </Button>
            {this.renderSubmitButton()}
          </div>
        </Card>
      </Affix>
    );
  };

  renderStart = () => (
    <Button type="danger" size="large" onClick={this.onStartClick}>
      START VOTING
    </Button>
  );

  render() {
    // const { isVotting } = this.state;
    return (
      <div className={styles.voteControl}>
        {/* {isVotting ? this.renderSubmit() : this.renderStart()} */}
        {this.renderSubmit()}
      </div>
    );
  }
}

export default VoteControl;
