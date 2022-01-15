import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { NotificationManager } from 'react-notifications';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormControl from '@material-ui/core/FormControl';
// import TextField from '@material-ui/core/TextField';
// import Select from '@material-ui/core/Select';
import { getUserList, setFees, setRole } from "../interface";
import "./styles.css";
import isEmpty from "./isEmpty";
import $ from "jquery";

const columns = [
  {
    id: 1,
    name: "Username",
    selector: (row) => row.username,
    sortable: true,
    reorder: true,
    width: '15%'
  },
  {
    id: 2,
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    reorder: true,
    width: "15%"
  },
  {
    id: 3,
    name: "Wallet",
    selector: (row) => row.wallet,
    sortable: true,
    reorder: true,
  },
  {
    id: 4,
    name: "Selling fee",
    selector: (row) => row.selling_fee,
    sortable: true,
    right: true,
    reorder: true,
    width: '10%'
  },
  {
    id: 5,
    name: "Minting fee",
    selector: (row) => row.minting_fee,
    sortable: true,
    right: true,
    reorder: true,
    width: '10%'
  },
  {
    id: 6,
    name: "Role",
    selector: (row) => row.role,
    sortable: true,
    right: true,
    reorder: true,
    width: '10%'
  }
];

const customStyles = {
  title: {
    style: {
      fontColor: 'red',
      fontWeight: '150',
    }
  },
  rows: {
    style: {
      minHeight: '64px', // override the row height
    }
  },
  headCells: {
    style: {
      fontSize: '17px',
      fontWeight: '300',
      textTransform: 'uppercase',
      paddingLeft: '0 8px'
    },
  },
  cells: {
    style: {
      fontSize: '15px',
      paddingLeft: '0 8px',
    },
    // wallet: {
    //   style: {
    //     minWidth: "250px"
    //   }
    // }
  },
  control: (base, state) => ({
    ...base,
    padding: "10px"
  })
};

const conditionalRowStyles = [
  {
    when: row => row.role === 3,
    style: {
      backgroundColor: 'red',
    },
  },
  {
    when: row => row.role === 1,
    style: {
      backgroundColor: 'green',
    },
  },
  {
    when: row => row.role === 2,
    style: {
      backgroundColor: 'yellow',
    },
  },
];

const Table = () => {
  const [selectedRows, setSelectedRows] = React.useState(false);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(2);
  const [tableData, setTableData] = useState([]);
  var usrList = {}, sellingFee = 0, mintingFee = 0, usrRole = 1;
  const [refreshFlag, setRefreshFlag] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserList();
  }, [refreshFlag]);

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  // Toggle the state so React Data Table changes to clearSelectedRows are triggered
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  }

  async function fetchUserList() {
    usrList = await getUserList();

    if (!isEmpty(usrList)) {
      let tempData = [];
      if (typeof usrList === "object") {
        usrList.map((usr, index) => {
          tempData[index] = {
            "id": usr.id,
            "authorId": usr.author.id,
            "email": usr.email,
            "username": usr.username,
            "wallet": usr.author.wallet ? usr.author.wallet : "",
            "selling_fee": usr.author.selling_fee,
            "minting_fee": usr.author.minting_fee,
            "role": usr.role.name
          };
        })
      }
      setTableData(tempData);
    }
  }

  const applySellingFee = () => {
    sellingFee = $("#SELLING_FEE_input").val();

    if (!sellingFee || (sellingFee < 0 || sellingFee > 100)) {
      NotificationManager.warning('Please insert correct selling fee!', 'Warning');
      return;
    } 
    if (!selectedRows || selectedRows.length <= 0) {
      NotificationManager.warning('Please select items!', 'Warning');
      return;
    }
    
    if (sellingFee >= 0 && sellingFee <= 100) {
      selectedRows.map(async (row, index) => {
        setLoading(true);
        await setFees(row.id, row.authorId, row.wallet, sellingFee, null)
          .then(response => {
            if (response.success) {
              if (response.data && response.data.id === row.authorId) {
                setRefreshFlag(!refreshFlag);
                NotificationManager.success('Successfully set selling fee.', 'Success');
              }
            } else {
              NotificationManager.error(response.status, 'Error');
            }
            setLoading(false);
          }).catch(error => {
            setLoading(false);
            console.log('[Error] = ', error);
          })
      })
    }
  }

  const applyMintingFee = () => {
    mintingFee = $("#MINTING_FEE_input").val();
    
    if (!mintingFee || (mintingFee < 0 || mintingFee > 100)) {
      NotificationManager.warning('Please insert correct minting fee!', 'Warning');
      return;
    }

    if (!selectedRows || selectedRows.length <= 0) {
      NotificationManager.warning('Please select items!', 'Warning');
      return;
    }

    if (mintingFee >= 0 && mintingFee <= 100) {
      selectedRows.map(async (row, index) => {
        setLoading(true);
        await setFees(row.id, row.authorId, row.wallet, null, mintingFee)
          .then(response => {
            if (response.success) {
              if (response.data && response.data.id === row.authorId) {
                setRefreshFlag(!refreshFlag);
                NotificationManager.success('Successfully set minting fee.', 'Success');
              }
            } else {
              NotificationManager.error(response.status, 'Error');
            }
            setLoading(false);
          }).catch(error => {
            setLoading(false);
            console.log('[Error] = ', error);
          })
      })
    }
  }

  const applyRole = () => {
    usrRole = parseInt($("#roles").val());

    if (!selectedRows || selectedRows.length <= 0) {
      NotificationManager.warning('Please select items!', 'Warning');
      return;
    }
    
    if (usrRole === 1 || usrRole === 2 || usrRole === 3) {
      selectedRows.map(async (row, index) => {
        console.log('[Role] = ', usrRole);
        try {
          setLoading(true);
          const res = await setRole(row.id, row.wallet, row.authorId, usrRole);
          if (res.success) {
            if (res.data && res.data.id === row.authorId) {
              NotificationManager.success('Successfully set role.', 'Success', 10000);
            }
            setLoading(false);
            setRefreshFlag(!refreshFlag);
          } else {
            NotificationManager.error(response.status, 'Error');
            setLoading(false);
          }
        } catch(error) {
            setLoading(false);
            console.log('[Error] = ', error);
        }
      });
    }
  }

  return (
    <div className="row" style={{paddingTop: '30px'}}>
      <div className="col-md-6 col-sm-12 offset-md-6">
        <div className="row mb-3">
          <label className="col-md-5 form-label" for="MINTING_FEE">Minting fee (BNB):</label>
          <div className="col-md-5">
            <input type='number' name='MINTING_FEE' id='MINTING_FEE_input' className="form-control" min="0" max="100" />
          </div>
          <div className="col-md-2" style={{textAlign:'right'}}>
            <Button variant="contained" color="primary" onClick={() => applyMintingFee()}>Apply</Button>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 offset-md-6">
        <div className="row mb-3">
          <label className="col-md-5 form-label" for="SELLING_FEE">Selling fee(%):</label>
          <div className="col-md-5">
            <input type='number' name='SELLING_FEE' id='SELLING_FEE_input' className="form-control" min="0" max="100" />
          </div>
          <div className="col-md-2" style={{textAlign:'right'}}>
            <Button variant="contained" color="primary" onClick={() => applySellingFee()}>Apply</Button>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 offset-md-6">
        <div className="row mb-3">
          <label className="col-md-5 form-label">Role:</label>
          <div className="col-md-5">
            <select name="roles" id="roles" className="form-control">
              <option value="2">Public</option>
              <option value="1">Reseller</option>
              <option value="3">Creator</option>
            </select>
          </div>
          <div className="col-md-2" style={{textAlign:'right'}}>
            <Button variant="contained" color="primary" onClick={() => applyRole()}>Apply</Button>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 offset-md-6">
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <div style={{paddingLeft:'10px'}}>
            <Button  variant="contained" color="primary" onClick={() => fetchUserList()}><span>Refresh Table</span></Button>
          </div>
          <div>
            <Button  variant="contained" color="secondary" onClick={() => handleClearRows()}>Clear Selected Rows</Button>
          </div>
        </div>
      </div>
      <DataTable
        title="Fees and Approve"
        columns={columns}
        data={tableData}
        defaultSortFieldId={1}
        sortIcon={<SortIcon />}
        customStyles={customStyles}
        onSelectedRowsChange={handleChange}
        clearSelectedRows={toggledClearRows}
        // conditionalRowStyles={conditionalRowStyles}
        pagination
        selectableRows
      />
      {<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        style={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        open={loading}
      >
        <CircularProgress color="rgb(243, 243, 243)" />
      </Backdrop>}
    </div>
  );
}

export default Table;

