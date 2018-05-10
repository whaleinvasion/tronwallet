import React, { Component } from 'react';
import * as QRCode from 'qrcode';
import QRCodeCard from '../QRCode/QRCode';
import styles from './Send.less';
import { Client, ONE_TRX } from '../../utils/wallet-service/client';
import isAddressValid from '../../utils/wallet-service/utils/address';

class Send extends Component {
  state = {
    to: null,
    amount: '0.0000',
    token: 'TRX',
    transaction: {
      loading: false,
      status: false,
      qrcode: null,
      error: null,
    },
  };

  isToValid = () => {
    const { to } = this.state;
    return to === null ? true : isAddressValid(to);
  };

  handleAmountChange = e => {
    const amount = e.target.value;
    if (amount < 0) return;
    this.setState({ amount });
  };

  isAmountValid = () => {
    const { amount } = this.state;
    const accountAmount = 100000;
    // lógica de pegar a balance
    if (amount === '0.0000') return true;
    if (amount > 0 && amount <= accountAmount) return true;
    if (Number(amount) === 0 || amount === '') return false;

    return false;
  };

  handleSend = async () => {
    const { amount, transaction, to, token } = this.state;
    const from = '27jbj4qgTM1hvReST6hEa8Ep8RDo2AM8TJo';

    this.setState({ transaction: { ...transaction, loading: true } });
    const TransactionData = await Client.send({ from, to, token, amount: amount * ONE_TRX });
    const updatedTransaction = { ...transaction };

    if (TransactionData) {
      const qrcode = await QRCode.toDataURL(TransactionData);
      updatedTransaction.status = true;
      updatedTransaction.qrcode = qrcode;
    } else {
      updatedTransaction.status = false;
      updatedTransaction.error = 'Something wrong with the Transaction';
    }
    updatedTransaction.loading = false;
    this.setState({ transaction: updatedTransaction });
  };

  handleBack = () => {
    const { transaction } = this.state;
    this.setState({ transaction: { ...transaction, status: false, qrcode: '', error: null } });
  };

  render() {
    const { transaction, to, amount } = this.state;
    const amountValid = this.isAmountValid();
    const toValid = this.isToValid();
    const canSend = toValid && amountValid && to !== null && amount > 0;

    if (transaction.status) {
      return (
        <QRCodeCard title="Send TRX" message="Succesfully sent!" qrcode={transaction.qrcode}>
          <button onClick={this.handleBack} className={styles.button}>
            Make another transaction
          </button>
        </QRCodeCard>
      );
    }
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardHeaderTitle}>Send TRX</h2>
        </div>
        <div className={styles.formContent}>
          <div className={styles.form}>
            <h3>To</h3>
            <input
              className={[styles.formControl, toValid ? null : styles.invalidInput].join(' ')}
              onChange={e => this.setState({ to: e.target.value })}
              type="text"
              name="to"
              id="to"
            />
            <div className={styles.invalid}>{!toValid && 'Put a valid address'}</div>
            <h3>Token</h3>
            <div className={styles.selectWrapper}>
              <select
                onChange={e => this.setState({ token: e.target.value })}
                className={styles.selectBox}
              >
                <option value="TRX">TRX (10000 available)</option>
              </select>
            </div>
            <h3>Amount</h3>
            <input
              className={[styles.formControl, amountValid ? null : styles.invalidInput].join(' ')}
              onChange={this.handleAmountChange}
              value={this.state.amount}
              type="number"
              name="amount"
              id="amount"
              placeholder="0.0000"
            />
            <div className={styles.invalid}>
              {!amountValid && 'Insufficient tokens or invalid amount'}
            </div>
            <div className={styles.messageContent}>
              <h2 className={styles.message}>
                Only enter valid TRON wallet address. Incorrect addresses can lead to TRX loss.
              </h2>
            </div>
            <h3 className={styles.messageError}>{transaction.error}</h3>
            <button
              disabled={transaction.loading || !canSend}
              onClick={this.handleSend}
              className={[
                styles.button,
                !canSend || transaction.loading ? styles.disabled : null,
              ].join(' ')}
            >
              {transaction.loading ? 'Processing transaction' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Send;
