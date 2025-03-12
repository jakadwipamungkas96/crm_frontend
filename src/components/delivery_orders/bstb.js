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

function Bstb() {
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
    console.log(token);

    const [lsDtCustomer, setLsDtCustomer] = useState([]);
    
    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/delivery_orders/list?page=${page}&size=${pageSize}`;
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
            name: 'Aksi',
            cell: row => <button onClick={(event) => {
                            handleOpenFrmBstb(row);
                        }}
                        style={{
                            fontSize: "10px"
                        }} type="button" className={`btn btn-info waves-effect waves-light ${row.tgl_dec != "" ? 'disabled' : ''}`}>
                            <i className="ri-file-list-3-fill"></i> Add BSTB
                        </button>,
                        width: "150px"
        },
        {
            name: 'Single ID',
            selector: row => row.single_id,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer_stnk,
            sortable: true,
            width: '300px',
        },
        {
            name: 'No Rangka',
            selector: row => row.no_rangka,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Tanggal DO',
            selector: row => row.tgl_do,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Tanggal DEC',
            selector: row => row.tgl_dec,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Model Type',
            selector: row => row.type,
            sortable: true,
            width: '300px',
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
        axios.post('https://api.crm.wijayatoyota.co.id/api/delivery_order/import', formData).then(function(response){
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

    const [inputsDec, setInputsDec] = useState([]);
    const [bstbTglDec, setbstbTglDec] = useState('');
    const [bstbDelivCar, setbstbDelivCar] = useState('');
    const [bstbTcare, setbstbTcare] = useState('');
    const [bstbTintouch, setbstbTintouch] = useState('');
    const [bstbTenor, setbstbTenor] = useState('');
    const [bstbHybrid, setbstbHybrid] = useState('');
    const [bstbServicePertama, setbstbServicePertama] = useState('');
    const [bstbAsuransi, setbstbAsuransi] = useState('');
    const [bstbNamaAsuransi, setbstbNamaAsuransi] = useState('');
    const [bstbAllRisk, setbstbAllRisk] = useState('');
    const [bstbComb, setbstbComb] = useState('');
    const [bstbTlo, setbstbTlo] = useState('');

    const [isAsuransi, setIsAsuransi] = useState(false);

    
    const [inputBSTB, setinputBSTB] = React.useState(false);
    const [bstbNamaCustomer, setbstbNamaCustomer] = useState('');

    const handleOpenFrmBstb = (event) => {
        setinputBSTB(true);
        setbstbNamaCustomer(event.nama_customer_stnk);
        setbstbTglDec(formatDateInput(event.tgl_dec));
        setInputsDec((values) => ({
            ...values,
            ["no_rangka"]: event.no_rangka,
            ["tgl_dec"]: event.tgl_dec,
            ["coverage_allrisk"]: 0,
            ["coverage_combination"]: 0,
            ["coverage_tlo"]: 0,
            ["hybrid"]: '',
            ["service_pertama"]: '',
        }));
    }

    const closeBstb = (event) => {
        setinputBSTB(false);
        setbstbTglDec('');
        setbstbDelivCar('');
        setbstbTcare('');
        setbstbTintouch('');
    }

    const handleChangeInputTglDec = (event) => {
        setbstbTglDec(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }
    
    const handleChangeInputDelivCar = (event) => {
        setbstbDelivCar(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputTcare = (event) => {
        setbstbTcare(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputTintouch = (event) => {
        setbstbTintouch(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputTenor = (event) => {
        setbstbTenor(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputServicePertama = (event) => {
        setbstbServicePertama(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputAsuransi = (event) => {
        console.log(event.target.value);
        setbstbAsuransi(event.target.value);
        if (event.target.value == "Ya") {
            setIsAsuransi(true);
            setInputsDec((values) => ({
                ...values,
                [event.target.name]: event.target.value,
            }));
        } else {
            setIsAsuransi(false);
        }
    }

    const handleChangeInputHybrid = (event) => {
        setbstbHybrid(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputNamaAsuransi = (event) => {
        setbstbNamaAsuransi(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputAllRisk = (event) => {
        setbstbAllRisk(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputComb = (event) => {
        setbstbComb(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeInputTlo = (event) => {
        setbstbTlo(event.target.value);
        setInputsDec((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSubmitBstb = (event) => {
        event.preventDefault();
        setLoading(true);
        axios
            .post("https://api.crm.wijayatoyota.co.id/api/services/dectracking/save", inputsDec)
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
    
                    window.location.href = "/list/bstb";
                }
            });
    }

    function formatDateInput(inputDate) {
        // Konversi tanggal input ke objek Date
        const dateObj = new Date(inputDate);
        // Dapatkan tahun, bulan, dan tanggal dari objek Date
        const year = dateObj.getFullYear();
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Tambahkan 1 karena bulan dimulai dari 0
        const day = ('0' + dateObj.getDate()).slice(-2);
        
        // Gabungkan tahun, bulan, dan tanggal sesuai dengan format yang diinginkan
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">BSTB</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">List</a></li>
                                    <li className="breadcrumb-item active">BSTB</li>
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
                                        <h5 className="card-title mb-0">Master Data DEC Tracking by BSTB</h5> 
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{padding: "15px"}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden p-2">
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
                                            {/* <button className="btn btn-sm btn-success" onClick={showFormImport}><i className=" ri-download-2-fill"></i> Import Excel</button> */}
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
                                        // data={displayData}
                                        data={displayData.map(item => ({ ...item, key: item.id }))}
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
                        open={inputBSTB}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth="xl"
                        onClose={closeBstb}
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
                                                            <h5 className="card-title mb-0" style={{fontSize: "17px"}}>Form Input Data by BSTB </h5>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <form action="#">
                                                                <div className="row">
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <input type="text" className="form-control form-control-sm" readOnly value={bstbNamaCustomer} id="nama_customer" placeholder="Nama Customer" />
                                                                            <label htmlFor="nama_customer">Nama Customer</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <input type="date" className="form-control form-control-sm" required onChange={handleChangeInputTglDec} value={bstbTglDec} id="tgl_dec" name="tgl_dec" placeholder="Tanggal DEC" />
                                                                            <label htmlFor="tgl_dec">Tanggal DEC</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <select type="text" className="form-control form-control-sm" required onChange={handleChangeInputDelivCar} value={bstbDelivCar} id="deliver" name="deliver" placeholder="Pertanyaan 1">
                                                                                <option value="">-- Pilih --</option>
                                                                                <option value="Ya">Ya</option>
                                                                                <option value="Tidak">Tidak</option>
                                                                            </select>
                                                                            <label htmlFor="deliver">Apakah mobil sudah terkirim ?</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <select type="text" className="form-control form-control-sm" required onChange={handleChangeInputTcare} value={bstbTcare} id="tcare" name="tcare" placeholder="Pertanyaan 2">
                                                                                <option value="">-- Pilih --</option>
                                                                                <option value="Ya">Ya</option>
                                                                                <option value="Tidak">Tidak</option>
                                                                            </select>
                                                                            <label htmlFor="tcare">Apakah sales menjelaskan T-Care ?</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <select type="text" className="form-control form-control-sm" required onChange={handleChangeInputTintouch} value={bstbTintouch} id="tintouch" name="tintouch" placeholder="Pertanyaan 3">
                                                                                <option value="">-- Pilih --</option>
                                                                                <option value="Ya">Ya</option>
                                                                                <option value="Tidak">Tidak</option>
                                                                            </select>
                                                                            <label htmlFor="tintouch">Apakah sales T-intouch ?</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <select type="text" className="form-control form-control-sm" onChange={handleChangeInputHybrid} value={bstbHybrid} id="hybrid" name="hybrid" placeholder="Pertanyaan 5">
                                                                                <option value="">-- Pilih --</option>
                                                                                <option value="Ya">Ya</option>
                                                                                <option value="Tidak">Tidak</option>
                                                                            </select>
                                                                            <label htmlFor="Hybrid">Apakah mobil hybrid ? </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <select type="text" className="form-control form-control-sm" onChange={handleChangeInputServicePertama} value={bstbServicePertama} id="service_pertama" name="service_pertama" placeholder="Pertanyaan 6">
                                                                                <option value="">-- Pilih --</option>
                                                                                <option value="Ya">Ya</option>
                                                                                <option value="Tidak">Tidak</option>
                                                                            </select>
                                                                            <label htmlFor="service_pertama">Apakah sales sudah membantu tanggal booking service pertama ? </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3 mb-2">
                                                                        <div className="form-floating">
                                                                            <select type="text" className="form-control form-control-sm" onChange={handleChangeInputAsuransi} value={bstbAsuransi} id="asuransi" name="asuransi" placeholder="Pertanyaan 8">
                                                                                <option value="">-- Pilih --</option>
                                                                                <option value="Ya">Ya</option>
                                                                                <option value="Tidak">Tidak</option>
                                                                            </select>
                                                                            <label htmlFor="asuransi">Apakah mobil menggunakan asuransi ?</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3 mb-2">
                                                                        <div className="form-floating">
                                                                            {isAsuransi ? (
                                                                                <>
                                                                                    <select type="text" className="form-control form-control-sm" onChange={handleChangeInputTenor} value={bstbTenor} id="tenor" name="tenor" placeholder="Pertanyaan 7">
                                                                                        <option value="">-- Pilih --</option>
                                                                                        <option value="0">0</option>
                                                                                        <option value="1">1</option>
                                                                                        <option value="2">2</option>
                                                                                        <option value="3">3</option>
                                                                                        <option value="4">4</option>
                                                                                        <option value="5">5</option>
                                                                                    </select>
                                                                                    <label htmlFor="tenor">Tenor ? </label>
                                                                                </>
                                                                            ) : ""}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            {isAsuransi ? (
                                                                                <>
                                                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeInputNamaAsuransi} value={bstbNamaAsuransi} name="nama_asuransi" id="nama_asuransi" placeholder="Pertanyaan 3" />
                                                                                    <label htmlFor="nama_asuransi">Nama Asuransi</label>
                                                                                </>
                                                                            ) : ""}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-1 mb-2">
                                                                        {isAsuransi ? ( <span className="text-muted">Coverage Asuransi</span> ) : ("") }
                                                                    </div>
                                                                    <div className="col-lg-1 mb-2">
                                                                        <div className="form-floating">
                                                                            {isAsuransi ? (
                                                                                <>  
                                                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeInputAllRisk} value={bstbAllRisk} name="coverage_allrisk" id="coverage_allrisk" placeholder="All Risk" />
                                                                                    <label htmlFor="coverage_allrisk">All Risk</label>
                                                                                </>
                                                                            ) : ""}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-2 mb-2">
                                                                        <div className="form-floating">
                                                                            {isAsuransi ? (
                                                                                <>
                                                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeInputComb} value={bstbComb} name="coverage_combination" id="coverage_combination" placeholder="Combination" />
                                                                                    <label htmlFor="coverage_combination">Combination</label>
                                                                                </>
                                                                            ) : ""}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-2 mb-2">
                                                                        <div className="form-floating">
                                                                            {isAsuransi ? (
                                                                                <>
                                                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeInputTlo} value={bstbTlo} name="coverage_tlo" id="coverage_tlo" placeholder="TLO" />
                                                                                    <label htmlFor="coverage_tlo">TLO</label>
                                                                                </>
                                                                            ) : ""}
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
                                                                <button onClick={handleSubmitBstb} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                                <button onClick={closeBstb} className="btn btn-danger btn-label btn-sm"style={{marginLeft: "5px"}}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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
                {/* End Import */}
            </div>
        </div>
    );
}

export default Bstb;
