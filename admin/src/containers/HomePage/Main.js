/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import { Container } from './components';
import Header from "./Header.js";
import { getTotalUser, getTotalNFTs, getTotalBalance, getActivity } from "../interface";

var defLineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'This Year',
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'rgba(243, 183, 31, 1)',
      borderColor: 'rgba(243, 183, 31, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 1,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(243, 183, 31, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(243, 183, 31, 1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      pointHitRadius: 10,
      data: []
    },
    {
      label: 'Last Year',
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'rgba(243, 183, 31, 0.3)',
      borderColor: 'rgba(243, 183, 31, 0.3)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 1,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(243, 183, 31, 0.3)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(243, 183, 31, 0.3)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      pointHitRadius: 10,
      data: []
    }
  ]
};

const Index = (props) => {

  const [users, setUsers] = useState(0);
  const [nfts, setNFTs] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [nftBalance, setNftBalance] = useState(0);
  const [lineActData, setLineActData] = useState(null);
  const [lineBNBData, setLineBNBData] = useState(null);
  const [lineSPCData, setLineSPCData] = useState(null);

  const fetchData = async () => {
    const users = await getTotalUser();
    const nfts = await getTotalNFTs();
    const bnbBalance = await getTotalBalance('BNB');
    const nftBalance = await getTotalBalance('SPC');
    setUsers(users);
    setNFTs(nfts);
    setBnbBalance(bnbBalance.price.toFixed(6));
    setNftBalance(nftBalance.price);
    await fetchActivity();
    await fetchBNB();
    await fetchSPC();
  }

  const fetchActivity = async () => {
    const activity = await getActivity('act');
    let data = activity.this_year.map(value => Object.values(value));
    let this_year = data[0];
    data = activity.last_year.map(value => Object.values(value));
    let last_year = data[0];
    data = activity.this_month.map(value => Object.values(value));
    let this_month = parseInt(data[0]);
    this_year.splice(this_month, 12 - this_month);

    defLineData.datasets[0].data = this_year;
    defLineData.datasets[1].data = last_year;
    setLineActData(defLineData);
  }

  const fetchBNB = async () => {
    const activity = await getActivity('BNB');
    let data = activity.this_year.map(value => Object.values(value));
    let this_year = data[0];
    data = activity.last_year.map(value => Object.values(value));
    let last_year = data[0];
    data = activity.this_month.map(value => Object.values(value));

    let this_month = parseInt(data[0]);
    this_year.splice(this_month, 12 - this_month);

    defLineData.datasets[0].backgroundColor = 'rgba(75,192,192,1)';
    defLineData.datasets[0].borderColor = 'rgba(75,192,192,1)';
    defLineData.datasets[0].pointBorderColor = 'rgba(75,192,192,1)';
    defLineData.datasets[0].pointHoverBackgroundColor = 'rgba(75,192,192,1)';
    
    defLineData.datasets[1].backgroundColor = 'rgba(75,192,192,0.4)';
    defLineData.datasets[1].borderColor = 'rgba(75,192,192,0.4)';
    defLineData.datasets[1].pointBorderColor = 'rgba(75,192,192,0.4)';
    defLineData.datasets[1].pointHoverBackgroundColor = 'rgba(75,192,192,0.4)';

    defLineData.datasets[0].data = this_year;
    defLineData.datasets[1].data = last_year;
    setLineBNBData(defLineData);
  }

  const fetchSPC = async () => {
    const activity = await getActivity('SPC');
    let data = activity.this_year.map(value => Object.values(value));
    let this_year = data[0];
    data = activity.last_year.map(value => Object.values(value));
    let last_year = data[0];
    data = activity.this_month.map(value => Object.values(value));
    let this_month = parseInt(data[0]);
    this_year.splice(this_month, 12 - this_month);

    defLineData.datasets[0].backgroundColor = 'rgba(220,53,69,1)';
    defLineData.datasets[0].borderColor = 'rgba(220,53,69,1)';
    defLineData.datasets[0].pointBorderColor = 'rgba(220,53,69,1)';
    defLineData.datasets[0].pointHoverBackgroundColor = 'rgba(220,53,69,1)';
    
    defLineData.datasets[1].backgroundColor = 'rgba(220,53,69,0.4)';
    defLineData.datasets[1].borderColor = 'rgba(220,53,69,0.4)';
    defLineData.datasets[1].pointBorderColor = 'rgba(220,53,69,0.4)';
    defLineData.datasets[1].pointHoverBackgroundColor = 'rgba(220,53,69,0.4)';

    defLineData.datasets[0].data = this_year;
    defLineData.datasets[1].data = last_year;
    setLineSPCData(defLineData);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Container className="container-fluid" style={{paddingTop:'0px'}}>
        <Header users={users} nfts={nfts} bnbBalance={bnbBalance} nftBalance={nftBalance} />
        <div className="row" style={{paddingTop: '20px'}}>
          <div className="col-lg-4 col-md-12 col-sm-12">
            <h3>Activity</h3>
            {lineActData && (
              <Line 
              data={lineActData}
            /> )}
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="chart">
              <h3>BNB Balance</h3>
              {lineBNBData && (
                <Line 
                data={lineBNBData}
            /> )}
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="chart">
              <h3>SPC Balance</h3>
              {lineSPCData && (
              <Line 
                data={lineSPCData}
            /> )}
            </div>
          </div>
        </div>
      </Container>
      
    </>
  );
};

export default memo(Index);
