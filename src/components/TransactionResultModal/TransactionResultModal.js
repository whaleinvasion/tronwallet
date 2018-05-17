import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './TransactionResultModal.less';

class TransactionQRCode extends Component {
  componentWillReceiveProps(nextProps) {
    // Only Update values if transaction is successful
    if (nextProps.transaction && nextProps.transaction.result) {
      this.props.dispatch({
        type: 'user/fetchWalletData',
      });
    }
  }
  renderContracts = () => {
    const { contracts } = this.props.transaction;
    if (!contracts) return;
    const contractsElements = [];
    for (const ctr in contracts[0]) {
      if (ctr === 'amount') {
        contractsElements.push(
          <h3>
            {ctr} : {contracts[0][ctr] / 1000000}
          </h3>
        );
      } else {
        contractsElements.push(
          <h3>
            {ctr} : {contracts[0][ctr]}
          </h3>
        );
      }
    }
    return contractsElements;
  };

  render() {
    const { visible, onClose } = this.props;
    const { result, timestamp } = this.props.transaction;
    const footerButton = (
      <button className={styles.button} onClick={onClose}>
        {'Ok'}
      </button>
    );

    return (
      <Modal
        visible={visible}
        title="Last transaction"
        onCancel={onClose}
        onOk={onClose}
        footer={footerButton}
      >
        <div>
          <h2>
            Your last transaction was
            {result ? (
              <strong className={styles.success}> successful</strong>
            ) : (
              <strong className={styles.fail}> not successful</strong>
            )}
          </h2>
          <p>{moment(timestamp / 1000000).format('MM/DD/YYYY HH:MM:SS')}</p>
        </div>
        <div>{this.renderContracts()}</div>
      </Modal>
    );
  }
}

export default connect(({ monitor }) => ({
  transaction: monitor.transaction,
}))(TransactionQRCode);