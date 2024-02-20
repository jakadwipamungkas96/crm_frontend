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

function Attacklist() {
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
    const idCab = JSON.parse(localStorage.getItem("id_cabang"));
    console.log(token);

    const [lsDtCustomer, setLsDtCustomer] = useState([]);

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/mra/attacklist?page=${page}&size=${pageSize}`;
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
        {
            name: 'No Rangka',
            selector: row => <span style={{ cursor: "pointer", color: "#2563EB" }} onClick={(event) => { handleOpenFormFu(row); }}>{row.no_rangka}</span>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Plan Re Follow Up Date',
            selector: row => row.re_follow_up_date,
            sortable: true,
            width: '250px',
        },
        {
            name: 'No Telepon',
            selector: row => row.no_telp,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status WA Blast',
            selector: row => {
                if (row.status_fu == 1) {
                    return <span className="badge bg-success-subtle text-success">Done</span>
                } else {
                    return <span className="badge bg-danger-subtle text-danger">Not</span>
                }
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status Follow Up',
            selector: row => {
                if (row.status_follow_up == 1) {
                    return <span className="badge bg-success-subtle text-success">Done</span>
                } else {
                    return <span className="badge bg-danger-subtle text-danger">Not</span>
                }
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status Phone',
            selector: row => {
                if (row.status_phone == 1) {
                    return <span className="badge bg-success-subtle text-success">Connected</span>
                } else if (row.status_phone == 0) {
                    return <span className="badge bg-danger-subtle text-danger">Not Connected</span>
                }
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status Contacted',
            selector: row => {
                if (row.is_contacted == 1) {
                    return <span className="badge bg-success-subtle text-success">Contacted</span>
                } else if (row.is_contacted == 0) {
                    return <span className="badge bg-danger-subtle text-danger">Not Contacted</span>
                }
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'Sender',
            selector: row => row.sender,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            width: '250px',
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
        setInputs(values => ({ ...values, [event.target.name]: fileUpload }));
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
                        <img src="/assets/images/icon_wijaya.png" style={{ opacity: 0.8 }} alt="" height="50" /><br /><br />
                        <p>Please wait...</p>
                    </div>
                )}
                {children}
            </div>
        );
    };

    const [inputCabang, setInputCabang] = useState(idCab == 5 ? '' : idCab);

    const handleChangeInputCabang = (event) => {
        setInputCabang(event.target.value);
    }

    const handleUploadAttacklist = (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('fileAttacklist', fileUpload);
        formData.append('id_cabang', inputCabang);
        setLoading(true);
        axios.post('http://127.0.0.1:8000/api/mra/import_attacklist', formData).then(function (response) {
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
                setimportExcel(false);
                setRefresh(new Date());
            }
        });
    }

    const [serviceNoRangka, setServiceNorangka] = useState('');
    const [fuDate, setfuDate] = useState('');
    const [fuTglService, setfuTglService] = useState('');
    const [fuSa, setfuSa] = useState('');
    const [fuCustomer, setfuCustomer] = useState('');
    const [fuConfirm, setfuConfirm] = useState('');
    const [fuReason, setfuReason] = useState('');
    const [listReason, setListReason] = useState([]);
    const [listSa, setListSa] = useState([]);
    const [fuVerbatim, setfuVerbatim] = useState('');
    const [statusPhone, setstatusPhone] = useState();
    const [statusContacted, setstatusContacted] = useState();
    const [fuBooking, setfuBooking] = useState('');
    const [openFormFU, setOpenFU] = useState(false);
    const [inputFu, setInputFu] = useState(false);
    const [detailKendaraan, setDetailKendaraan] = useState([]);

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

    const handleChangeInputFuTglService = (event) => {
        setfuTglService(event.target.value);
        setInputFu((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputFuSa = (event) => {
        setfuSa(event.target.value);
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

    const handleChangeStatusContacted = (event) => {
        setstatusContacted(event.target.value);
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
        setfuCustomer(event.nama_customer);
        setstatusPhone(event.status_phone);
        setstatusContacted(event.is_contacted);
        setfuBooking(event.status_booking_service);
        setfuReason(event.reason_id);
        setfuVerbatim(event.verbatim);
        setfuDate(event.re_follow_up_date);
        getDetailKendaraan(event.no_rangka);
        setInputFu((values) => ({
            ...values,
            ["no_rangka"]: event.no_rangka,
        }));
    }

    const [vehicleNoPolisi, setvehicleNoPolisi] = useState();
    const [vehicleNamaCustomer, setvehicleNamaCustomer] = useState();
    const [vehicleNoTelp, setvehicleNoTelp] = useState();
    const [vehicleTipe, setvehicleTipe] = useState();
    const [vehicleDecisionMaker, setvehicleDecisionMaker] = useState();
    const [result_service, setresultservice] = useState([]);
    const [openHistoryService, setOpenHistoryService] = React.useState(false);
    function getDetailKendaraan(no_rangka) {
        axios.get(`http://127.0.0.1:8000/api/attacklist/infokendaraan?no_rangka=${no_rangka}`).then(function (response) {
            var result = response.data;
            console.log(result.dtlso);
            setresultservice(result.dtlso);
            setDetailKendaraan(result.dtlcar);
            setvehicleNoPolisi(result.dtlcar.no_pol);
            setvehicleNamaCustomer(result.dtlcar.nama_customer);
            setvehicleNoTelp(result.dtlcar.no_telp);
            setvehicleTipe(result.dtlcar.tipe);
            setvehicleDecisionMaker(result.dtlso[0].decision_maker);
        });
    }

    const closeFollowUp = (event) => {
        setOpenFU(false);
        setServiceNorangka('');
        setfuCustomer('');
        setstatusPhone('');
        setstatusContacted('');
        setfuBooking('');
        setfuReason('');
        setfuVerbatim('');
        setfuDate('');
    }

    const handleShowHistory = (event) => {
        setOpenHistoryService(true);
    }

    const handleSubmitFu = (event) => {
        event.preventDefault();
        setLoading(true);
        axios
            .post("http://127.0.0.1:8000/api/attacklist/save", inputFu)
            .then(function (response) {
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

                    window.location.href = "/services/attacklist";
                }
            });
    }

    function getReason() {
        axios.get('http://127.0.0.1:8000/api/list/reason').then(function (response) {
            var result = response.data;
            setListReason(result.data);
        });
    }

    function getSa() {
        axios.get('http://127.0.0.1:8000/api/sa').then(function (response) {
            var result = response.data;
            setListSa(result.data);
        });
    }

    useEffect(() => {
        getSa();
        getReason();
    }, []);

    const urlDownloadForm = `http://127.0.0.1:8000/api/template_import_attacklist`;

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Attacklist</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">List</a></li>
                                    <li className="breadcrumb-item active"><a href="#">Attacklist</a></li>
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
                                        <h5 className="card-title mb-0"></h5>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <>
                                            <button className="btn btn-sm btn-primary" style={{ marginRight: "5px" }} onClick={showFormImport}><i className="ri-add-circle-line"></i> Upload Attacklist</button>
                                        </>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <input
                                            className="form-control form-control-sm mb-2"
                                            type="text"
                                            value={searchText}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Search..."
                                            style={{ width: "20%" }}
                                        />
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" className='p-2'>
                                            {rulesName == 'sa' || rulesName == 'superadmin' ? (
                                                <>
                                                    {/* <button className="btn btn-sm btn-primary" style={{ marginRight: "5px" }} onClick={showFormImport}><i className="ri-add-circle-line"></i> Import WA Blast</button> */}
                                                </>
                                            ) : ""}
                                        </div>
                                    </div>
                                </div>
                                {loadingTable ? (
                                    <div className="text-center ">
                                        <i className="mdi mdi-spin mdi-loading" style={{ fontSize: "30px", color: "#991B1B" }}></i> <h6 className="m-0 loading-text">Please wait...</h6>
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

                                )}
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
                                            <div className="card-header" style={{ border: "none" }}>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Form Upload Attacklist </h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <div className="flex-shrink-0">
                                                            <a href={urlDownloadForm} className="btn btn-sm btn-icon btn-success p-2" style={{ width: "100%", cursor: "pointer" }}><i className="ri-file-excel-fill"></i> Download Template Form</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <CustomBlockingOverlay isLoading={loading}>
                                                        </CustomBlockingOverlay>
                                                        <form>
                                                            <select type="file" name="cabang_id" id="cabang_id" onChange={handleChangeInputCabang} value={inputCabang} readOnly={idCab === 5 ? false : true} style={{ width: "500px" }} className={`form-control mb-2 `}>
                                                                <option value={''}>-- Pilih Cabang --</option>
                                                                <option value={1}>WML</option>
                                                                <option value={2}>WLD</option>
                                                                <option value={3}>WLP</option>
                                                                <option value={4}>WLS</option>
                                                            </select>
                                                            <TextField
                                                                id="outlined-select-currency-native"
                                                                defaultValue=""
                                                                label=""
                                                                helperText="Pilih File"
                                                                onChange={hChangeInputFile}
                                                                sx={{ width: "50%" }}
                                                                size="small"
                                                                name="fileAttacklist"
                                                                type="file"
                                                                style={{ width: "500px" }}
                                                                required
                                                            >
                                                            </TextField><br></br>
                                                            <button
                                                                className="btn btn-primary btn-sm mt-2"
                                                                onClick={handleUploadAttacklist}
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
                                                    <div className="col-md-6">
                                                        <div className="ribbon ribbon-primary round-shape mb-3" style={{ fontWeight: "bold" }}>Vehicle Detail</div>
                                                        <div className="row">
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={serviceNoRangka} placeholder="No Rangka" />
                                                                    <label htmlFor="no_rangka">No Rangka</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={vehicleNoPolisi} placeholder="No Polisi" />
                                                                    <label htmlFor="no_polisi">No Polisi</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={vehicleNamaCustomer} placeholder="Nama Customer" />
                                                                    <label htmlFor="nama_customer">Nama Customer</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={vehicleNoTelp} placeholder="No Telp" />
                                                                    <label htmlFor="no_telp">Customer Phone</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={vehicleTipe} placeholder="Tipe" />
                                                                    <label htmlFor="tipe">Model</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={vehicleDecisionMaker} placeholder="Decision Maker" />
                                                                    <label htmlFor="decision maker">Decision Maker</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <button onClick={handleShowHistory} className="btn btn-info btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-information-line label-icon align-middle fs-16 me-2"></i> View History Service</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6" style={{ background: "#E2E8F0", padding: "15px" }}>
                                                        <div className="ribbon ribbon-primary round-shape mb-3" style={{ fontWeight: "bold" }}>MRA Action</div>
                                                        {/* <form> */}
                                                        <div className="row">
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <select type="text" className="form-control form-control-sm" onChange={handleChangeStatusPhone} value={statusPhone} name="callbyphone" id="callbyphone">
                                                                        <option value={""}>-- Pilih --</option>
                                                                        <option value={1}>Connected</option>
                                                                        <option value={0}>Not Connected</option>
                                                                    </select>
                                                                    <label htmlFor="statusPhone">Call By Phone</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <select type="text" className="form-control form-control-sm" onChange={handleChangeStatusContacted} value={statusContacted} name="iscontacted" id="iscontacted">
                                                                        <option value={""}>-- Pilih --</option>
                                                                        <option value={1}>Contacted</option>
                                                                        <option value={0}>Not Contacted</option>
                                                                    </select>
                                                                    <label htmlFor="statusPhone">Is Contacted ?</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <div className="form-floating">
                                                                    <select type="text" className="form-control form-control-sm" onChange={handleChangeBooking} value={fuBooking} name="followup_booking" id="followup_booking">
                                                                        <option value={""}>-- Pilih --</option>
                                                                        <option value={1}>Booking</option>
                                                                        <option value={0}>Tidak Booking</option>
                                                                    </select>
                                                                    <label htmlFor="fuBooking">Booking Service</label>
                                                                </div>
                                                            </div>
                                                            {/* <div className={`col-lg-6 mb-2 ${parseInt(fuBooking) === 1 ? '' : 'd-none'}`}>
                                                                <div className="form-floating">
                                                                    <select type="text" className="form-control form-control-sm" onChange={handleChangeConfirm} value={fuConfirm} name="confirmService" id="confirmService">
                                                                        <option value={""}>-- Pilih --</option>
                                                                        <option value={'come'}>Come</option>
                                                                        <option value={'not'}>Not</option>
                                                                    </select>
                                                                    <label htmlFor="fuBooking">Come or Not ?</label>
                                                                </div>
                                                            </div> */}
                                                            <div className={`col-lg-6 mb-2 ${parseInt(fuBooking) === 0 ? '' : 'd-none'}`}>
                                                                <div className="form-floating">
                                                                    <select type="text" className="form-control form-control-sm form-select" onChange={handleChangeInputReason} value={fuReason} name="followup_reason" id="followup_reason">
                                                                        <option value={""}>-- Pilih --</option>
                                                                        {listReason.map((value, index) =>
                                                                            <option key={index} value={value.id}>{value.desc}</option>
                                                                        )}
                                                                    </select>
                                                                    <label htmlFor="fuReason">Reason</label>
                                                                </div>
                                                            </div>
                                                            <div className={`col-lg-6 mb-2 ${parseInt(fuBooking) === 0 ? '' : 'd-none'}`}>
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeInputVerbatim} value={fuVerbatim} name="followup_verbatim" id="followup_verbatim" />
                                                                    <label htmlFor="fuVerbatim">Verbatim</label>
                                                                </div>
                                                            </div>
                                                            <div className={`col-lg-6 mb-2 ${parseInt(fuBooking) === 0 ? '' : 'd-none'}`}>
                                                                <div className="form-floating">
                                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeInputFuDate} value={fuDate} name="followup_date" id="followup_date" />
                                                                    <label htmlFor="fuDate">Plan Follow Up Date</label>
                                                                </div>
                                                            </div>
                                                            <div className={`col-lg-6 mb-2 ${parseInt(fuBooking) === 1 ? '' : 'd-none'}`}>
                                                                <div className="form-floating">
                                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeInputFuTglService} value={fuTglService} name="re_tgl_service" id="re_tgl_service" />
                                                                    <label htmlFor="fuDate">Pilih Tanggal Service ?</label>
                                                                </div>
                                                            </div>
                                                            {/* <div className={`col-lg-6 mb-2 ${fuConfirm === 'not' && parseInt(fuBooking) !== 0 ? '' : 'd-none'}`}> */}
                                                            <div className={`col-lg-6 mb-2 ${parseInt(fuBooking) === 1 ? '' : 'd-none'}`}>
                                                                <div className="form-floating">
                                                                    <select className="form-control form-control-sm" onChange={handleChangeInputFuSa} value={fuSa} name="sa" id="sa">
                                                                        <option value={""}>-- Pilih --</option>
                                                                        {listSa.map((value, index) =>
                                                                            <option key={index} value={value.id}>{value.nama_sa}</option>
                                                                        )}
                                                                    </select>
                                                                    <label htmlFor="fuSa">Pilih SA</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <div className="text-end">
                                                                    <button onClick={handleSubmitFu} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                                    <button onClick={closeFollowUp} className="btn btn-danger btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* </form> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className="row mt-3">
                                                    <div className="col-lg-12">
                                                        {openHistoryService ? (
                                                            <>

                                                                <div className="table-responsive" style={{ fontSize: "12px" }}>
                                                                    <table className="table align-middle table-nowrap mb-0">
                                                                        <thead className="table-light">
                                                                            <tr>
                                                                                <th>Tanggal WO</th>
                                                                                <th>SA</th>
                                                                                <th>Foreman</th>
                                                                                <th>Category WO</th>
                                                                                <th>Nomor Polisi</th>
                                                                                <th>Nomor Rangka</th>
                                                                                <th>Model</th>
                                                                                <th>Tahun Kendaraan</th>
                                                                                <th>Nama Customer (User)</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {result_service.map((value, index) =>
                                                                                <tr>
                                                                                    <td>{value.tgl_wo}</td>
                                                                                    <td>{value.sa}</td>
                                                                                    <td>{value.foreman}</td>
                                                                                    <td>{value.category_wo}</td>
                                                                                    <td>{value.no_polisi}</td>
                                                                                    <td>{value.no_rangka}</td>
                                                                                    <td>{value.model}</td>
                                                                                    <td>{value.tahun_kendaraan}</td>
                                                                                    <td>{value.nama_customer}</td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                            </>
                                                        ) : ("")}
                                                    </div>
                                                    {/* <div className="col-lg-6"> */}
                                                    {/* <div className="text-end">
                                                            <button onClick={handleSubmitFu} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                            <button onClick={closeFollowUp} className="btn btn-danger btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
                                                        </div> */}
                                                    {/* </div> */}
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

export default Attacklist;
