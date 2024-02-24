import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import CryptoJS from 'crypto-js';
import DataTable from 'react-data-table-component';

import axios from 'axios';
import swal from 'sweetalert';

const useStyles = makeStyles({
    noTableHover: {
        '& tbody tr:hover': {
            background: 'none', // Menghapus latar belakang pada hover
        },
    },
});

function Bucket() {
    const classes = useStyles();

    const hariIni = new Date();
    const tanggal = hariIni.getDate();
    const bulanHariIni = hariIni.getMonth() + 1; // Perlu ditambah 1 karena indeks bulan dimulai dari 0
    const tahunHariIni = hariIni.getFullYear();
    const namaBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Fungsi untuk mengupdate daftar tahun
    const tahunlist = [];
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

    // Format tanggal dengan format "DD/MM/YYYY"
    const tanggalFormat = tanggal + ' ' + namaBulan[hariIni.getMonth()] + ' ' + tahunHariIni;

    const [lsDtBucket, setLsDtBucket] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const idCab = JSON.parse(localStorage.getItem("id_cabang"));
    const monthday = new Date();
    const firstDayOfMonth = `${monthday.getFullYear()}-${(monthday.getMonth() + 1).toString().padStart(2, '0')}`;
    const defEndDate = new Date().toISOString().split('T')[0];
    const [startdate, setStartDate] = useState(firstDayOfMonth + '-01');
    const [enddate, setEndDate] = useState(defEndDate);
    const [refreshDt, setRefresh] = useState();
    const [inputCabang, setInputCabang] = useState(idCab);
    const rulesName = JSON.parse(localStorage.getItem("rules"));

    const handleChangeInputCabang = (event) => {
        setInputCabang(event.target.value);
    }

    function handleTerapkan() {
        setRefresh(new Date());
    }

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/bucketlist?id_cabang=${inputCabang}`;
            try {
                const response = await axios.get(url);
                setLsDtBucket(response.data.data);
                setLoadingTable(false);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [refreshDt]);

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

    const handleOpenKlaim = (event) => {
        axios
            .post("http://127.0.0.1:8000/api/bucket/klaim", {
                single_id: event.single_id
            })
            .then(function (response) {
                if (response.data.error == true) {
                    swal("Error", 'Data gagal diklaim', "error", {
                        buttons: false,
                        timer: 2000,
                    });
                } else {
                    swal("Success", 'Customer Berhasil diklaim, segera lakukan Follow Up!', "success", {
                        buttons: false,
                        timer: 2000,
                    });

                    setRefresh(new Date());
                }
            });
    }

    const columnsLsBucket = [,
        // {
        //     name: 'Status Share',
        //     selector: row => (
        //         <span key={row.someUniqueKey} style={{ fontSize: "10px" }} className={`badge border ${parseInt(row.status_klaim) === 0 ? ' border-secondary text-secondary' : ' border-success text-success'}`}>
        //             {row.status_klaim === 0 ? 'Pending' : 'Done'}
        //         </span>
        //     ),
        //     sortable: true,
        //     width: '150px',
        // },
        {
            name: 'Status Buckets',
            selector: row => {
                if (rulesName == 'sales') {
                    if (row.flagging_check === 1) {
                        return <span className={`badge border border-success text-success`}>
                            Terklaim
                        </span>
                    } else {
                        return <button className={`btn btn-sm btn-primary`} onClick={(event) => handleOpenKlaim(row)}>
                            Klaim
                        </button>
                    }
                } else {
                    return <span key={row.someUniqueKey} style={{ fontSize: "10px" }} className={`badge border ${parseInt(row.status_klaim) === 0 ? ' border-secondary text-secondary' : ' border-success text-success'}`}>
                        {row.status_klaim === 0 ? 'Pending' : 'Done'}
                    </span>
                }
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'Single ID',
            selector: row => row.single_id,
            sortable: true,
            width: '130px',
        },
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Nama Sales',
            selector: row => row.nama_sales,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Tanggal Expired Klaim',
            selector: row => row.expired_at,
            sortable: true,
            width: '250px',
        },
        
        {
            name: 'Status Klaim',
            selector: row => row.flagging_check,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Tanggal Share',
            selector: row => row.sharing_at,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Alamat',
            selector: row => row.alamat,
            sortable: true,
            width: '250px',
        },
        {
            name: 'No Telepon',
            selector: row => {
                if (row.flagging_check === 1) {
                    return row.no_telp
                } else {
                    return ""
                }
            },
            sortable: true,
            width: '250px',
        },
        {
            name: 'Nama SPV',
            selector: row => row.nama_spv,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Tipe Kendaraan',
            selector: row => row.tipe,
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
            name: 'Usia Kendaraan',
            selector: row => row.usia_kendaraan,
            sortable: true,
            width: '200px',
        },
    ];

    const handleSearch = (text) => {
        setSearchText(text);
    };

    // Logika pencarian, memfilter data berdasarkan beberapa kolom
    const filteredData = lsDtBucket.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    // Jika searchText kosong, tampilkan semua data
    const displayData = searchText ? filteredData : lsDtBucket;


    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Data Bucket Customers</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item active">
                                        <div id="" style={{ background: "#CBD5E1", fontSize: "10px", color: "#0F172A" }} className='p-2'>
                                            Tanggal: <b>{tanggalFormat}</b>
                                        </div>
                                    </li>
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
                                        <form action="">
                                            <div className="row">
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
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            value={searchText}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Search..."
                                            style={{ width: "20%" }}
                                        />
                                        <i><small className="text-danger">Segera klaim customer sebelum melebihi tanggal expired</small></i>
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
                                        columns={columnsLsBucket}
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

export default Bucket;
