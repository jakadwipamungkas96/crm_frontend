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

function Carlist() {
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

    // Fungsi untuk mengupdate daftar tahun
    const tahunlist = [];
    const [bulan, setBulan] = React.useState(bulanHariIni);
    const [tahun, setTahun] = React.useState(tahunHariIni);
    const idCab = JSON.parse(localStorage.getItem("id_cabang"));

    const monthday = new Date();
    const firstDayOfMonth = `${monthday.getFullYear()}-${(monthday.getMonth() + 1).toString().padStart(2, '0')}`;
    const defEndDate = new Date().toISOString().split('T')[0];
    const [startdate, setStartDate] = useState(firstDayOfMonth + '-01');
    const [enddate, setEndDate] = useState(defEndDate);
    const [refreshDt, setRefresh] = useState();
    const [inputCabang, setInputCabang] = useState(idCab);

    function handleStartDate(event) {
        setStartDate(event.target.value);
    }

    function handleEndDate(event) {
        setEndDate(event.target.value);
    }

    function handleTerapkan() {
        setRefresh(new Date());
    }

    const handleChangeInputCabang = (event) => {
        setInputCabang(event.target.value);
    }

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

    const [loadingTable, setLoadingTable] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);

    const [lsDtCar, setLsDtCar] = useState([]);
    const [infoRange, setInfoRange] = useState();

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `https://api.crm.wijayatoyota.co.id/api/car/list_car_sale?startdate=${startdate}&enddate=${enddate}&id_cabang=${inputCabang}`;
            try {
                const response = await axios.get(url);
                setLsDtCar(response.data.data);
                setInfoRange(response.data.range);
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
        headCells: {
            style: {
                background: "#DC2626",
                color: "white",
                textAlign: "center"
            },
        }
    };

    const columnsLsCar = [
        {
            name: 'Model Type',
            selector: row => row.tipe,
            sortable: true,
            width: '40%',
        },
        {
            name: 'Tanggal DO',
            selector: row => row.tgl_do,
            sortable: true,
            width: '20%',
        },
        {
            name: 'Usia Kendaraan',
            selector: row => row.usia_kendaraan,
            sortable: true,
            width: '20%',
        },
        {
            name: 'Total Terjual',
            selector: row => row.total_penjualan,
            sortable: true,
            width: '20%',
        }
    ];

    const handleSearch = (text) => {
        setSearchText(text);
    };

    // Logika pencarian, memfilter data berdasarkan beberapa kolom
    const filteredData = lsDtCar.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    // Jika searchText kosong, tampilkan semua data
    const displayData = searchText ? filteredData : lsDtCar;

    function createBadgeHTML(data) {
        const statusValues = data.status.split(',').map(s => s.trim());
        const badgeHTML = statusValues.map(status => `<span className="badge">${status}</span>`).join(' ');

        return badgeHTML;
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Data Penjualan Kendaraan</h4>

                            <div className="page-title-right">

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
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-1">
                                                    <label htmlFor="nameInput" className="form-label" style={{ fontSize: 12 }}>Start Date</label>
                                                </div>
                                                <div className="col-lg-2">
                                                    <input type="date" onChange={handleStartDate} value={startdate} className="form-control form-control-sm" id="nameInput" name="bulan" placeholder="Enter your name" />
                                                </div>
                                                <div className="col-lg-1">
                                                    <label htmlFor="nameInput" className="form-label" style={{ fontSize: 12 }}>End Date</label>
                                                </div>
                                                <div className="col-lg-2">
                                                    <input type="date" onChange={handleEndDate} value={enddate} min={startdate} className="form-control form-control-sm" id="nameInput" name="tahun" placeholder="Enter your name" />
                                                </div>
                                                <div className="col-lg-2">
                                                    <select type="file" name="cabang_id" id="cabang_id" onChange={handleChangeInputCabang} value={inputCabang} disabled={idCab === 5 ? false : true} className={`form-control form-control-sm `}>
                                                        <option value={''}>-- Pilih Cabang --</option>
                                                        <option value={1}>WML</option>
                                                        <option value={2}>WLD</option>
                                                        <option value={3}>WLP</option>
                                                        <option value={4}>WLS</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-3">
                                                    <button onClick={handleTerapkan} type="button" className="btn btn-sm btn-primary"><i className=" ri-user-search-line"></i> Go</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="flex-grow-1 overflow-hidden">
                                        Summary Penjualan Kendaraan <b> {infoRange}</b>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" className='p-2'>
                                            <input
                                                className="form-control form-control-sm"
                                                type="text"
                                                value={searchText}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                placeholder="Search..."
                                                style={{ width: "100%" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {loadingTable ? (
                                    <div className="text-center ">
                                        <i className="mdi mdi-spin mdi-loading" style={{ fontSize: "30px", color: "#991B1B" }}></i> <h6 className="m-0 loading-text">Please wait...</h6>
                                    </div>
                                ) : (


                                    <DataTable
                                        columns={columnsLsCar}
                                        data={displayData}
                                        pagination
                                        paginationPerPage={10}
                                        customStyles={customStyles}
                                        // defaultSortFieldId={1}
                                        onSearch={handleSearch} // Menambahkan fungsi pencarian
                                    />

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carlist;
