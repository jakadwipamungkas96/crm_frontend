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

function Servicepertama() {
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

    const [refreshDt, setRefresh] = useState();
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
            const url = `http://127.0.0.1:8000/api/service_pertama/list`;
            try {

                const response = await axios.get(url);
                setLsDtCustomer(response.data.data);
                setLoadingTable(false);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [refreshDt]);

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

    const [openServicePertama, setOpenServicePertama] = useState(false);
    const [inputServices, setinputServices] = useState([]);
    const [serviceNamaCustomer, setServiceNamaCustomer] = useState('');
    const [serviceNoRangka, setServiceNorangka] = useState('');
    const [serviceTglDec, setserviceTglDec] = useState('');
    const [serviceTglService, setserviceTglService] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleChangeInputDec = (event) => {
        const initialDate = event.target.value;

        // Menghitung tanggal minimal (mulai bulan Februari)
        const minDate = (() => {
            const [year, month] = initialDate.split('-');
            const nextMonthFirstDay = new Date(parseInt(year, 10), parseInt(month, 10), 1);
            nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + 1);
            return `${nextMonthFirstDay.getFullYear()}-${(nextMonthFirstDay.getMonth()).toString().padStart(2, '0')}-${nextMonthFirstDay.getDate().toString().padStart(2, '0')}`;
        })();

        // Menghitung tanggal maksimal (akhir bulan sebelumnya)
        const maxDate = (() => {
            const [year, month] = minDate.split('-');
            const lastDayOfPreviousMonth = new Date(parseInt(year, 10), parseInt(month, 10), 0);
            return `${lastDayOfPreviousMonth.getFullYear()}-${(lastDayOfPreviousMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfPreviousMonth.getDate().toString().padStart(2, '0')}`;
        })();

        setStartDate(minDate);
        setEndDate(maxDate);
        setserviceTglDec(event.target.value);
        setserviceTglService(minDate);

        setinputServices((values) => ({
            ...values,
            [event.target.name]: event.target.value,
            ['tgl_jatuh_tempo']: maxDate
        }));
    }

    const handleChangeInputTglService = (event) => {
        setserviceTglService(event.target.value);
        setinputServices((values) => ({
            ...values,
            [event.target.name]: event.target.value
        }));
    }

    const handleOpenDetailKendaraan = (event) => {
        setOpenServicePertama(true);
        setServiceNamaCustomer(event.nama_customer_stnk);
        setServiceNorangka(event.no_rangka);
        setserviceTglDec(formatDateInput(event.tgl_dec));
        if (event.tgl_jatuh_tempo != '') {
            setserviceTglService(formatDateInput(event.tgl_jatuh_tempo));
        }

        setinputServices((values) => ({
            ...values,
            ["no_rangka"]: event.no_rangka
        }));
    }

    const closeFollowUp = () => {
        setOpenServicePertama(false);
        setinputServices([]);
    }

    const columnsLsCustomer = [
        {
            name: 'Aksi',
            cell: row => {
                if (row.status_service_pertama === 'service') {
                    return <button 
                    style={{
                        fontSize: "10px"
                    }} type="button" className="btn btn-info waves-effect waves-light" disabled>
                        <i className="ri-add-circle-line"></i> Booking
                    </button>
                } else {
                    return <button onClick={(event) => {
                        handleOpenDetailKendaraan(row);
                    }}
                    style={{
                        fontSize: "10px"
                    }} type="button" className="btn btn-info waves-effect waves-light">
                        <i className="ri-add-circle-line"></i> Booking
                    </button>
                }
            },
                        width: "150px"
        },
        {
            name: 'Status',
            selector: row => {
                if (row.status_service_pertama === 'scheduled') {
                  return <span className="badge bg-success text-white badge-border">Sudah Booking</span>;
                } else if (row.status_service_pertama === 'service') {
                  return <span className="badge bg-info text-white badge-border">Sudah Service</span>;
                } else if (row.status_service_pertama === 'batal_service') {
                  return <span className="badge bg-danger text-white badge-border">Batal Service</span>;
                } else if (row.status_service_pertama === null) {
                  return <span className="badge bg-dark-subtle text-body badge-border">Belum Booking</span>;
                }
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'Single ID',
            selector: row => row.single_id,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer_stnk,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Tanggal DO',
            selector: row => row.tgl_do,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Tanggal DEC',
            selector: row => row.tgl_dec,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Service Pertama',
            selector: row => row.first_service,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Tanggal Jatuh Tempo',
            selector: row => row.tgl_jatuh_tempo,
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
            name: 'No Polisi',
            selector: row => row.no_pol,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Model',
            selector: row => row.type,
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

    const linkToInputServices = () => {
        window.location.href = "/services/input";
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

    const handleSubmitServicePertama = (event) => {
        console.log(inputServices);
        event.preventDefault();
        setLoading(true);
        axios
            .post("http://127.0.0.1:8000/api/services/save_service_pertama", inputServices)
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
    
                    window.location.href = "/input/servicepertama";
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
                            <h4 className="mb-sm-0">Service Pertama</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">List</a></li>
                                    <li className="breadcrumb-item"><a href="#">Customers</a></li>
                                    <li className="breadcrumb-item active">Services</li>
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
                                        <h5 className="card-title mb-0">Service Pertama</h5> 
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{padding: "15px"}}>
                                <div className="d-flex align-items-center mb-2">
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

                {/* Start Input Service Pertama  */}
                <Dialog
                        open={openServicePertama}
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
                                                <div className="card-header" style={{border: "none"}}>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <h5 className="card-title mb-0" style={{fontSize: "17px"}}>Follow Up Service Pertama </h5>
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
                                                                <div className="row">
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <input type="text" className="form-control form-control-sm" readOnly value={serviceNamaCustomer} id="nama_customer" placeholder="Nama Customer" />
                                                                            <label htmlFor="nama_customer">Nama Customer</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <input type="text" className="form-control form-control-sm" readOnly value={serviceNoRangka} id="no_rangka" placeholder="No Rangka" />
                                                                            <label htmlFor="no_rangka">No Rangka</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <input type="date" className="form-control form-control-sm" onChange={handleChangeInputDec} value={serviceTglDec} name="tgl_dec" id="tgl_dec" placeholder="Tanggal DEC" />
                                                                            <label htmlFor="tgl_dec">Tanggal DEC</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-6 mb-2">
                                                                        <div className="form-floating">
                                                                            <input type="date" className="form-control form-control-sm" onChange={handleChangeInputTglService} min={startDate} max={endDate} value={serviceTglService} id="tgl_service_pertama" name="tgl_service_pertama" placeholder="Tanggal Service Pertama" />
                                                                            <label htmlFor="tgl_service_pertama">Tanggal Service Pertama</label>
                                                                        </div>
                                                                        <small style={{fontSize: "10px"}}><i>Tanggal Jatuh Tempo adalah <b style={{color: "red"}}>{endDate}</b></i></small>
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
                                                                <button onClick={handleSubmitServicePertama} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                                <button onClick={closeFollowUp} className="btn btn-danger btn-label btn-sm"style={{marginLeft: "5px"}}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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

export default Servicepertama;
