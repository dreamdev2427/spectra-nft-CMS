/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { NotificationContainer } from 'react-notifications';
import PageTitle from '../../components/PageTitle';
import { Container } from './components';
import Main from "./Main.js";
import TableView from "./TableView";
import { loadWeb3, connectWallet, getCurrentWallet, getOwner } from "../interact";
import 'react-notifications/lib/notifications.css';

const HomePage = ({ history: { push } }) => {
  const [wallet, setWallet] = useState('');
  const [owner, setOwner] = useState('');

  useEffect(() => {
    const loadWallet = async () => {
      await loadWeb3();
    }
    
    async function getExistingWallet() {
      const { account } = await getCurrentWallet();
      const { owner } = await getOwner();
      setWallet(account);
      setOwner(owner);
      addWalletListener();
    }

    loadWallet();
    getExistingWallet();
  }, [wallet]);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
      window.ethereum.on("connect", async (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    }
  }
  
  const connectWeb3Wallet = async () => {
    if (!wallet) {
      await connectWallet();
    }
  }


  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title={title} />}
      </FormattedMessage>
      
      <Container className="container-fluid">
        <div className='row'>
          <div className='col-md-6 offset-md-6'>
            { !wallet && (
              <div style={{textAlign: 'right'}}>
                <button type="button" className="btn btn-primary" style={{padding: '10px'}} onClick={connectWeb3Wallet}>Connect Wallet</button>
              </div>
            )}
            { owner && owner !== wallet && (
                <div className='alert alert-danger' style={{textAlign: 'right'}}>Admin Wallet: {owner}</div>
              )
            }
            { wallet && (
                <div className='alert alert-success' style={{textAlign: 'right'}}>Connected Wallet: {wallet}</div>
              )
            }
          </div>
        </div>
        <Main />
        <TableView />
      </Container>
      <NotificationContainer/>
    </>
  );
};

export default memo(HomePage);
