import React, { useEffect, useState,  useLayoutEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import axios from 'axios';
import TableContainer from "@mui/material/TableContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@mui/styles';
import swal from 'sweetalert';

// React DataTable
import DataTable from 'react-data-table-component';

// Modal Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

// Amchart 5
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import CryptoJS from 'crypto-js';

// Chart JS
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);


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

function Dashboard() {
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

    const tahunlist = [];

    // Fungsi untuk mengupdate daftar tahun
    const [bulan, setBulan] = React.useState(bulanHariIni);
    const [tahun, setTahun] = React.useState(tahunHariIni);

    const handleChange = (event) => {
        setBulan(event.target.value);
    };
    const handleChange2 = (event) => {
        setTahun(event.target.value);
    };

    const tahunSaatIni = new Date().getFullYear();

    for (let tahun = tahunSaatIni; tahun >= 2017; tahun--) {
        tahunlist.push({
            value: tahun.toString(),
            label: tahun.toString(),
        });
    }

    const bulanlist = [
        {
            value: "1",
            label: "Januari",
        },
        {
            value: "2",
            label: "Februari",
        },
        {
            value: "3",
            label: "Maret",
        },
        {
            value: "4",
            label: "April",
        },
        {
            value: "5",
            label: "Mei",
        },
        {
            value: "6",
            label: "Juni",
        },
        {
            value: "7",
            label: "July",
        },
        {
            value: "8",
            label: "Agustus",
        },
        {
            value: "9",
            label: "September",
        },
        {
            value: "10",
            label: "Oktober",
        },
        {
            value: "11",
            label: "November",
        },
        {
            value: "12",
            label: "Desember",
        },
    ];
    
    const [listUltah, setListUltah] = useState([]);
    const [totalUltah, setTotalUltah] = useState("");

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getUltah = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/list/notif_birthday`;
            try {
                const response = await axios.get(url);
                setTotalUltah(response.data.total);
                setListUltah(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUltah();
    }, []);

    const [dataProspek, setDataProspek] = useState([]);
    const [dataProspek2, setDataProspek2] = useState([]);
    const [refreshDt, setRefresh] = useState();
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const token =  CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    // console.log(token);
    const rulesName = JSON.parse(localStorage.getItem("rules"));

    const [lsDtCustomer, setLsDtCustomer] = useState([]);

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


    const [openCustCard, setopenCustCard] = React.useState(false);
    const [nameCustomer, setNameCustomer] = React.useState();
    const [singleIdNo, setSingleIdNo] = React.useState();
    const handleOpenCardCustomer = (event) => {
        console.log(event);
        setopenCustCard(true);
        setNameCustomer(event.nama_customer);
        setSingleIdNo(event.single_id);
    }
    const handleClose = () => setopenCustCard(false);

    const alertNotifSend = (event) => {
        swal({
            title: "Reminder berhasil terkirim",
            icon: "success",
            button: "OK",
          });
    }

    const columns = [
        {
            field: "Kendaraan Dimiliki",
            renderCell: (cellEdit) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                            handleOpenCardCustomer(cellEdit.row);
                        }}
                        style={{
                            fontSize: "10px"
                        }}
                    >
                        List Kendaraan
                    </Button>
                );
            },
            minWidth: 200,
        },
        { field: "single_id", headerName: "Single ID", minWidth: 200 },
        { field: "no_rangka", headerName: "No Rangka", minWidth: 250 },
        { field: "nama_customer", headerName: "Customer", minWidth: 250 },
        { field: "nama_stnk", headerName: "Nama STNK", minWidth: 250 },
        { field: "alamat", headerName: "Alamat", minWidth: 250 },
        { field: "kecamatan", headerName: "Kecamatan", minWidth: 250 },
        { field: "telp", headerName: "Telepon", minWidth: 250 },
        { field: "email", headerName: "Email", minWidth: 250 },
        { field: "tipe", headerName: "Kendaraan", minWidth: 250 },
        { field: "asuransi", headerName: "Asuransi", minWidth: 250 },
        { field: "asuransi_type", headerName: "Tipe Asuransi", minWidth: 250 },
        { field: "ket", headerName: "Keterangan", minWidth: 250 },
    ];
    const lastService = "01 November 2023";

    const columnsCustCar = [
        {
            field: "Action",
            renderCell: (cellEdit) => {
                return (
                    <button className="btn btn-secondary btn-sm">
                        <i className="ri-information-line"></i> Detail
                    </button>
                );
            },
            minWidth: 100,
        },
        { field: "no_rangka", headerName: "VIN", minWidth: 150 },
        { field: "nama_stnk", headerName: "Nama STNK", minWidth: 145 },
        { field: "tgl_stnk", headerName: "Tanggal STNK", minWidth: 145 },
        { field: "tipe", headerName: "Kendaraan", minWidth: 100 },
        { field: "tgl_service", headerName: "Last Service", minWidth: 150 },
        { field: "tgl_do", headerName: "Tanggal DO", minWidth: 150 }
    ];

    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
          },
          title: {
            display: true,
            text: '',
          },
          datalabels: {
            
          },
        },
        onClick: (event, elements) => {
            // Menggunakan console.log untuk menampilkan indeks elemen yang diklik ke konsol
            if (elements.length > 0) {
              const clickedIndex = elements[0].index;
              console.log(`Bar yang diklik: ${tipeKendaraan[clickedIndex]}`);
            }
        },
    };


    // START CHART TOP 5
    const [topSalesNameArr, setTopSalesName] = useState([]);
    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getTopSales = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/chart/topfive/sales?bulan=${bulan}&tahun=${tahun}`;
            try {
                const response = await axios.get(url);
                setTopSalesName(response.data.top_sales);
            } catch (error) {
                console.log(error);
            }
        };
        getTopSales();
    }, [bulan, tahun]);

    // END CHART TOP 5
    const topSalesName = topSalesNameArr.nama_sales;
    const dataChartSales = {
        labels: topSalesName,
        datasets: [
          {
            label: 'Jumlah Terjual',
            data: topSalesNameArr.total_penjualan,
            backgroundColor: 'rgb(251, 146, 60)',
            datalabels: {
                display: true,
                // anchor: 'end', // Menempatkan label di dalam batang
                align: 'middle', // Posisi label di atas batang
                rotation: 0, // Memutar label tegak lurus
                color: "white",
                font: {
                    size: 11, // Atur ukuran font
                },
                formatter: (value, context) => {
                  // Menggunakan labelsByModel untuk mendapatkan label yang sesuai
                  return value + '';
                },
            },
          }
        ],
    };
    
    
    const [topCarNameArr, setTopCarName] = useState([]);
    const [startdate, setStartDate] = useState("2024-01-01");
    const [enddate, setEndDate] = useState("2024-01-10");
    
    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getTopCar = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/chart/topfive/car?startdate=${startdate}&enddate=${enddate}`;
            try {
                const response = await axios.get(url);
                setTopCarName(response.data.top_car);
            } catch (error) {
                console.log(error);
            }
        };
        getTopCar();
    }, [startdate, enddate]);

    const tipeKendaraan = topCarNameArr.nama_car;

    // Labels khusus untuk setiap tipe mobil
    const labelsByModel = {
        Raize: 'RAIZE 1.2 G M/T - ONE TONE',
        Avanza: 'Avanza 1.5 G CVT',
        Veloz: 'Veloz 1.5 Q CVT',
        'Kijang Innova': 'Kijang Innova Zenix 2.0 G CVT',
        'Yaris Cross': 'YARIS CROSS 1.5 HV GR CVT TSS PREMIUM COLOR TWO TONE',
    };
    const qtySold = topCarNameArr.total_penjualan;
    const dataChartKendaraan = {
        labels: tipeKendaraan,
        datasets: [
          {
            label: 'Jumlah Terjual',
            data: qtySold, 
            backgroundColor: 'rgb(59, 130, 246)',
            datalabels: {
                display: true,
                // anchor: 'end',
                align: 'middle',
                // rotation: -90,
                color: "white",
                font: {
                    size: 11, // Atur ukuran font
                },
                formatter: (value, context) => {
                    // Menggunakan labelsByModel untuk mendapatkan label yang sesuai
                    //   return tipeKendaraan[context.dataIndex] + '\n' + value + ' Terjual';
                    return value + '';
                },
            },
          }
        ],
    };

    // Ultah
    const [openUltah, setopenUltah] = React.useState(false);
    const showListUltah = (event) => {
        setopenUltah(true);
    }

    const closeUltah = (event) => {
        setopenUltah(false);
    }

    const customStylesUltah = {
        rows: {
            style: {
                minHeight: '50px', // override the row height
            },
        },
        headCells: {
            style: {
                background: "#EF4444",
                color: "white",
                textAlign: "center",
                width: "200px"
            },
        }
    };

    const columnsUltah = [
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer,
            sortable: true,
        },
        {
            name: 'Tanggal Ulang Tahun',
            selector: row => row.tgl_ultah,
            sortable: true,
        },
        {
            name: 'Nama Sales',
            selector: row => row.nama_sales,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                <span key={row.someUniqueKey} style={{ fontSize: "10px"}} className={`badge ${row.reminder_status === "1" ? ' bg-success' : ' bg-dark'}`}>
                    {row.reminder_status === "1" ? 'Done' : 'Waiting'}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Aksi',
            cell: row => (
                <>
                    <a href={"https://wa.me/"+row.no_telp+"?text=Selamat Ulang Tahun, Bapak/Ibu "+row.nama_customer} target="__blank" type="button" className="btn btn-info btn-sm"><i className="ri-mail-send-fill"></i></a>
                    <a type="button" className={`btn btn-success btn-sm ${rulesName === "superadmin" ? "" : "d-none"}`} onClick={(event) => {
                            handleUpdateStatus(row.single_id, row.nama_customer, row.nama_sales, row.no_telp, 'ultah', 1);
                        }} style={{marginLeft: "5px", cursor: "pointer"}}><i className="ri-checkbox-circle-fill"></i></a>
                </>
            ),
        },
    ];

    // stnk
    const [openstnk, setopenstnk] = React.useState(false);
    const [listStnk, setListStnk] = useState([]);
    const [totalStnk, setTotalStnk] = useState("");

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getStnk = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/list/notif_stnk`;
            try {
                const response = await axios.get(url);
                setTotalStnk(response.data.total);
                setListStnk(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getStnk();
    }, []);
    
    const showListStnk = (event) => {
        setopenstnk(true);
    }

    const handleShowAll = (event) => {
        window.location.href = "/car/list";
    }

    const closestnk = (event) => {
        setopenstnk(false);
    }

    const customStylesstnk = {
        rows: {
            style: {
                minHeight: '50px', // override the row height
            },
        },
        headCells: {
            style: {
                background: "#EF4444",
                color: "white",
                textAlign: "center",
                width: "200px"
            },
        }
    };

    const columnsstnk = [
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer,
            sortable: true,
        },
        {
            name: 'Tanggal STNK',
            selector: row => row.tgl_stnk,
            sortable: true,
        },
        {
            name: 'Nama Sales',
            selector: row => row.nama_sales,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                <span key={row.someUniqueKey} style={{ fontSize: "10px"}} className={`badge ${row.reminder_status === "1" ? ' bg-success' : ' bg-dark'}`}>
                    {row.reminder_status === "1" ? 'Done' : 'Waiting'}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Aksi',
            cell: row => (
                <>
                    <a href={"https://wa.me/"+row.no_telp+"?text=STNK akan habis Bapak/Ibu "+row.nama_customer} target="__blank" type="button" className="btn btn-info btn-sm"><i className="ri-mail-send-fill"></i></a>
                    <a type="button" className={`btn btn-success btn-sm ${rulesName === "superadmin" ? "" : "d-none"}`} onClick={(event) => {
                            handleUpdateStatus(row.single_id,'stnk');
                        }} style={{marginLeft: "5px", cursor: "pointer"}}><i className="ri-checkbox-circle-fill"></i></a>
                </>
            ),
        },
    ];
    
    const datastnk = [
        {
            id: 1,
            customer_name: 'Luis Milla',
            tgl_stnk: '14 November 2023',
        },
        {
            id: 2,
            customer_name: 'Ciro Alves',
            tgl_stnk: '14 November 2023'
        },
        {
            id: 3,
            customer_name: 'Hariono',
            tgl_stnk: '14 November 2023'
        },
        
    ];

    // service
    const [openservice, setopenservice] = React.useState(false);
    const [listservice, setListservice] = useState([]);
    const [totalservice, setTotalservice] = useState("");

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getservice = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/list/notif_service`;
            try {
                const response = await axios.get(url);
                setTotalservice(response.data.total);
                setListservice(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getservice();
    }, []);
    
    const showListservice = (event) => {
        setopenservice(true);
    }

    const closeservice = (event) => {
        setopenservice(false);
    }

    const customStylesservice = {
        rows: {
            style: {
                minHeight: '50px', // override the row height
            },
        },
        headCells: {
            style: {
                background: "#EF4444",
                color: "white",
                textAlign: "center",
                width: "200px"
            },
        }
    };

    const columnsservice = [
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer,
            sortable: true,
        },
        {
            name: 'Nama Sales',
            selector: row => row.nama_sales,
            sortable: true,
        },
        {
            name: 'Next service',
            selector: row => row.next_service,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                <span key={row.someUniqueKey} style={{ fontSize: "10px"}} className={`badge ${row.reminder_status === "1" ? ' bg-success' : ' bg-dark'}`}>
                    {row.reminder_status === "1" ? 'Done' : 'Waiting'}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Aksi',
            cell: row => (
                <>
                    <a href={"https://wa.me/"+row.no_telp+"?text=Pemberitahuan Reminder Service, Bapak/Ibu "+row.nama_customer} target="__blank" type="button" className="btn btn-info btn-sm"><i className="ri-mail-send-fill"></i></a>
                    <a type="button" className={`btn btn-success btn-sm ${rulesName === "superadmin" ? "" : "d-none"}`} onClick={(event) => {
                            handleUpdateStatus(row.single_id,'service');
                        }} style={{marginLeft: "5px", cursor: "pointer"}}><i className="ri-checkbox-circle-fill"></i></a>
                </>
                
            ),
        },
    ];

    

    const [inputReminders, setInputsReminder] = useState([]);
    const [inputRemindersStnk, setInputsReminderStnk] = useState([]);
    const [inputRemindersService, setInputsReminderService] = useState([]);

    const handleUpdateStatus = (single_id, type) => {
        
        setLoading(true);
        axios
            .get(`https://api.crm.wijayatoyota.co.id/api/customers/update/reminders?single_id=${single_id}&type=${type}`)
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
    
                    // window.location.href = "/dashboard";
                }
            });
    }

    const handleUpdateStatusStnk = (single_id, nama_customer, nama_sales, no_telp, type, status) => {
        
        setInputsReminderStnk((values) => ({
            ...values,
            ["single_id"]: single_id,
            ["nama_customer"]: nama_customer,
            ["nama_sales"]: nama_sales,
            ["no_telp"]: no_telp,
            ["reminder_type"]: type,
            ["reminder_status"]: 1,
        }));

        setLoading(true);
        axios
            .post("https://api.crm.wijayatoyota.co.id/api/customers/update/reminders", inputRemindersStnk)
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
    
                    // window.location.href = "/dashboard";
                }
            });
    }
    const handleUpdateStatusService = (single_id, nama_customer, nama_sales, no_telp, type, status) => {
        
        setInputsReminderService((values) => ({
            ...values,
            ["single_id"]: single_id,
            ["nama_customer"]: nama_customer,
            ["nama_sales"]: nama_sales,
            ["no_telp"]: no_telp,
            ["reminder_type"]: type,
            ["reminder_status"]: 1,
        }));

        console.log(inputRemindersService);

        setLoading(true);
        // axios
        //     .post("https://api.crm.wijayatoyota.co.id/api/customers/update/reminders", inputRemindersService)
        //     .then(function (response) {
        //         if (response.data.error == true) {
        //             setLoading(false);
        //             swal("Error", 'Data tidak boleh kosong!', "error", {
        //                 buttons: false,
        //                 timer: 2000,
        //             });   
        //         } else {
        //             setLoading(false);
        //             swal("Success", 'Data Berhasil disimpan!', "success", {
        //                 buttons: false,
        //                 timer: 2000,
        //             });
    
        //             // window.location.href = "/dashboard";
        //         }
        //     });
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Dashboard</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item active">
                                        <div id="" style={{background: "#CBD5E1", fontSize: "10px", color: "#0F172A"}} className='p-2'>
                                            Tanggal: <b>{tanggalFormat}</b>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-4 col-md-4">
                        <div className="card card-animate overflow-hidden" style={{cursor: "pointer"}} onClick={showListUltah}>
                            <div className="position-absolute start-0" style={{zIndex: 0}}>
                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                    <path id="Shape 8" className="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                                </svg>
                            </div>
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="text-uppercase fw-medium text-truncate mb-3 text-white">Ulang Tahun</p>
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-0 text-white"><span>{totalUltah} <sup style={{fontSize: '12px'}}>Customers</sup></span></h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id=""><img src="assets/images/icon_wijaya.png" alt="" height="50" style={{opacity: 0.5}} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4">
                        <div className="card card-animate overflow-hidden" style={{cursor: "pointer"}} onClick={showListStnk}>
                            <div className="position-absolute start-0" style={{zIndex: 0}}>
                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                    <path id="Shape 8" className="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                                </svg>
                            </div>
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="text-uppercase fw-medium text-truncate mb-3 text-white">STNK<br/></p>
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-0 text-white"><span>{totalStnk} <sup style={{fontSize: '12px'}}>Customers</sup></span></h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id=""><img src="assets/images/icon_wijaya.png" alt="" height="50" style={{opacity: 0.5}} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4">
                        <div className="card card-animate overflow-hidden" style={{cursor: "pointer"}} onClick={showListservice}>
                            <div className="position-absolute start-0" style={{zIndex: 0}}>
                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                    <path id="Shape 8" className="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                                </svg>
                            </div>
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="text-uppercase fw-medium text-truncate mb-3 text-white">Services<br/></p>
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-0 text-white"><span>{totalservice} <sup style={{fontSize: '12px'}}>Customers</sup></span></h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id=""><img src="assets/images/icon_wijaya.png" alt="" height="50" style={{opacity: 0.5}} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row bg-white">
                    <div className='col-xl-12 col-md-12 mt-2'>
                        <div className="card overflow-hidden" style={{background: "linear-gradient(to right, #141e30, #243b55)", color: "#ffffff"}}>
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-1 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{fontSize: 12}}>Pilih Bulan</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    {/* <input type="date" className="form-control" id="nameInput" placeholder="Enter your name" /> */}
                                                    <select type="date" onChange={handleChange} value={bulan} className="form-select form-select-md" id="nameInput" name="bulan" placeholder="Enter your name" >
                                                        {bulanlist.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-lg-1 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{fontSize: 12}}>Pilih Tahun</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    {/* <input type="date" className="form-control" id="nameInput" placeholder="Enter your name" /> */}
                                                    <select type="date" onChange={handleChange2} value={tahun} className="form-select form-select-md" id="nameInput" name="tahun" placeholder="Enter your name" >
                                                        {tahunlist.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {'Berdasarkan Tipe Kendaraan'} */}
                    <div className="col-xl-6">
                        <div className="card ribbon-box border shadow-none mb-lg-0">
                            <div className="card-body text-muted">
                                <span className="ribbon-three ribbon-three-secondary"><span style={{fontWeight: 500}}>Top 5</span></span>
                                <h5 className="fs-14 text-end mb-3">
                                    <span className="badge badge-label bg-light text-black"><i className="mdi mdi-circle-medium"></i> {"Top 5 Model Kendaraan Terjual"}</span>
                                    <NavLink to="/car/list">Go to Car List</NavLink>
                                </h5>
                                {/* <p className="mb-0"> */}
                                    <Bar options={options} data={dataChartKendaraan} />
                                {/* </p> */}
                            </div>
                            {/* <div id="chartdiv" style={{ width: "100%", height: "300px", fontSize: "10px" }}></div> */}
                        </div>
                    </div>

                    {/* {'Berdasarkan Sales Menjual'} */}
                    <div className="col-xl-6">
                        <div className="card ribbon-box border shadow-none mb-lg-0">
                            <div className="card-body text-muted">
                                <span className="ribbon-three ribbon-three-danger"><span style={{fontWeight: 500}}>Top 5 Sales</span></span>
                                <h5 className="fs-14 text-end mb-3">
                                    <span className="badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> {"Top 5 Penjualan Sales"}</span>
                                </h5>
                                {/* <p className="mb-0"> */}
                                    <Bar options={options} data={dataChartSales} />
                                {/* </p> */}
                            </div>
                            {/* <div id="chartdiv" style={{ width: "100%", height: "300px", fontSize: "10px" }}></div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Start Modal Customer Card */}
            <Dialog
                    open={openCustCard}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    style={{ width: "100%", margin: "0 auto" }}
                >
                    <DialogContent style={{
                        background: "#ecf0f1"
                    }}>
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-xxl-4">
                                        <div className="card">
                                            <div className="row g-0">
                                                <div className="col-md-12">
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-0" style={{fontSize: "17px"}}>Single ID <span className="badge bg-secondary">{singleIdNo}</span></h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="row g-0">
                                                <div className="col-md-4">
                                                    <img className="rounded-start img-fluid h-100 object-fit-cover" src="assets/images/users/user-dummy-img.jpg" alt="Card image" />
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="card-header">
                                                        <h5 className="card-title mb-0">{nameCustomer} <i className="ri-checkbox-circle-fill text-success"></i></h5>
                                                        <span className="card-title mb-0" style={{fontSize: "14px"}}>NIK: {"3277038383338881"}</span>
                                                        <span className="card-title mb-0" style={{fontSize: "12px"}}><i className="ri-shield-user-fill"></i> {singleIdNo}</span>
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="card-text"><span className="text-dark"><i className="ri-car-washing-fill"></i> <b>3</b> Total Kendaraan</span></p>
                                                        <p className="card-text mb-2 text-muted" style={{fontSize: "12px"}}><i className="ri-phone-fill"></i> {"+6281727364737"}</p>
                                                        <p className="card-text mb-2 text-muted" style={{fontSize: "12px"}}><i className="ri-cake-2-line"></i> {"13 November 2023"} <span className="badge bg-primary">Hari ini berulang tahun</span></p>
                                                        <p className="card-text mb-2" style={{fontSize: "12px"}}>Jl. Ir. H. Juanda No.131, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="row g-0">
                                                <div className="col-md-12">
                                                    <div className="card-header">
                                                        <span className="card-title mb-0" style={{fontSize: "15px", fontWeight: 500}}><i className="ri-calendar-event-fill"></i> {"List Masa Tenggat STNK Bulan Ini"}</span>
                                                    </div>
                                                    <div className="card-body" style={{overflow: "y", maxHeight: 100}}>
                                                        <ul className="list-group">
                                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                                <span style={{fontSize: 11}}><b>123456789012345</b> - RAIZE - LUIS MILLA<br></br> <span className="text-muted">Tanggal STNK: 15 November 2023</span></span> 
                                                                <button className="btn btn-success btn-sm" onClick={alertNotifSend}><i className="ri-send-plane-2-line"></i> Kirim Reminder</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-8">
                                        <div className="card">
                                            <div className="row g-0">
                                                <div className="col-md-12">
                                                    <div className="card-header">
                                                        <h5 className="card-title mb-0">Data Kendaraan</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <TableContainer style={{ height: 395, width: "100%", fontSize: "10px" }} className="p-1 mb-2">
                                                            <DataGrid
                                                                rows={dataProspek}
                                                                rowCount={rowCountState}
                                                                loading={isLoading}
                                                                componentsProps={{
                                                                    toolbar: {
                                                                        showQuickFilter: true,
                                                                        quickFilterProps: { debounceMs: 500 },
                                                                    },
                                                                }}
                                                                disableColumnFilter
                                                                disableColumnSelector
                                                                disableDensitySelector
                                                                rowsPerPageOptions={[25, 50, 100]}
                                                                pagination
                                                                page={page}
                                                                pageSize={pageSize}
                                                                paginationMode="server"
                                                                onPageChange={(newPage) => setPage(newPage)}
                                                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                                columns={columnsCustCar}
                                                                className={classes.noTableHover}
                                                            />
                                                        </TableContainer>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-xl-12 col-md-12'>
                                <div className="card overflow-hidden">
                                    <div className="card-header" style={{border: "none"}}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="card-title mb-0" style={{fontSize: "17px"}}>Data Unit 
                                                    <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i> {"123456789012345"}</span>
                                                    <span className="badge badge-label bg-primary" style={{fontSize: "12px"}}><i className="mdi mdi-circle-medium"></i> {"Tanggal STNK: 14 November 2023"}</span>
                                                </h5>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button type="button" className="btn btn-danger btn-sm"><i className="ri-close-circle-fill"></i> Close</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{zIndex: 1}}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <table className="table table-bordered align-middle table-nowrap mb-0">
                                                    <thead style={{background: "#E2E8F0"}}>
                                                        <tr>
                                                            <th colSpan={2} style={{padding: "7px", fontSize: "12px"}}>Informasi Penjualan</th>
                                                        </tr>
                                                        <tr style={{padding: "7px", fontSize: "12px"}}>
                                                            <th scope="col">Tanggal DO</th>
                                                            <th scope="col">Sales Penjualan</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-muted">05 November 2023</td>
                                                            <td className="text-muted">Wahyu</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>Leasing</td>
                                                            <td className="text-muted">TAFS</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>Asuransi</td>
                                                            <td className="text-muted">TUGU INSURANCE</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>DO Asal</td>
                                                            <td className="text-muted">Dago / Padalarang / Subang / Ahmad Yani</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="col-md-4">
                                                <table className="table table-bordered align-middle table-nowrap mb-0">
                                                    <thead style={{background: "#E2E8F0"}}>
                                                        <tr>
                                                            <th colSpan={2} style={{padding: "7px", fontSize: "12px"}}>Informasi Kendaraan <button style={{fontSize: "11px"}} className="btn btn-sm btn-primary"><i className="ri-history-line"></i> History</button></th>
                                                        </tr>
                                                        <tr style={{padding: "7px", fontSize: "12px"}}>
                                                            <th scope="col">VIN</th>
                                                            <th scope="col">No Polisi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-muted">123456789012345</td>
                                                            <td className="text-muted">B 2283 KDS</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>Type</td>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>Warna</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-muted">RAIZE</td>
                                                            <td className="text-muted">HITAM</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>Nama STNK</td>
                                                            <td className="text-muted">LUIS MILLA</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="col-md-4">
                                                <table className="table table-bordered align-middle table-nowrap mb-0">
                                                    <thead style={{background: "#E2E8F0"}}>
                                                        <tr>
                                                            <th colSpan={2} style={{padding: "7px", fontSize: "12px"}}>Informasi Service</th>
                                                        </tr>
                                                        <tr style={{padding: "7px", fontSize: "12px"}}>
                                                            <th scope="col">Nama Pemakai</th>
                                                            <th scope="col">Tanggal Service</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-muted">Alberto</td>
                                                            <td className="text-muted">11 November 2023</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>Keterangan Service</td>
                                                            <td className="text-muted">Ganti Oli</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>Lokasi Service</td>
                                                            <td className="text-muted">Dago / Padalarang / Ahmad Yani / Subang</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{background: "#E2E8F0", fontWeight: "600"}}>No Telepon Pemakai</td>
                                                            <td className="text-muted">
                                                                087837383738 <button className="btn btn-info btn-sm" onClick={alertNotifSend}><i className="ri-phone-fill"></i></button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
            </Dialog>
            {/* End Modal Customer Card */}

            {/* Start Modal Ultah */}
            <Dialog
                    open={openUltah}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={handleClose}
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
                                                        <h5 className="card-title mb-0" style={{fontSize: "17px"}}>List Ulang Tahun </h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <button type="button" className="btn btn-danger btn-sm" onClick={closeUltah}><i className="ri-close-circle-fill"></i> Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12 mt-2 p-3">
                                                        <DataTable
                                                            columns={columnsUltah}
                                                            data={listUltah}
                                                            pagination
                                                            customStyles={customStylesUltah}
                                                            defaultSortFieldId={1}
                                                        />
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
            {/* End Modal Ultah */}

            {/* Start Modal STNK */}
            <Dialog
                    open={openstnk}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={handleClose}
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
                                                        <h5 className="card-title mb-0" style={{fontSize: "17px"}}>List STNK </h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <button type="button" className="btn btn-danger btn-sm" onClick={closestnk}><i className="ri-close-circle-fill"></i> Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12 mt-2 p-3">
                                                        <DataTable
                                                            columns={columnsstnk}
                                                            data={listStnk}
                                                            pagination
                                                            customStyles={customStylesUltah}
                                                            defaultSortFieldId={1}
                                                        />
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
            {/* End Modal STNK */}

            {/* Start Modal Service */}
            <Dialog
                    open={openservice}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={handleClose}
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
                                                        <h5 className="card-title mb-0" style={{fontSize: "17px"}}>List service </h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <button type="button" className="btn btn-danger btn-sm" onClick={closeservice}><i className="ri-close-circle-fill"></i> Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12 mt-2 p-3">
                                                        <DataTable
                                                            columns={columnsservice}
                                                            data={listservice}
                                                            pagination
                                                            customStyles={customStylesUltah}
                                                            defaultSortFieldId={1}
                                                        />
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
            {/* End Modal STNK */}
        </div>
    );
}

export default Dashboard;
