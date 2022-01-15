/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import styled, { css } from 'styled-components';

const Block = styled.div`
  .icon-shape {
    width: 100%;
    position: relative;
    margin-bottom: 34px;
    background: #ffffff;
    padding: 19px 30px 30px 30px;
    box-shadow: 0 2px 4px 0 #e3e9f3;
    border-radius: 3px;
    line-height: 18px;
    font-size: 25px;
  }
  .icon {
    width: 3rem;
    height: 3rem;
  }
  .card {
    border-radius: 1.25rem !important;
  }
  .card-body {
    padding: 2.25rem;
  }

  .card-body .icon-shape svg {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 10px;
    right: 13px;
  }
`;
function commafy( num ) {
  var str = num.toString().split('.');
  if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

const Header = (props) => {
  return (
    <div style={{paddingTop: '20px'}}>
      <div className="header bg-gradient-info pb-8 pt-1 pt-md-8">
        <Block>
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className="text-uppercase text-muted mb-0"
                        >
                          TOTAL USERS
                        </CardTitle>
                        <span className="h1 font-weight-bold mb-0">
                          {commafy(props.users)}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fa fa-user-friends" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className="text-uppercase text-muted mb-0"
                        >
                          TOTAL NFTs
                        </CardTitle>
                        <span className="h1 font-weight-bold mb-0">{commafy(props.nfts)}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fa fa-images" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fa fa-arrow-down" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last week</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className="text-uppercase text-muted mb-0"
                        >
                          TOTAL BNB BALANCE
                        </CardTitle>
                        <span className="h1 font-weight-bold mb-0">{commafy(props.bnbBalance)} BNB</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fa fa-donate" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fa fa-arrow-down" /> 1.10%
                      </span>{" "}
                      <span className="text-nowrap">Since yesterday</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className="text-uppercase text-muted mb-0"
                        >
                          TOTAL SPC BALANCE
                        </CardTitle>
                        <span className="h1 font-weight-bold mb-0">{commafy(props.nftBalance)} SPC</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fa fa-dollar-sign" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
        </Block>
      </div>
    </div>
  );
};

export default Header;
