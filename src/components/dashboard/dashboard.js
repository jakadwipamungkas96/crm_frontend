import React, { useEffect, useState,  useLayoutEffect, useRef } from "react";

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

    const [listUltah, setListUltah] = useState([]);
    const [totalUltah, setTotalUltah] = useState("");

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getUltah = async () => {
            const url = `http://127.0.0.1:8000/api/list/notif_birthday`;
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

    const [lsDtCustomer, setLsDtCustomer] = useState([]);
    
    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/customers/datacustomer?page=${page}&size=${pageSize}`;
            try {

                const response = await axios.get(url);
                setDataProspek(response.data.data);
                setDataProspek2(response.data);
                setLoading(false);
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

    // Amchart
    // const series1Ref = useRef(null);
    // const xAxisRef = useRef(null);
    // let dataChart = [
    //     {
    //       category: "Rush 1.5 GR A/T",
    //       value1: 100
    //     },
    //     {
    //       category: "RAIZE 1.0T S CVT - TWO TONE",
    //       value1: 150
    //     },
    //     {
    //       category: "Veloz 1.5 Q CVT",
    //       value1: 200
    //     },
    //     {
    //       category: "Kijang Innova Zenix 2.0 G CVT",
    //       value1: 230
    //     }
    //   ];

    // useLayoutEffect(() => {
    //     let root = am5.Root.new("chartdiv");
    
    //     root.setThemes([am5themes_Animated.new(root)]);
    
    //     let chart = root.container.children.push(
    //       am5xy.XYChart.new(root, {
    //         panY: false,
    //         layout: root.verticalLayout
    //       })
    //     );
    
    //     // Create Y-axis
    //     let yAxis = chart.yAxes.push(
    //       am5xy.ValueAxis.new(root, {
    //         renderer: am5xy.AxisRendererY.new(root, {})
    //       })
    //     );
    
    //     // Create X-Axis
    //     let xAxis = chart.xAxes.push(
    //       am5xy.CategoryAxis.new(root, {
    //         renderer: am5xy.AxisRendererX.new(root, {}),
    //         categoryField: "category"
    //       })
    //     );
    
    //     // Create series
    //     let series1 = chart.series.push(
    //       am5xy.ColumnSeries.new(root, {
    //         name: "Kendaraan",
    //         xAxis: xAxis,
    //         yAxis: yAxis,
    //         valueYField: "value1",
    //         categoryXField: "category",
    //         tooltip: am5.Tooltip.new(root, {
    //             labelText: "{valueY} Kendaraan",
    //         })
    //       })
    //     );
    
    //     // Add legend
    //     // let legend = chart.children.push(am5.Legend.new(root, {}));
    //     // legend.data.setAll(chart.series.values);
    
    //     // Add cursor
    //     chart.set("cursor", am5xy.XYCursor.new(root, {}));
    
    //     xAxisRef.current = xAxis;
    //     series1Ref.current = series1;
    
    //     return () => {
    //       root.dispose();
    //     };
    // }, []);

    // // This code will only run when props.data changes
    // useLayoutEffect(() => {
    //     xAxisRef.current.data.setAll(dataChart);
    //     series1Ref.current.data.setAll(dataChart);
    // }, [dataChart]);

    // Chartjs
    const tipeKendaraan = ["Raize", "Avanza", "Veloz", "Kijang Innova", "Yaris Cross"];
    const topSalesName = ["AGUS SUTISNA", "ARISANDI", "BAYU AJI RAMADHAN", "HERMANTO", "HILMAN"];

    // Labels khusus untuk setiap tipe mobil
    const labelsByModel = {
        Raize: 'RAIZE 1.2 G M/T - ONE TONE',
        Avanza: 'Avanza 1.5 G CVT',
        Veloz: 'Veloz 1.5 Q CVT',
        'Kijang Innova': 'Kijang Innova Zenix 2.0 G CVT',
        'Yaris Cross': 'YARIS CROSS 1.5 HV GR CVT TSS PREMIUM COLOR TWO TONE',
    };

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

    const qtySold = [100, 150, 200, 230, 250];
    const dataChartKendaraan = {
        labels: tipeKendaraan,
        datasets: [
          {
            label: 'Jumlah Terjual',
            data: qtySold, 
            backgroundColor: 'rgb(96, 165, 250)',
            datalabels: {
                display: true,
                anchor: 'end',
                align: 'start',
                rotation: -90,
                color: "white",
                font: {
                    size: 11, // Atur ukuran font
                },
                formatter: (value, context) => {
                  // Menggunakan labelsByModel untuk mendapatkan label yang sesuai
                  return tipeKendaraan[context.dataIndex] + '\n' + value + ' Terjual';
                },
            },
          }
        ],
    };

    const dataChartSales = {
        labels: topSalesName,
        datasets: [
          {
            label: 'Jumlah Terjual',
            data: [50, 75, 100, 125, 150],
            backgroundColor: 'rgb(251, 146, 60)',
            datalabels: {
                display: true,
                anchor: 'end', // Menempatkan label di dalam batang
                align: 'start', // Posisi label di atas batang
                rotation: -90, // Memutar label tegak lurus
                color: "white",
                font: {
                    size: 11, // Atur ukuran font
                },
                formatter: (value, context) => {
                  // Menggunakan labelsByModel untuk mendapatkan label yang sesuai
                  return value + ' DO';
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
            name: 'Aksi',
            cell: row => <button type="button" className="btn btn-info btn-sm btn-label"><i className="ri-mail-send-fill label-icon align-middle fs-16 me-2"></i> Kirim Ucapan</button>,
        },
    ];

    // stnk
    const [openstnk, setopenstnk] = React.useState(false);
    const [listStnk, setListStnk] = useState([]);
    const [totalStnk, setTotalStnk] = useState("");

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getStnk = async () => {
            const url = `http://127.0.0.1:8000/api/list/notif_stnk`;
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
            name: 'Aksi',
            cell: row => <button type="button" className="btn btn-info btn-sm btn-label"><i className="ri-mail-send-fill label-icon align-middle fs-16 me-2"></i> Kirim Reminder</button>,
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
                    <div className='col-xl-12 col-md-12'>
                        <div className="card overflow-hidden">
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-1 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{fontSize: 12}}>Start Date</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input type="date" className="form-control" id="nameInput" placeholder="Enter your name" />
                                                </div>
                                                <div className="col-lg-1 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{fontSize: 12}}>End Date</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input type="date" className="form-control" id="nameInput" placeholder="Enter your name" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6 col-md-6">
                        <div className="card card-animate overflow-hidden" onClick={showListUltah}>
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
                    <div className="col-xl-6 col-md-6">
                        <div className="card card-animate overflow-hidden" onClick={showListStnk}>
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
                </div>

                <div className="row">
                    {/* {'Berdasarkan Tipe Kendaraan'} */}
                    <div className="col-xl-6">
                        <div className="card ribbon-box border shadow-none mb-lg-0">
                            <div className="card-body text-muted">
                                <span className="ribbon-three ribbon-three-secondary"><span style={{fontWeight: 500}}>Top 5</span></span>
                                <h5 className="fs-14 text-end mb-3">
                                    <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i> {"Penjualan Kendaraan"}</span>
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
                                    <span className="badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> {"Penjualan Sales"}</span>
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
        </div>
    );
}

export default Dashboard;
