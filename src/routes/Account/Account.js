import React, { Component } from 'react';
import styles from './Account.less';
import Client from '../../utils/wallet-service/client';
import { getUserAttributes } from '../../services/api';

class Account extends Component {
  state = {
    balances: [],
    user: {},
    showPk: false,
  };

  componentDidMount() {
    this.loadData();
  }

  togglePk = () => this.setState({ showPk: true });

  loadData = async () => {
    const data = await Promise.all([Client.getBalances(), getUserAttributes()]);
    this.setState({ balances: data[0], user: data[1] });
  };

  renderBalanceTokens = () => {
    return this.state.balances.map(bl => (
      <tr key={bl.name + bl.balance}>
        <td className={styles.text}>{bl.name}</td>
        <td className={styles.textRight}>{bl.balance}</td>
      </tr>
    ));
  };

  render() {
    const { balances, user, showPk } = this.state;
    let trxAmount = '0.00000';
    if (balances.length) trxAmount = balances.find(el => el.name === 'TRX').balance;

    return (
      <div>
        <div className={styles.dangerMessage}>
          Do not send TRX from your own wallet or exchange to your testnet address!
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardHeaderTitle}>Account</h2>
          </div>
          <div className={styles.formContent}>
            <div className={styles.row}>
              <div className={styles.space}>
                <h3 className={styles.simpleText}>
                  <b>Address</b>
                </h3>
              </div>
              <div className={styles.column}>
                <h3 className={styles.simpleText}>{user['custom:publickey']}</h3>
                <h3 className={styles.danger}>
                  (Do not send TRX from your own wallet or exchange to the above account address of
                  testnet!)
                </h3>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.space}>
                <h3 className={styles.simpleText}>
                  <b>Private Key</b>
                </h3>
              </div>
              {!showPk ? (
                <button onClick={this.togglePk} className={styles.default}>
                  Show Private Key
                </button>
              ) : (
                <div className={styles.column}>
                  <h3 className={styles.privatekey}>{user['custom:privatekey']}</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.formContent}>
            <h3 className={styles.principal}>TRX Balance</h3>
            <h3 className={styles.number}>{trxAmount}</h3>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardHeaderTitle}>Tokens</h2>
          </div>
          <table className={styles.tokens}>
            <thead>
              <tr className={styles.title}>
                <th className={styles.text}>Name</th>
                <th className={styles.textRight}>Balance</th>
              </tr>
            </thead>
            <tbody>{this.renderBalanceTokens()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Account;
