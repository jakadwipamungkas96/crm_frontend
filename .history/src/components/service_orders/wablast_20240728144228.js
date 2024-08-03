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

function Wablast() {
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
    const [loadingTable, setLoadingTable] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const rulesName = JSON.parse(localStorage.getItem("rules"));
    console.log(token);

    const [lsDtCustomer, setLsDtCustomer] = useState([]);
    
    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/mra/wablast?page=${page}&size=${pageSize}`;
            try {

                const response = await axios.get(url);
                setDataProspek(response.data.data);
                setDataProspek2(response.data);
                setLsDtCustomer(response.data.data);
                setLoadingTable(false);

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
        // headCells: {
        //     style: {
        //         background: "#DC2626",
        //         color: "white",
        //         textAlign: "center"
        //     },
        // }
        headRow: {
            style: {
                background: "linear-gradient(to right, #141e30, #243b55)", // Warna latar belakang untuk thead
                color: "white",      // Warna teks untuk thead
            }
        }
    };

    const columnsLsCustomer = [
        // {
        //     name: 'No Rangka',
        //     // selector: row => <span style={{cursor: "pointer", color: "#2563EB"}} onClick={(event) => { handleOpenFormFu(row); }}>{row.no_rangka}</span>,
        //     selector: row => row.no_rangka,
        //     sortable: true,
        //     width: '200px',
        // },
        {
            name: 'Cabang',
            selector: row => row.cabang_name,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Nama',
            selector: row => row.name,
            sortable: true,
            width: '250px',
        },
        {
            name: 'No Telepon',
            selector: row => row.number,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status WA Blast',
            selector: row => row.status,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Sender',
            selector: row => row.sender,
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

    const handleUploadWaBlast = (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        formData.append('fileWa',fileUpload);
        setLoading(true);
        axios.post('https://api.crm.wijayatoyota.co.id/api/service_order/import_wa', formData).then(function(response){
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

                window.location.href = "/wablast";
            }
        }).catch(function (error) {
            setLoading(false);
            // setimportExcel(false);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                let errorMessage = 'Internal Server Error';
                if (error.response.status === 500) {
                    errorMessage = 'Internal Server Error';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                swal("Error", errorMessage, "error", {
                    buttons: false,
                    timer: 2000,
                });
            } else if (error.request) {
                // The request was made but no response was received
                swal("Error", "No response received from the server", "error", {
                    buttons: false,
                    timer: 2000,
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                swal("Error", error.message, "error", {
                    buttons: false,
                    timer: 2000,
                });
            }
        });
    }

    const [serviceNoRangka, setServiceNorangka] = useState('');
    const [fuDate, setfuDate] = useState('');
    const [fuCustomer, setfuCustomer] = useState('');
    const [fuConfirm, setfuConfirm] = useState('');
    const [fuReason, setfuReason] = useState('');
    const [listReason, setListReason] = useState([]);
    const [fuVerbatim, setfuVerbatim] = useState('');
    const [statusPhone, setstatusPhone] = useState('');
    const [fuBooking, setfuBooking] = useState('');
    const [openFormFU, setOpenFU] = useState(false);
    const [inputFu, setInputFu] = useState(false);

    const handleChangeInputVerbatim = (event) => {
        setfuVerbatim(event.target.value);
        setInputFu((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputReason = (event) => {
        setfuReason(event.target.value);
        setInputFu((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeConfirm = (event) => {
        setfuConfirm(event.target.value);
        setInputFu((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputFuDate = (event) => {
        setfuDate(event.target.value);
        setInputFu((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeStatusPhone = (event) => {
        setstatusPhone(event.target.value);
        setInputFu((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }
    
    const handleChangeBooking = (event) => {
        setfuBooking(event.target.value);
        setInputFu((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleOpenFormFu = (event) => {
        setOpenFU(true);
        setServiceNorangka(event.no_rangka);
        setfuCustomer(event.name);
        setInputFu((values) => ({
            ...values,
            ["no_rangka"]: event.no_rangka,
        }));
    }

    const closeFollowUp = (event) => {
        setOpenFU(false);
        setServiceNorangka('');
    }

    const handleSubmitFu = (event) => {
        console.log(inputFu);
    }

    function getReason() {
        axios.get('https://api.crm.wijayatoyota.co.id/api/list/reason').then(function(response){
            var result = response.data;
            console.log(result);
            setListReason(result.data);
        });
    }

    useEffect(() => {
        getReason();
    }, []);

    const urlDownloadForm = `https://api.crm.wijayatoyota.co.id/api/template_import_wa`; 

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Summary WA Blast</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">List</a></li>
                                    <li className="breadcrumb-item"><a href="#">Services</a></li>
                                    <li className="breadcrumb-item active">Wa Blast</li>
                                </ol>
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
                                        <h5 className="card-title mb-0">Summary WA Blast</h5> 
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
                                            {rulesName == 'mra' || rulesName == 'superadmin' ? (
                                                <>
                                                    <button className="btn btn-sm btn-primary" style={{marginRight: "5px"}} onClick={showFormImport}><i className="ri-add-circle-line"></i> Import WA Blast</button>
                                                </>
                                             ) : ""}
                                        </div>
                                    </div>
                                </div>
                                {loadingTable ? (
                                    <div className="text-center ">
                                        <i className="mdi mdi-spin mdi-loading" style={{fontSize: "30px", color: "#991B1B"}}></i> <h6 className="m-0 loading-text">Please wait...</h6>
                                    </div>
                                ) : (

                                    <DataTable
                                        columns={columnsLsCustomer}
                                        data={displayData}
                                        pagination
                                        paginationPerPage={10}
                                        customStyles={customStyles}
                                        defaultSortFieldId={1}
                                        onSearch={handleSearch} // Menambahkan fungsi pencarian
                                    />

                                ) }
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
                                                            <h5 className="card-title mb-0" style={{fontSize: "17px"}}>From Upload Data WA Blast </h5>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <a href={urlDownloadForm} className="btn btn-sm btn-icon btn-success p-2" style={{ width: "100%", cursor: "pointer" }}><i className="ri-file-excel-fill"></i> Download Template Form</a>
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
                                                                    name="fileWa"
                                                                    type="file"
                                                                    style={{width: "500px"}}
                                                                    required
                                                                >
                                                                </TextField><br></br>
                                                                <button
                                                                    className="btn btn-primary btn-sm mt-2"
                                                                    onClick={handleUploadWaBlast}
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

                {/* Start Input Service Pertama  */}
                <Dialog
                    open={openFormFU}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={closeFollowUp}
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
                                            <div className="card-header" style={{ border: "none" }}>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Follow Up</h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="ribbon ribbon-primary round-shape mb-3">Customer: <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i>{fuCustomer}</span></div>
                                                        <form>
                                                            <div className="row">
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" readOnly value={serviceNoRangka} id="no_rangka" placeholder="No Rangka" />
                                                                        <label htmlFor="no_rangka">No Rangka</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" onChange={handleChangeStatusPhone} value={statusPhone} name="callbyphone" id="callbyphone">
                                                                            <option value={""}>-- Pilih --</option>
                                                                            <option value={'1'}>Connected</option>
                                                                            <option value={'0'}>Not Connected</option>
                                                                        </select>
                                                                        <label htmlFor="statusPhone">Call By Phone</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" onChange={handleChangeBooking} value={fuBooking} name="followup_booking" id="followup_booking">
                                                                            <option value={""}>-- Pilih --</option>
                                                                            <option value={'1'}>Booking</option>
                                                                            <option value={'0'}>Tidak Booking</option>
                                                                        </select>
                                                                        <label htmlFor="fuBooking">Booking Service</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${fuBooking === '1' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" onChange={handleChangeConfirm} value={fuConfirm} name="confirmService" id="confirmService">
                                                                            <option value={""}>-- Pilih --</option>
                                                                            <option value={'come'}>Come</option>
                                                                            <option value={'not'}>Not</option>
                                                                        </select>
                                                                        <label htmlFor="fuBooking">Come or Not ?</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${fuBooking === '0' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm form-select" onChange={handleChangeInputReason} value={fuReason} name="followup_reason" id="followup_reason">
                                                                                <option value={""}>-- Pilih --</option>
                                                                            {listReason.map((value, index) => 
                                                                                <option key={index} value={value.desc}>{value.desc}</option>
                                                                            )}
                                                                        </select>
                                                                        <label htmlFor="fuReason">Reason</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${fuBooking === '0' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" onChange={handleChangeInputVerbatim} value={fuVerbatim} name="followup_verbatim" id="followup_verbatim" />
                                                                        <label htmlFor="fuVerbatim">Verbatim</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${fuBooking === '0' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <input type="date" className="form-control form-control-sm" onChange={handleChangeInputFuDate} value={fuDate} name="followup_date" id="followup_date" />
                                                                        <label htmlFor="fuDate">Plan Follow Up Date</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className="row mt-3">
                                                    <div className="col-lg-6">

                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="text-end">
                                                            <button onClick={handleSubmitFu} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                            <button onClick={closeFollowUp} className="btn btn-danger btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
                                                        </div>
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
                {/* End Input Service Pertama */}
            </div>
        </div>
    );
}

export default Wablast;
