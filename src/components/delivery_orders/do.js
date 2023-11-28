import React, { useEffect, useState } from "react";

import axios from 'axios';
import TableContainer from "@mui/material/TableContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@mui/styles';
import swal from 'sweetalert';

// React DataTable
import DataTable from 'react-data-table-component';
import TextField from "@mui/material/TextField";

// Modal Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CryptoJS from 'crypto-js';

const useStyles = makeStyles({
    noTableHover: {
      '& tbody tr:hover': {
        background: 'none', // Menghapus latar belakang pada hover
      },
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const drawerWidth = 240;

function Do() {
    const classes = useStyles();
    
    const hariIni = new Date();
    const tanggal = hariIni.getDate();
    const bulanHariIni = hariIni.getMonth() + 1; // Perlu ditambah 1 karena indeks bulan dimulai dari 0
    const tahunHariIni = hariIni.getFullYear();
    const namaBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Format tanggal dengan format "DD/MM/YYYY"
    const tanggalFormat = tanggal + ' ' + namaBulan[hariIni.getMonth()] + ' ' + tahunHariIni;

    const [dataProspek, setDataProspek] = useState([]);
    const [dataProspek2, setDataProspek2] = useState([]);
    const [refreshDt, setRefresh] = useState();
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(0);
    // const [isLoading, setLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    console.log(token);

    const [lsDtCustomer, setLsDtCustomer] = useState([]);
    
    useEffect(() => {
        
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/delivery_orders/list?page=${page}&size=${pageSize}`;
            try {

                const response = await axios.get(url);
                setDataProspek(response.data.data);
                setDataProspek2(response.data);
                setLsDtCustomer(response.data.data);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [page, pageSize, refreshDt]);

    const [rowCountState, setRowCountState] = React.useState(
        dataProspek2?.totalAll || 0
    );

    React.useEffect(() => {
        setRowCountState((prevRowCountState) =>
            dataProspek2?.totalAll !== undefined
                ? dataProspek2?.totalAll
                : prevRowCountState
        );
    }, [dataProspek2?.totalAll, setRowCountState]);

    const alertNotifSend = (event) => {
        swal({
            title: "Reminder berhasil terkirim",
            icon: "success",
            button: "OK",
          });
    }

    // For List Data Customer
    const [searchText, setSearchText] = useState('');
    const customStyles = {
        tableWrapper: {
            overflowX: 'auto', // Memungkinkan pengguliran horizontal
            maxWidth: '100px',  // Maksimal lebar tabel
            borderRadius: "10px"
        },
        rows: {
            style: {
                minHeight: '50px', // override the row height
            },
        },
        headCells: {
            style: {
                background: "#DC2626",
                color: "white",
                textAlign: "center"
            },
        }
    };

    const columnsLsCustomer = [
        {
            name: 'Cabang',
            selector: row => row.cabang_name,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Model Type',
            selector: row => row.model_type,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Tanggal DO',
            selector: row => row.tgl_do,
            sortable: true,
            width: '200px',
        },
        {
            name: 'No Rangka',
            selector: row => row.no_rangka,
            sortable: true,
            width: '200px',
        },
        {
            name: 'No Mesin',
            selector: row => row.no_mesin,
            sortable: true,
            width: '200px',
        }
    ];

    const handleSearch = (text) => {
        setSearchText(text);
    };
    
    // Logika pencarian, memfilter data berdasarkan beberapa kolom
    const filteredData = lsDtCustomer.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );
    
    // Jika searchText kosong, tampilkan semua data
    const displayData = searchText ? filteredData : lsDtCustomer;

    function createBadgeHTML(data) {
        const statusValues = data.status.split(',').map(s => s.trim());
        const badgeHTML = statusValues.map(status => `<span className="badge">${status}</span>`).join(' ');
        
        return badgeHTML;
    }

    // Import Excel
    const [importExcel, setimportExcel] = React.useState(false);
    const showFormImport = (event) => {
        setimportExcel(true);
    }

    const closeImport = (event) => {
        setimportExcel(false);
    }

    const [fileUpload, setFileUp] = React.useState([]);
    const [inputsImport, setInputs] = React.useState([]);

    const hChangeInputFile = (event) => {
        console.log(event.target.files[0]);
        console.log(event.target.name);
        setFileUp(event.target.files[0]);
        setInputs(values => ({...values, [event.target.name]: fileUpload}));
    }

    const CustomBlockingOverlay = ({ isLoading, children }) => {
        return (
            <div>
            {isLoading && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(30, 41, 59, 0.5)',
                  color: "white",
                  fontSize: "20px",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
              >
                <img src="/assets/images/icon_wijaya.png" style={{opacity: 0.8}} alt="" height="50" /><br /><br />
                <p>Please wait...</p>
              </div>
            )}
            {children}
          </div>
        );
    };

    const handleUploadDo = (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        formData.append('fileDo',fileUpload);

        setLoading(true);
        axios.post('http://127.0.0.1:8000/api/delivery_order/import', formData).then(function(response){
            if (response.data.error == true) {
                setLoading(false);
                swal("Error", 'Data tidak boleh kosong!', "error", {
                    buttons: false,
                    timer: 2000,
                });   
            } else {
                setLoading(false);
                swal("Success", 'Data Berhasil disimpan!', "success", {
                    buttons: false,
                    timer: 2000,
                });

                window.location.href = "/do";
            }
        });
    }
    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Delivery Orders</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">List</a></li>
                                    <li className="breadcrumb-item active">Delivery Orders</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className='col-xl-12 col-md-12'>
                        <div className="card overflow-hidden">
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-1 mt-2">
                                                    {/* <label htmlFor="nameInput" className="form-label" style={{fontSize: 12}}>Start Date</label> */}
                                                </div>
                                                <div className="col-lg-3">
                                                    {/* <input type="date" className="form-control" id="nameInput" placeholder="Enter your name" /> */}
                                                </div>
                                                <div className="col-lg-1 mt-2">
                                                    {/* <label htmlFor="nameInput" className="form-label" style={{fontSize: 12}}>End Date</label> */}
                                                </div>
                                                <div className="col-lg-3">
                                                    {/* <input type="date" className="form-control" id="nameInput" placeholder="Enter your name" /> */}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" style={{background: "#CBD5E1", fontSize: "10px"}} className='p-2'>
                                            Tanggal: <b>{tanggalFormat}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                {/* <h5 className="card-title mb-0">List Data Customer</h5> */}
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="card-title mb-0">Master Data Delivery Orders</h5> 
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{padding: "15px"}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            value={searchText}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Search..."
                                            style={{width: "20%"}}
                                        />
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" className='p-2'>
                                            <button className="btn btn-sm btn-info" onClick={showFormImport}><i className=" ri-download-2-fill"></i> Import Excel</button>
                                        </div>
                                    </div>
                                </div>
                                <DataTable
                                    columns={columnsLsCustomer}
                                    data={displayData}
                                    pagination
                                    paginationPerPage={10}
                                    customStyles={customStyles}
                                    defaultSortFieldId={1}
                                    onSearch={handleSearch} // Menambahkan fungsi pencarian
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Start Import  */}
                <Dialog
                        open={importExcel}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth="xl"
                        onClose={closeImport}
                        aria-describedby="alert-dialog-slide-description"
                        style={{ width: "100%", margin: "0 auto" }}
                    >
                        <DialogContent style={{
                            background: "#ecf0f1"
                        }}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="row g-0">
                                            <div className="col-md-12">
                                                <div className="card-header" style={{border: "none"}}>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <h5 className="card-title mb-0" style={{fontSize: "17px"}}>From Import Data Delivery Order </h5>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <CustomBlockingOverlay isLoading={loading}>

                                                            </CustomBlockingOverlay>
                                                            <form>
                                                                {/* <input type="file" name="fileDo" id="fileDo" onChange={hChangeInputFile} required style={{width: "500px"}} className="form-control"></input> */}
                                                                <TextField
                                                                    id="outlined-select-currency-native"
                                                                    defaultValue=""
                                                                    label=""
                                                                    helperText="Pilih File"
                                                                    onChange={hChangeInputFile}
                                                                    sx={{width: "50%"}}
                                                                    size= "small"
                                                                    name="fileDo"
                                                                    type="file"
                                                                    style={{width: "500px"}}
                                                                    required
                                                                >
                                                                </TextField><br></br>
                                                                <button
                                                                    className="btn btn-primary btn-sm mt-2"
                                                                    onClick={handleUploadDo}
                                                                >
                                                                    Proses Import
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                </Dialog>
                {/* End Import */}
            </div>
        </div>
    );
}

export default Do;
