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
    const monthday = new Date();
    const firstDayOfMonth = `${monthday.getFullYear()}-${(monthday.getMonth() + 1).toString().padStart(2, '0')}`;
    const defEndDate = new Date().toISOString().split('T')[0];
    const [startdatefilter, setStartDateFilter] = useState(firstDayOfMonth + '-01');
    const [enddatefilter, setEndDateFilter] = useState(defEndDate);

    function handleStartDate(event) {
        setStartDateFilter(event.target.value);
    }

    function handleEndDate(event) {
        setEndDateFilter(event.target.value);
    }

    const [lsDtCustomer, setLsDtCustomer] = useState([]);

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/service_pertama/list?startdate=${startdatefilter}&enddate=${enddatefilter}`;
            try {

                const response = await axios.get(url);
                setLsDtCustomer(response.data.data);
                setLoadingTable(false);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [refreshDt, startdatefilter, enddatefilter]);

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
    const [openRechedule, setopenRechedule] = useState(false);
    const [inputServices, setinputServices] = useState([]);
    const [inpuReschedule, setinpuReschedule] = useState([]);
    const [listSa, setListSa] = useState([]);
    const [serviceNamaCustomer, setServiceNamaCustomer] = useState('');
    const [serviceNoRangka, setServiceNorangka] = useState('');
    const [serviceTglDec, setserviceTglDec] = useState('');
    const [serviceTglService, setserviceTglService] = useState('');
    const [saName, setsaName] = useState('');
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
            ['tgl_jatuh_tempo']: maxDate,
            ['tgl_service_pertama']: minDate
        }));
    }

    const handleChangeInputSaName = (event) => {
        setsaName(event.target.value);
        setinputServices((values) => ({
            ...values,
            [event.target.name]: event.target.value
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
            setserviceTglService(formatDateInput(event.first_service));
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
                        <i className="ri-add-circle-line"></i> Service Pertama
                    </button>
                } else {
                    if (row.status_service_pertama === 'scheduled') {

                        return <>
                            <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                <button onClick={(event) => { handleOpenReshedule(row); }} type="button" className="btn btn-info"><i className="ri ri-calendar-todo-fill"></i> Reschedule</button>
                                <button onClick={(event) => { handleSubmitConfirm(row, 'datang'); }} type="button" className="btn btn-success"><i className="ri ri-checkbox-circle-fill"> </i>Datang</button>
                                <button onClick={(event) => { handleSubmitConfirm(row, 'cancel'); }} type="button" className="btn btn-danger"><i className="ri ri-close-circle-fill"></i> Cancel</button>
                            </div>
                        </>

                    } else {

                        return <button onClick={(event) => {
                            handleOpenDetailKendaraan(row);
                        }}
                            style={{
                                fontSize: "10px"
                            }} type="button" className="btn btn-info waves-effect waves-light">
                            <i className="ri-add-circle-line"></i> Service Pertama
                        </button>
                    }
                }
            },
            width: "300px"
        },
        {
            name: 'Status Service Pertama',
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
            width: '200px',
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
            name: 'Nama SA',
            selector: row => {
                if (row.nama_sa == null && row.status_service_pertama !== null) {
                    return <>
                        <button onClick={(event) => { handleOpenUpSa(row); }} type="button" className="btn btn-info"><i className="ri ri-calendar-todo-fill"></i> Set SA</button>
                    </>
                } else {
                    return row.nama_sa
                }
            },
            sortable: true,
            width: '200px',
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

    const [upSaName, setUpSaName] = useState('');
    const [openFormSa, setOpenFormSa] = useState(false);
    const [inputUpdateSa, setInputUpdateSa] = useState([]);
    const handleUpdateSaService = () => {
        
    }

    const handleOpenUpSa = (event) => {
        console.log(event);
        setInputUpdateSa((values) => ({
            ...values,
            ['tgl_service']: formatDateInput(event.first_service),
            ['no_rangka']: event.no_rangka
        }));

        setOpenFormSa(true);
    }

    const closeFormSa = (event) => {
        setOpenFormSa(false);
    }

    const handleSubmitFormSa = (event) => {
        console.log(inputUpdateSa);
    }

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
                        <img src="/assets/images/icon_wijaya.png" style={{ opacity: 0.8 }} alt="" height="50" /><br /><br />
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
            .post("https://api.crm.wijayatoyota.co.id/api/services/save_service_pertama", inputServices)
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

                    setRefresh();
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

    function settingMinDateRange(daterangw) {
        const initialDate = daterangw;

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

        const arrRange = {
            "startdate": minDate,
            "enddate": maxDate
        };

        return arrRange;
    }

    const getSa = async () => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const url = `https://api.crm.wijayatoyota.co.id/api/sa`;
        try {
            const response = await axios.get(url);
            setListSa(response.data.data);
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        getSa();
    }, []);


    const closeRechedule = () => {
        setopenRechedule(false);
        setServiceNamaCustomer("");
        setServiceNorangka("");
        setserviceTglDec();
        setserviceTglService("");
        setsaName("");
        setEndDate("");
    }

    const [dtConfirmation, setConfirmation] = useState([]);

    const handleSubmitConfirm = (event, type) => {
        console.log(event);
        console.log(type);
        setLoading(true);
        setConfirmation((values) => ({
            ...values,
            ["single_id"]: event.single_id,
            ["no_rangka"]: event.no_rangka,
            ["first_service"]: formatDateInput(event.first_service),
            ['type']: type
        }));
        axios
            .post("https://api.crm.wijayatoyota.co.id/api/servicepertama/confirmation", dtConfirmation)
            .then(function (response) {
                if (response.data.error == true) {
                    setLoading(false);
                    swal("Error", 'Data tidak boleh kosong!', "error", {
                        buttons: false,
                        timer: 2000,
                    });
                } else {
                    setLoading(false);
                    swal("Success", 'Status Berhasil disimpan!', "success", {
                        buttons: false,
                        timer: 2000,
                    });

                    window.location.href = "/input/servicepertama";
                }
            });

    }

    const [reTglDec, setReTglDec] = useState('');
    const [reTglService, setReTglService] = useState('');

    const handleOpenReshedule = (event) => {
        const resultRange = settingMinDateRange(formatDateInput(event.tgl_dec));

        setStartDate(formatDateInput(event.tgl_dec));
        setEndDate(resultRange.enddate);

        setopenRechedule(true);
        setServiceNamaCustomer(event.nama_customer_stnk);
        setServiceNorangka(event.no_rangka);
        setReTglDec(formatDateInput(event.tgl_dec));
        if (event.tgl_jatuh_tempo != '') {
            setReTglService(formatDateInput(event.first_service));
        }
        setsaName(event.said);
        setEndDate(formatDateInput(event.tgl_jatuh_tempo));

        setinpuReschedule((values) => ({
            ...values,
            ["no_rangka"]: event.no_rangka,
            ["nama_sa"]: event.said,
            ["re_tgl_service_pertama"]: formatDateInput(event.first_service),
            ["re_tgl_dec"]: formatDateInput(event.tgl_dec),
            ["tgl_service_pertama"]: formatDateInput(event.first_service)
        }));
    }

    const handleReTglDec = (event) => {
        setReTglDec(event.target.value);
        setinpuReschedule((values) => ({
            ...values,
            [event.target.name]: event.target.value
        }));
    }

    const handleReTglService = (event) => {
        setReTglService(event.target.value);
        setinpuReschedule((values) => ({
            ...values,
            [event.target.name]: event.target.value
        }));
    }

    const handleSubmitReschedule = (event) => {
        console.log(inpuReschedule);
        setLoading(true);
        axios
            .post("https://api.crm.wijayatoyota.co.id/api/servicepertama/reschedule", inpuReschedule)
            .then(function (response) {
                if (response.data.error == true) {
                    setLoading(false);
                    swal("Error", 'Data tidak boleh kosong!', "error", {
                        buttons: false,
                        timer: 2000,
                    });
                } else {
                    setLoading(false);
                    swal("Success", 'Reschedule Berhasil disimpan!', "success", {
                        buttons: false,
                        timer: 2000,
                    });

                    window.location.href = "/input/servicepertama";
                }
            });
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">List Service Pertama</h4>

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
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-1 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{ fontSize: 10 }}>Tanggal Awal</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input type="date" onChange={handleStartDate} value={startdatefilter} className="form-control" id="nameInput" name="bulan" placeholder="Enter your name" />
                                                </div>
                                                <div className="col-lg-1 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{ fontSize: 10 }}>Tanggal Akhir</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input type="date" onChange={handleEndDate} value={enddatefilter} min={startdatefilter} className="form-control" id="nameInput" name="tahun" placeholder="Enter your name" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            value={searchText}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Search..."
                                            style={{ width: "20%" }}
                                        />
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" className='p-2'>

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
                                            <div className="card-header" style={{ border: "none" }}>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Booking Service</h5>
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
                                                                        <input type="date" className="form-control form-control-sm" onChange={handleChangeInputTglService} min={serviceTglDec} max={endDate} value={serviceTglService} id="tgl_service_pertama" name="tgl_service_pertama" placeholder="Tanggal Service Pertama" />
                                                                        <label htmlFor="tgl_service_pertama">Tanggal Service Pertama</label>
                                                                    </div>
                                                                    <small style={{ fontSize: "10px" }}><i>Tanggal Jatuh Tempo adalah <b style={{ color: "red" }}>{endDate}</b></i></small>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" value={saName} onChange={handleChangeInputSaName} id="nama_sa" name="nama_sa">
                                                                            <option value={""}>-- Pilih --</option>
                                                                            {listSa.map((val, index) => (
                                                                                <option key={index} value={val.id}>{val.nama_sa}</option>
                                                                            ))}
                                                                            <option value={"lainnya"}>Lainnya</option>
                                                                        </select>
                                                                        <label htmlFor="nama_customer">Pilih SA</label>
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
                                                            <button onClick={handleSubmitServicePertama} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
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

                {/* Start Reschedule Service Pertama  */}
                <Dialog
                    open={openRechedule}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={closeRechedule}
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
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Reschedule Service</h5>
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
                                                                        <input type="text" className="form-control form-control-sm" readOnly value={serviceNamaCustomer} id="re_nama_customer" placeholder="Nama Customer" />
                                                                        <label htmlFor="nama_customer">Nama Customer</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" readOnly value={serviceNoRangka} id="re_no_rangka" placeholder="No Rangka" />
                                                                        <label htmlFor="no_rangka">No Rangka</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="date" className="form-control form-control-sm" onChange={handleReTglDec} value={reTglDec} name="re_tgl_dec" id="re_tgl_dec" placeholder="Tanggal DEC" />
                                                                        <label htmlFor="tgl_dec">Tanggal DEC</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="date" className="form-control form-control-sm" onChange={handleReTglService} min={startDate} max={endDate} value={reTglService} id="re_tgl_service_pertama" name="re_tgl_service_pertama" placeholder="Tanggal Service Pertama" />
                                                                        <label htmlFor="tgl_service_pertama">Tanggal Service Pertama</label>
                                                                    </div>
                                                                    <small style={{ fontSize: "10px" }}><i>Tanggal Jatuh Tempo adalah <b style={{ color: "red" }}>{endDate}</b></i></small>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" value={saName} onChange={handleChangeInputSaName} id="nama_sa" name="re_nama_sa">
                                                                            <option value={""}>-- Pilih --</option>
                                                                            {listSa.map((val, index) => (
                                                                                <option key={index} value={val.id}>{val.nama_sa}</option>
                                                                            ))}
                                                                            <option value={"lainnya"}>Lainnya</option>
                                                                        </select>
                                                                        <label htmlFor="nama_customer">Pilih SA</label>
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
                                                            <button onClick={handleSubmitReschedule} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                            <button onClick={closeRechedule} className="btn btn-danger btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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
                {/* End Reschedule Service Pertama */}

                {/* Start Update SA  */}
                <Dialog
                    open={openFormSa}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={closeFormSa}
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
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Setting SA</h5>
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
                                                                <div className="col-lg-12 mb-2">
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" value={saName} onChange={handleChangeInputSaName} id="nama_sa" name="nama_sa">
                                                                            <option value={""}>-- Pilih --</option>
                                                                            {listSa.map((val, index) => (
                                                                                <option key={index} value={val.id}>{val.nama_sa}</option>
                                                                            ))}
                                                                            <option value={"lainnya"}>Lainnya</option>
                                                                        </select>
                                                                        <label htmlFor="nama_customer">Pilih SA</label>
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
                                                    <div className="col-lg-12">
                                                        <div className="text-end">
                                                            <button onClick={handleSubmitFormSa} className="btn btn-primary btn-block btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                            <button onClick={closeFormSa} className="btn btn-danger btn-label btn-sm btn-block" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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
                {/* End Update SA */}
            </div>
        </div>
    );
}

export default Servicepertama;
