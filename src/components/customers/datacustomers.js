import React, { useEffect, useState } from "react";

import axios from 'axios';
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
import IconButton from '@mui/material/IconButton';
import Slide from "@mui/material/Slide";
import CryptoJS from 'crypto-js';
import e from "cors";

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

function formatDate() {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const formattedDate = `${day} ${months[monthIndex]}`;
    return formattedDate;
}

function Datacustomers() {
    const classes = useStyles();

    const currentDateFormatted = formatDate();

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
    const [isLoading, setLoading] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const cabangName = localStorage.getItem("cabang_name");
    const rulesName = JSON.parse(localStorage.getItem("rules"));
    const personName = JSON.parse(localStorage.getItem("person"));
    const cleanedCabangName = cabangName.replace(/"/g, '');
    const idCab = localStorage.getItem("id_cabang");

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const [lsDtCustomer, setLsDtCustomer] = useState([]);
    const monthday = new Date();
    const firstDayOfMonth = `${monthday.getFullYear()}-${(monthday.getMonth() + 1).toString().padStart(2, '0')}`;
    const defEndDate = new Date().toISOString().split('T')[0];
    const [startdate, setStartDate] = useState(firstDayOfMonth + '-01');
    const [enddate, setEndDate] = useState(defEndDate);

    useEffect(() => {
        setLoading(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/customers/datacustomer?page=${currentPage}&size=${perPage}&startdate=${startdate}&enddate=${enddate}`;
            try {

                const response = await axios.get(url);
                setLoading(false);
                setLsDtCustomer(response.data.data);
                // setTotalRows(response.data.pagination.total);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [currentPage, perPage, startdate, enddate, refreshDt]);

    const handleRowsPerPageChange = (newPerPage, currentPage) => {
        setPerPage(newPerPage);
        setCurrentPage(currentPage);
    };

    const handlePageChange = (page) => {
        console.log(page);
        setCurrentPage(page);
    };

    const alertNotifSend = (event) => {
        swal({
            title: "Reminder berhasil terkirim",
            icon: "success",
            button: "OK",
        });
    }

    // START List Data Customer
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
            cell: row => <>
                {/* <button style={{fontSize: "12px"}} type="button" className={`btn btn-secondary btn-sm ${rulesName == 'sales' ? '' : 'd-none'}`}> */}
                <button style={{ fontSize: "12px" }} type="button" onClick={(event) => { handleOpenEditCust(row); }} className={`btn btn-secondary btn-sm ${rulesName != 'sa' ? '' : 'd-none'}`}>
                    <i className="ri-edit-2-line"></i> <strong>Update</strong>
                </button>
                <button onClick={(event) => { handleOpenCardCustomer(row); }} style={{ fontSize: "12px", marginLeft: "10px" }} type="button" className="btn btn-primary btn-sm">
                    <span className="badge bg-success ms-1">{row.total_kendaraan}</span> <strong>Kendaraan</strong>
                </button>
            </>,
            width: "250px"
        },
        {
            name: 'Single ID',
            selector: row => row.single_id,
            sortable: true,
        },
        {
            name: 'Nama Customer',
            selector: row => row.nama_customer,
            sortable: true,
            width: "300px"
        },
        {
            name: 'Total Kendaraan',
            selector: row => row.total_kendaraan,
            sortable: true,
            width: "150px"
        },
        {
            name: 'No Telepon',
            selector: row => row.telp,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Alamat',
            selector: row => row.alamat,
            sortable: true,
            width: "300px"
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

    const displayData = searchText ? filteredData : lsDtCustomer; // Jika searchText kosong, tampilkan semua data
    // END List Data Customer

    // START Customer Card
    const [openCustCard, setopenCustCard] = React.useState(false);
    const [nameCustomer, setNameCustomer] = React.useState([]);
    const [singleIdNo, setSingleIdNo] = React.useState();
    const [lsDtKendaraan, setlsDtKendaraan] = useState([]);
    const [lsDtMraCard, setlsDtMraCard] = useState([]);
    const [lstDtTenggatStnk, setlsTenggatStnk] = useState([]);
    const [totalKendaraan, setTotalKendaraan] = useState(0);
    const [isCardShow, setIsCardShow] = useState(false); // Buka customer card
    const [isCardSales, setCardSales] = useState(false); // Buka sales card
    const [isCardSa, setCardSa] = useState(false); // Buka sa card
    const [isCardMra, setCardMra] = useState(false); // Buka mra card
    const [dtCar, setDtCar] = useState([]);
    const [infoDtCar, setInfoDtCar] = useState([]);
    const [infoDtPenjualan, setInfoDtPenjualan] = useState([]);
    const [infoDtServices, setInfoDtServices] = useState([]);

    const handleCloseSalesCard = (event) => {
        setCardSales(false);
    }

    const handleCloseSaCard = (event) => {
        setCardSa(false);
    }

    const handleOpenDetailKendaraan = (event) => {
        if (rulesName == "superadmin") {

            setIsCardShow(true);
            setDtCar(event);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios
                .get("http://127.0.0.1:8000/api/customers/datacustomer/detail/infokendaraan?vin=" + event.no_rangka)
                .then((response) => {
                    setInfoDtCar(response.data.dtKendaraan);
                    setInfoDtPenjualan(response.data.dtPenjualan);
                    setInfoDtServices(response.data.dtService);
                });

        } else if (rulesName == "sales" || rulesName == "spv") {
            console.log("buka card sales");
            setCardSales(true);
            setDtCar(event);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios
                .get("http://127.0.0.1:8000/api/customers/datacustomer/detail/infokendaraan?vin=" + event.no_rangka)
                .then((response) => {
                    setInfoDtCar(response.data.dtKendaraan);
                    setInfoDtPenjualan(response.data.dtPenjualan);
                    setInfoDtServices(response.data.dtService);
                });
        } else if (rulesName == "administrator") {
            setIsCardShow(true);
            setDtCar(event);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios
                .get("http://127.0.0.1:8000/api/customers/datacustomer/detail/infokendaraan?vin=" + event.no_rangka)
                .then((response) => {
                    setInfoDtCar(response.data.dtKendaraan);
                    setInfoDtPenjualan(response.data.dtPenjualan);
                    setInfoDtServices(response.data.dtService);
                });
        } else if (rulesName == "sa") {
            setCardSa(true);
            setDtCar(event);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios
                .get("http://127.0.0.1:8000/api/customers/datacustomer/detail/infokendaraan?vin=" + event.no_rangka)
                .then((response) => {
                    setInfoDtCar(response.data.dtKendaraan);
                    setInfoDtPenjualan(response.data.dtPenjualan);
                    setInfoDtServices(response.data.dtService);
                });
        } else if (rulesName == "mra") {
            setCardMra(true);
            setDtCar(event);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios
                .get("http://127.0.0.1:8000/api/mra/info?vin=" + event.no_rangka)
                .then((response) => {
                    setlsDtMraCard(response.data.data);
                });
        }
    }
    const handleCardShowClose = (event) => {
        setIsCardShow(false);
    }

    const handleCloseCustCard = (event) => {
        setopenCustCard(false);
        setIsCardShow(false);
    }

    const handleOpenCardCustomer = (event) => {
        setopenCustCard(true);
        setNameCustomer(event);
        setSingleIdNo(event.single_id);
        getKendaraanCust(event.single_id);
    }

    function getKendaraanCust(singleID) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios
            .get("http://127.0.0.1:8000/api/customers/datacustomer/detail?single_id=" + singleID)
            .then((response) => {
                setlsDtKendaraan(response.data.data);
                setlsTenggatStnk(response.data.listStnk);
                setTotalKendaraan(response.data.totalKendaraan);
            });

    }
    const handleClose = () => setopenCustCard(false);
    const [searchKendaraan, setsearchKendaraan] = useState('');
    const customStyleKendaraan = {
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

    const columnsLsKendaraan = [
        {
            name: 'Aksi',
            cell: row => <button onClick={(event) => {
                handleOpenDetailKendaraan(row);
            }}
                style={{
                    fontSize: "10px"
                }} type="button" className="btn btn-info waves-effect waves-light">
                <i className="ri-file-list-3-fill"></i> Detail
            </button>,
            width: "110px"
        },
        {
            name: 'Status UNIT',
            selector: row => `${row.status_unit} ${row.status_unit != "external" ? '(' + row.cabang + ')' : ''}`,
            sortable: true,
            width: "150px"
        },
        {
            name: 'VIN',
            selector: row => row.no_rangka,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Nama STNK',
            selector: row => row.nama_stnk,
            sortable: true,
            width: "250px"
        },
        {
            name: 'Tanggal STNK',
            selector: row => row.tgl_stnk,
            sortable: true,
            width: "150px"
        },
        {
            name: 'Kendaraan',
            selector: row => row.tipe,
            sortable: true,
            width: "250px"
        },
        {
            name: 'Service Terakhir',
            selector: row => row.last_service,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Tanggal DO',
            selector: row => row.tgl_do,
            sortable: true,
            width: "150px"
        }
    ];

    const handleSearchKendaraan = (text) => {
        setsearchKendaraan(text);
    };

    // Logika pencarian, memfilter data berdasarkan beberapa kolom
    const filteredDataKendaraan = lsDtKendaraan.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchKendaraan.toLowerCase())
        )
    );

    const displayDataKendaraan = searchKendaraan ? filteredData : lsDtKendaraan; // Jika searchText kosong, tampilkan semua data
    // END Customer Cards


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
            selector: row => row.customer_name,
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

    const dataUltah = [
        {
            id: 1,
            customer_name: 'Luis Milla',
            tgl_ultah: '14 November 2023',
        },
        {
            id: 2,
            customer_name: 'Ciro Alves',
            tgl_ultah: '14 November 2023'
        },
        {
            id: 3,
            customer_name: 'Hariono',
            tgl_ultah: '14 November 2023'
        },

    ];

    // stnk
    const [openstnk, setopenstnk] = React.useState(false);
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
            selector: row => row.customer_name,
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
    // const urlExport = '';
    // if (rulesName == 'sales') {
    //     urlExport = `http://127.0.0.1:8000/api/summary/export/customers?cabang_name=${cleanedCabangName}&id_cabang=${idCab}&nama_sales=${personName}&rules=${rulesName}`;
    // } else {
    //     urlExport = `http://127.0.0.1:8000/api/summary/export/customers?cabang_name=${cleanedCabangName}&id_cabang=${idCab}`;
    // }
    const urlDownloadForm = `http://127.0.0.1:8000/api/template_form_update_data_customer`;

    const [importExcel, setimportExcel] = React.useState(false);
    const [fileUpload, setFileUp] = React.useState([]);
    const [inputsImport, setInputs] = React.useState([]);

    const hChangeInputFile = (event) => {
        console.log(event.target.files[0]);
        console.log(event.target.name);
        setFileUp(event.target.files[0]);
        setInputs(values => ({ ...values, [event.target.name]: fileUpload }));
    }

    const handleOpenFormImport = (event) => {
        setimportExcel(true);
    }

    const closeImport = (event) => {
        setimportExcel(false);
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

    const handleUploadDataCustomer = (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('fileCust', fileUpload);

        setLoading(true);
        axios.post('http://127.0.0.1:8000/api/customers/datacustomers/import_update', formData).then(function (response) {
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

                window.location.href = "/datacustomers";
            }
        });
    }

    // Update satu-satu
    const [inputsUpdCust, setInputUpdCust] = useState([]);
    const [openFormUpdateCust, setFormUpdateCust] = useState(false);
    const [updCustomerName, setupdCustomerName] = useState('');
    const [updAlamatNikCust, setupdAlamatNikCust] = useState('');
    const [updEmailCust, setupdEmailCust] = useState('');
    const [updTelpCust, setupdTelpCust] = useState('');
    const [updTglLahir, setupdTglLahir] = useState('');
    const [updSingleID, setupdSingleID] = useState('');
    const [updNoRangka, setupdNoRangka] = useState('');

    const handleChangeAlamatNikCust = (event) => {
        setupdAlamatNikCust(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeTglLahir = (event) => {
        setupdTglLahir(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeTelpCust = (event) => {
        setupdTelpCust(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeEmailCust = (event) => {
        setupdEmailCust(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleOpenEditCust = (event) => {
        getKendaraanCust(event.single_id);
        setupdSingleID(event.single_id);
        setupdCustomerName(event.nama_customer);
        setupdTelpCust(event.telp);
        setupdEmailCust(event.email);
        setupdAlamatNikCust(event.alamat);
        // Konversi tanggal input ke objek Date
        const dateObj = new Date(event.tgl_ultah);
        // Dapatkan tahun, bulan, dan tanggal dari objek Date
        const year = dateObj.getFullYear();
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Tambahkan 1 karena bulan dimulai dari 0
        const day = ('0' + dateObj.getDate()).slice(-2);

        // Gabungkan tahun, bulan, dan tanggal sesuai dengan format yang diinginkan
        const formattedDate = `${year}-${month}-${day}`;
        setupdTglLahir(formattedDate);
        
        setInputUpdCust((values) => ({
            ...values,
            ["single_id"]: event.single_id,
            ["alamat"]: event.alamat,
            ["telp_customer"]: event.telp,
            ["email"]: event.email,
            ["tgl_ultah"]: formattedDate
        }));

        setFormUpdateCust(true);
    }

    const handleCloseEditCust = (event) => {
        setFormUpdateCust(false);
        setupdNoDoTam('');
        setupdNoDo('');
        setupdTglDO('');
        setupdNoSpk('');
        setupdKode('');
        setupdNamaSpk('');
        setupdNamaStnk('');
        setupdTglAjuAfi('');
        setupdNikbdoSpk('');
        setupdNikbdoStnk('');
        setupdKetType('');
        setupdType('');
        setupdWarna('');
        setupdLeasing('');
        setupdAsuransi('');
        setInputUpdCust([]);
        handleChooseVin("");
        getDetailbyVin("");
        setupdNoRangka('');
    }

    const handleChooseVin = (event) => {
        if (event != "") {
            setupdNoRangka(event.target.value);
            getDetailbyVin(event.target.value);
            setInputUpdCust((values) => ({
                ...values,
                [event.target.name]: event.target.value,
            }));
        } else {

            setInputUpdCust((values) => ({
                ...values,
                ["no_rangka"]: "",
            }));
        }
    }
    const handleSubmitUpdateCust = (event) => {
        event.preventDefault();
        setLoading(true);
        axios
            .post("http://127.0.0.1:8000/api/customers/datacustomers/single_update", inputsUpdCust)
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

                    setFormUpdateCust(false);
                    setRefresh(new Date());
                    // window.location.href = "/datacustomers";
                }
            });
    }

    const [updNoDoTam, setupdNoDoTam] = useState('');
    const [updNoDo, setupdNoDo] = useState('');
    const [updTglDO, setupdTglDO] = useState('');
    const [updNoSpk, setupdNoSpk] = useState('');
    const [updTglSpk, setupdTglSpk] = useState('');
    const [updKode, setupdKode] = useState('');
    const [updNamaSpk, setupdNamaSpk] = useState('');
    const [updNamaStnk, setupdNamaStnk] = useState('');
    const [updTglAjuAfi, setupdTglAjuAfi] = useState('');
    const [updNikbdoSpk, setupdNikbdoSpk] = useState('');
    const [updNikbdoStnk, setupdNikbdoStnk] = useState('');
    const [updKetType, setupdKetType] = useState('');
    const [updType, setupdType] = useState('');
    const [updWarna, setupdWarna] = useState('');
    const [updLeasing, setupdLeasing] = useState('');
    const [updAsuransi, setupdAsuransi] = useState('');

    const handleChangeDoTam = (event) => {
        setupdNoDoTam(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeDo = (event) => {
        setupdNoDo(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeTglDo = (event) => {
        setupdTglDO(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeNoSpk = (event) => {
        setupdNoSpk(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeTglSpk = (event) => {
        setupdTglSpk(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeKode = (event) => {
        setupdKode(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeNamaSpk = (event) => {
        setupdNamaSpk(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeNamaStnk = (event) => {
        setupdNamaStnk(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeTglAjuAfi = (event) => {
        setupdTglAjuAfi(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeNikbdoSpk = (event) => {
        setupdNikbdoSpk(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeNikbdoStnk = (event) => {
        setupdNikbdoStnk(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeKetType = (event) => {
        setupdKetType(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeType = (event) => {
        setupdType(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeWarna = (event) => {
        setupdWarna(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeLeasing = (event) => {
        setupdLeasing(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleChangeAsuransi = (event) => {
        setupdAsuransi(event.target.value);
        setInputUpdCust((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    function getDetailbyVin(vin) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios
            .get("http://127.0.0.1:8000/api/delivery_orders/detail/vin?vin=" + vin)
            .then((response) => {
                if (response.data.data.length == 0) {
                    setupdNoDoTam('');
                    setupdNoDo('');
                    setupdTglDO('');
                    setupdNoSpk('');
                    setupdKode('');
                    setupdNamaSpk('');
                    setupdNamaStnk('');
                    setupdTglAjuAfi('');
                    setupdNikbdoSpk('');
                    setupdNikbdoStnk('');
                    setupdKetType('');
                    setupdType('');
                    setupdWarna('');
                    setupdLeasing('');
                    setupdAsuransi('');
                    setupdEmailCust('');
                } else {
                    setupdNoDoTam(response.data.data.no_do_tam);
                    setupdNoDo(response.data.data.no_do);

                    setupdTglDO(formatDateInput(response.data.data.tgl_do));
                    setupdTglSpk(formatDateInput(response.data.data.tgl_spk));
                    setupdNoSpk(response.data.data.no_spk);
                    setupdKode(response.data.data.kode);
                    setupdEmailCust(response.data.data.email);
                    setupdNamaSpk(response.data.data.nama_spk);
                    setupdNamaStnk(response.data.data.nama_stnk);
                    setupdTglAjuAfi(formatDateInput(response.data.data.tgl_aju_afi));
                    setupdNikbdoSpk(response.data.data.nik_nib_spk);
                    setupdNikbdoStnk(response.data.data.nik_nib_stnk);
                    setupdKetType(response.data.data.ket_type);
                    setupdType(response.data.data.type);
                    setupdWarna(response.data.data.warna);
                    setupdLeasing(response.data.data.leasing);
                    setupdAsuransi(response.data.data.asuransi);

                    setInputUpdCust((values) => ({
                        ...values,
                        ["no_do_tam"]: response.data.data.no_do_tam,
                        ["no_do"]: response.data.data.no_do,
                        ["tgl_do"]: response.data.data.tgl_do,
                        ["tgl_spk"]: response.data.data.tgl_spk,
                        ["no_spk"]: response.data.data.no_spk,
                        ["kode"]: response.data.data.kode,
                        ["nama_spk"]: response.data.data.nama_spk,
                        ["nama_stnk"]: response.data.data.nama_stnk,
                        ["tgl_aju_afi"]: response.data.data.tgl_aju_afi,
                        ["nikbdo_spk"]: response.data.data.nik_nib_spk,
                        ["nikbdo_stnk"]: response.data.data.nik_nib_stnk,
                        ["ket_type"]: response.data.data.ket_type,
                        ["type"]: response.data.data.type,
                        ["warna"]: response.data.data.warna,
                        ["leasing"]: response.data.data.leasing,
                        ["asuransi"]: response.data.data.asuransi,
                        ["email"]: response.data.data.email,
                    }));
                }
            });
    }

    const [dialogHistory, setOpenDialogHistory] = useState(false);
    const [noRangkaHistory, setNoRangkaHistory] = useState('');
    const [lsHistoryService, setLsHistoryService] = useState([]);

    const openHistoryService = (event) => {
        setNoRangkaHistory(event);
        setOpenDialogHistory(true);
        getHistory(event);
    }

    function getHistory(no_rangka) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios
            .get("http://127.0.0.1:8000/api/services/history?no_rangka=" + no_rangka)
            .then((response) => {
                console.log(response);
                setLsHistoryService(response.data.dtService);
            });
    }

    const closeHistoryService = () => {
        setOpenDialogHistory(false);
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

    // Editable No Polisi
    const [inputNopol, setInputNopol] = useState([]);
    const [isEditNopol, setIsEditNopol] = useState(false);
    const [editableNoPol, seteditableNoPol] = useState('');
    const handleOpenNopol = (event) => {
        setIsEditNopol(true);
        setInputNopol((values) => ({
            ...values,
            ["no_rangka"]: event,
        }));
    }

    const closeEditNopol = (event) => {
        setIsEditNopol(false);
    }

    const handleChangeEditNopol = (event) => {
        seteditableNoPol(event.target.value);
        setInputNopol((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSubmitNopol = () => {

        axios
            .post("http://127.0.0.1:8000/api/customers/datacustomers/update_nopol", inputNopol)
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

                    window.location.href = "/datacustomers";
                }
            });

    }

    function handleStartDate(event) {
        setStartDate(event.target.value);
    }

    function handleEndDate(event) {
        setEndDate(event.target.value);
    }

    // For MRA
    const [searchMraCard, setsearchMraCard] = useState('');
    const [openUpdFollow, setOpenUpdFollow] = useState(false);
    const [inputUpdFollow, setInputUpdFollow] = useState([]);
    const [customerBuyer, setcustomerBuyer] = useState('');
    const [telpBuyer, settelpBuyer] = useState('');
    const [customerService, setcustomerService] = useState('');
    const [telpService, settelpService] = useState('');
    const [pertanyaanSatu, setpertanyaanSatu] = useState('');
    const [serviceNoRangka, setserviceNoRangka] = useState('');
    const [serviceModelKendaraan, setserviceModelKendaraan] = useState('');

    const handleUpdFollow = (event) => {
        console.log(event);
        setOpenUpdFollow(true);
        setcustomerBuyer(event.nama_customer);
        settelpBuyer(event.no_telp);
        setcustomerService(event.nama_hadir_service);
        settelpService(event.phone);
        setserviceNoRangka(event.no_rangka);
        setserviceModelKendaraan(event.tipe);

        setInputUpdFollow((values) => ({
            ...values,
            ["single_id_buyer"]: event.single_id,
            ["cust_buyer"]: event.nama_customer,
            ["telp_buyer"]: event.no_telp,
            ["nik_buyer"]: event.nik_buyer,
            ["nik_sos"]: event.nik_sos,
            ["cust_service"]: event.nama_hadir_service,
            ["telp_service"]: event.phone,
            ["no_rangka"]: event.no_rangka
        }));
    }

    const closeUpdFollow = () => {
        setOpenUpdFollow(false);
    }

    const handleChangePertanyaanSatu = (event) => {
        setpertanyaanSatu(event.target.value);
        setInputUpdFollow((values) => ({
            ...values,
            ["status_kepemilikan"]: event.target.value
        }));
    }

    const handleSubmitUpdFollow = (event) => {
        event.preventDefault();
        setLoading(true);
        axios
            .post("http://127.0.0.1:8000/api/customer/update_kendaraan", inputUpdFollow)
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
                    window.location.href = "/datacustomers";
                }
            });
    }

    const columnsMra = [
        {
            name: 'Aksi',
            cell: row => {
                return <button onClick={(event) => { handleUpdFollow(row); }} type="button" className="btn btn-info btn-sm btn-label"><i className="ri-check-double-line label-icon align-middle fs-16 me-2"></i> Update & Followup</button>
            },
            width: "200px"
        },
        {
            name: 'Service',
            selector: row => row.type_service,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Tanggal Service',
            selector: row => row.tgl_service,
            sortable: true,
            width: "150px"
        },
        {
            name: 'Nama Customer (Buyer)',
            selector: row => row.nama_customer,
            sortable: true,
            width: "250px"
        },
        {
            name: 'Nama Pemakai Kendaraan',
            selector: row => row.nama_hadir_service,
            sortable: true,
            width: "250px"
        },
        {
            name: 'Status Phone',
            selector: row => row.status,
            sortable: true,
            cell: row => {
                if (row.status_phone == 1) {
                    return <span className="badge bg-success">{'Connected'}</span>
                } else {
                    return <span className="badge bg-danger">{'Not Connected'}</span>
                }
            },
            width: "150px"
        },
        {
            name: 'Status Wa Blast',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <span className="badge bg-success">{row.status}</span>
            ),
            width: "150px"
        },
        {
            name: 'Status Service',
            selector: row => row.status_service,
            sortable: true,
            cell: row => {
                if (row.status_service == "CANCEL") {
                    return <span className="badge bg-danger">{'Cancel'}</span>
                } else {
                    return <span className="badge bg-success">{'Datang'}</span>
                }
            },
            width: "150px"
        },
        {
            name: 'SA',
            selector: row => row.nama_sa,
            sortable: true,
            width: "150px"
        }
    ];

    const handleSearchMraCard = (text) => {
        setsearchMraCard(text);
    };

    // Logika pencarian, memfilter data berdasarkan beberapa kolom
    const filteredDataMraCard = lsDtMraCard.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchMraCard.toLowerCase())
        )
    );

    const displayDataMraCard = searchMraCard ? filteredData : lsDtMraCard; // Jika searchText kosong, tampilkan semua data
    
    const [listHistoryCar, setListHistory] = useState([]);
    const [openHistoryCar, setopenHistoryCar] = useState(false);
    const [historyNoRangka, sethistoryNoRangka] = useState(false);

    const handleOpenHistoryKendaraan = async (no_rangka) => {
        console.log(no_rangka);
        setopenHistoryCar(true);
        sethistoryNoRangka(no_rangka);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const url = `http://127.0.0.1:8000/api/customers/history_kendaraan?vin=${no_rangka}`;
        try {
            const response = await axios.get(url);
            setListHistory(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const closeHistoryCar = () => {
        setopenHistoryCar(false);
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Database Customers</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">Customers</a></li>
                                    <li className="breadcrumb-item active">Database Customers</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className='col-xl-12 col-md-12'>
                        <div className="card overflow-hidden">
                            <div className="card-body" style={{ zIndex: 1 }}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="card-title mb-0">List Data Customer</h5>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" style={{ background: "#CBD5E1", fontSize: "10px" }} className='p-2'>
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
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-2 mt-2">
                                                    <input
                                                        className="form-control form-control-sm"
                                                        type="text"
                                                        value={searchText}
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                        placeholder="Search..."
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                <div className="col-lg-2 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{ fontSize: 12 }}>Pilih Tanggal Awal</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input type="date" onChange={handleStartDate} value={startdate} className="form-control" id="nameInput" name="bulan" placeholder="Enter your name" />
                                                </div>
                                                <div className="col-lg-2 mt-2">
                                                    <label htmlFor="nameInput" className="form-label" style={{ fontSize: 12 }}>Pilih Tanggal Akhir</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input type="date" onChange={handleEndDate} value={enddate} min={startdate} className="form-control" id="nameInput" name="tahun" placeholder="Enter your name" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card-header" style={{ border: 'none' }}>
                                {/* <h5 className="card-title mb-0">List Data Customer</h5> */}
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-3 text-right">
                                                    {rulesName == 'sa' ? ("") : (
                                                        <>
                                                            <a href={`http://127.0.0.1:8000/api/summary/export/customers?cabang_name=${cleanedCabangName}&id_cabang=${idCab}&person=${personName}&rules=${rulesName}&startdate=${startdate}&enddate=${enddate}`} className="btn btn-sm btn-success"><i className="ri-file-excel-2-fill"></i> Export Excel</a>
                                                            <a onClick={handleOpenFormImport} className="btn btn-sm btn-info" style={{ marginLeft: "5px", cursor: "pointer" }}><i className="ri-edit-2-line"></i> Multi Update</a>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                {isLoading ? (
                                    <div className="text-center ">
                                        <i className="mdi mdi-spin mdi-loading" style={{ fontSize: "30px", color: "#991B1B" }}></i> <h6 className="m-0 loading-text">Please wait...</h6>
                                    </div>
                                ) : (

                                    <DataTable
                                        columns={columnsLsCustomer}
                                        data={displayData}
                                        key={currentPage}
                                        pagination
                                        paginationPerPage={perPage} // Jumlah item per halaman
                                        paginationRowsPerPageOptions={[10, 20, 30]} // Opsi jumlah item per halaman
                                        paginationTotalRows={totalRows} // Total jumlah data
                                        onChangeRowsPerPage={handleRowsPerPageChange}
                                        onChangePage={handlePageChange}
                                        customStyles={customStyles}
                                        defaultSortFieldId={1}
                                        onSearch={handleSearch} // Menambahkan fungsi pencarian
                                    />
                                )}
                            </div>
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
                onClose={handleCloseCustCard}
                aria-describedby="alert-dialog-slide-description"
                style={{ width: "100%", margin: "0 auto" }}
            >
                <DialogActions>
                    <button className="btn btn-sm btn-danger" onClick={handleCloseCustCard}><i className="ri-shut-down-line"></i></button>
                </DialogActions>
                <DialogContent style={{
                    background: "#ecf0f1"
                }}>
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-xxl-4">
                                    <div className="card ribbon-box border shadow-none mb-lg-0">
                                        <div className="card-body">
                                            <div className="ribbon ribbon-primary round-shape">Single ID: {singleIdNo}</div>

                                            <div className="ribbon-content text-muted">
                                                <div className="row g-0 mt-5">
                                                    <div className="col-md-4 col-sm-12">
                                                        {/* Mobile */}
                                                        <img className="rounded-start img-fluid h-100 d-block d-sm-none object-fit-cover" src="assets/images/users/avatar-6.jpg" alt="Card image" />
                                                        {/* Web */}
                                                        <img className="rounded-start img-fluid h-100 d-none d-sm-block object-fit-cover" src="assets/images/users/avatar-6.jpg" alt="Card image" />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="card-body">
                                                            <h5 className="fs-14 text-uppercase">{nameCustomer.nama_customer} <i className="ri-checkbox-circle-fill text-success"></i></h5>
                                                            <span className="card-title mb-0" style={{ fontSize: "14px" }}>NIK: {nameCustomer.nik == null ? (<span className="badge bg-dark-subtle text-body badge-border">NIK Kosong</span>) : nameCustomer.nik}</span><br></br>
                                                            <p className="card-text" style={{ fontSize: "20px" }}><span className="text-dark"><i className="ri-car-washing-fill"></i> <b>{totalKendaraan}</b> Total Kendaraan</span></p>
                                                            <hr></hr>
                                                            <p className="card-text mb-2 text-muted" style={{ fontSize: "13px" }}><i className="ri-phone-fill"></i> {nameCustomer.telp == null ? (<span className="badge bg-dark-subtle text-body badge-border">No Telepon Kosong</span>) : nameCustomer.telp}</p>
                                                            <p className="card-text mb-2 text-muted" style={{ fontSize: "13px" }}><i className="ri-cake-2-line"></i> {nameCustomer.tgl_ultah == "" ? (<span className="badge bg-dark-subtle text-body badge-border">Tanggal Kosong</span>) : nameCustomer.tgl_ultah}
                                                                {currentDateFormatted == nameCustomer.tgl_ultah_cek ? (<span className="badge bg-primary">Hari ini berulang tahun</span>) : ""}</p>
                                                            <p className="card-text mb-2" style={{ fontSize: "13px" }}>
                                                                {nameCustomer.alamat == null ? (<span className="badge bg-dark-subtle text-body badge-border">Alamat Kosong</span>) : nameCustomer.alamat}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mt-2">
                                        <div className="row g-0">
                                            <div className="col-md-12">
                                                <div className="card-header">
                                                    <span className="card-title mb-0" style={{ fontSize: "15px", fontWeight: 500 }}><i className="ri-calendar-event-fill"></i> {"List Masa Tenggat STNK Bulan Ini"}</span>
                                                </div>
                                                <div className="card-body" style={{ overflow: "y", maxHeight: 100 }}>
                                                    <ul className="list-group">
                                                        {lstDtTenggatStnk.map((val, idx) => (
                                                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                                <span style={{ fontSize: 11 }}><b>{val.no_rangka}</b> - {"(" + val.model_type + ")"} - <b>{val.nama_customer}</b><br></br> <span className="text-muted">Tanggal STNK: 15 November 2023</span></span>
                                                                <button className="btn btn-success btn-sm" alt="Kirim Reminder" onClick={alertNotifSend}><i className="ri-send-plane-2-line"></i></button>
                                                            </li>
                                                        ))}
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
                                                    <div style={{ height: "auto" }}>
                                                        <DataTable
                                                            columns={columnsLsKendaraan}
                                                            data={displayDataKendaraan}
                                                            pagination
                                                            paginationPerPage={5}
                                                            customStyles={customStyleKendaraan}
                                                            defaultSortFieldId={1}
                                                            onSearch={handleSearch} // Menambahkan fungsi pencarian
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Card */}
                    {isCardShow == true ? (

                        <div className="row" >
                            <div className='col-xl-12 col-md-12'>
                                <div className="card overflow-hidden">
                                    <div className="card-header" style={{ border: "none" }}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Data Unit
                                                    <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i> {dtCar.no_rangka}</span>
                                                    <span className="badge badge-label bg-primary" style={{ fontSize: "12px" }}><i className="mdi mdi-circle-medium"></i> {"Tanggal STNK: " + dtCar.tgl_stnk}</span>
                                                </h5>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button type="button" className="btn btn-danger btn-sm" onClick={handleCardShowClose}><i className="ri-close-circle-fill"></i> Close</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{ zIndex: 1 }}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div style={{ overflowX: 'auto' }}>
                                                    <table className="table table-bordered align-middle table-nowrap mb-0">
                                                        <thead style={{ background: "#E2E8F0" }}>
                                                            <tr>
                                                                <th colSpan={2} style={{ padding: "7px", fontSize: "12px" }}>Informasi Penjualan</th>
                                                            </tr>
                                                            <tr style={{ padding: "7px", fontSize: "12px" }}>
                                                                <th scope="col">Tanggal DO</th>
                                                                <th scope="col">Sales Penjualan</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">{infoDtPenjualan.tgl_do}</td>
                                                                <td className="text-muted">{infoDtPenjualan.nama_sales}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Leasing</td>
                                                                <td className="text-muted">{infoDtPenjualan.nama_leasing == null ? "" : infoDtPenjualan.nama_leasing}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Asuransi</td>
                                                                <td className="text-muted">{infoDtPenjualan.asuransi == null ? "" : infoDtPenjualan.asuransi}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>DO Asal</td>
                                                                <td className="text-muted">{infoDtPenjualan.asal_do}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div style={{ overflowX: 'auto' }}>
                                                    <table className="table table-bordered align-middle table-nowrap mb-0">
                                                        <thead style={{ background: "#E2E8F0" }}>
                                                            <tr>
                                                                <th colSpan={2} style={{ padding: "7px", fontSize: "12px" }}>
                                                                    Informasi Kendaraan <button onClick={(event) => handleOpenHistoryKendaraan(dtCar.no_rangka)} style={{ fontSize: "11px" }} className="btn btn-sm btn-primary"><i className="ri-history-line"></i> History</button>
                                                                </th>
                                                            </tr>
                                                            <tr style={{ padding: "7px", fontSize: "12px" }}>
                                                                <th scope="col">VIN</th>
                                                                <th scope="col">No Polisi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">{infoDtCar.no_rangka}</td>
                                                                <td className="text-muted">
                                                                    {/* {infoDtCar.no_pol} */}
                                                                    {/* <input type="text" style={{float: "left"}} className="form-control form-control-sm" value={infoDtCar.no_pol} disabled />
                                                                        <button className="btn btn-sm btn-success" style={{float: "left"}}>Edit</button> */}
                                                                    <div className="row gy-2 gx-3 mb-1 align-items-center">
                                                                        <div className="col-sm-auto">
                                                                            <input type="text" onChange={handleChangeEditNopol} className="form-control form-control-sm" hidden={isEditNopol ? false : true} id="autoSizingInput" name="up_no_pol" value={editableNoPol} />
                                                                            {/* <input type="text" className="form-control form-control-sm" hidden={isEditNopol ? false : true} onChange={handleChangeEmailCust} name="email_customer" value={updEmailCust !== null ? updEmailCust : ''} id="email_customer" placeholder="Email" /> */}
                                                                            <input type="text" className="form-control form-control-sm" disabled hidden={!isEditNopol ? false : true} id="autoSizingInput" value={infoDtCar.no_pol} />
                                                                        </div>
                                                                        <div className="col-sm-auto">
                                                                            <button type="submit" className="btn btn-sm btn-outline-success" hidden={!isEditNopol ? false : true} onClick={(event) => handleOpenNopol(infoDtCar.no_rangka)}><i className="ri-edit-fill"></i></button>
                                                                            <button type="submit" className="btn btn-sm btn-outline-danger" hidden={isEditNopol ? false : true} onClick={closeEditNopol}><i className="ri-close-fill"></i></button>
                                                                            <button type="submit" className="btn btn-sm btn-outline-success" style={{ marginLeft: "2px" }} hidden={isEditNopol ? false : true} onClick={handleSubmitNopol}><i className="ri-check-fill"></i></button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Type</td>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Warna</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">{infoDtCar.tipe}</td>
                                                                <td className="text-muted">{infoDtCar.warna}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Nama STNK</td>
                                                                <td className="text-muted">{infoDtCar.nama_stnk}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div style={{ overflowX: 'auto' }}>
                                                    <table className="table table-bordered align-middle table-nowrap mb-0">
                                                        <thead style={{ background: "#E2E8F0" }}>
                                                            <tr>
                                                                <th colSpan={2} style={{ padding: "7px", fontSize: "12px" }}>Informasi Service <button onClick={(event) => { openHistoryService(infoDtCar.no_rangka); }} style={{ fontSize: "11px" }} className="btn btn-sm btn-primary"><i className="ri-history-line"></i> History</button></th>
                                                            </tr>
                                                            <tr style={{ padding: "7px", fontSize: "12px" }}>
                                                                <th scope="col">Nama Pemakai</th>
                                                                <th scope="col">Tanggal Service</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">{infoDtServices.nama_pemakai}</td>
                                                                <td className="text-muted">{infoDtServices.tgl_service}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Keterangan Service</td>
                                                                <td className="text-muted">{infoDtServices.keterangan_service}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Lokasi Service</td>
                                                                <td className="text-muted">{infoDtServices.cabang_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>No Telepon Pemakai</td>
                                                                <td className="text-muted">
                                                                    {infoDtServices.telepon_pemakai} <a href={'https://wa.me/' + infoDtServices.telepon_pemakai} className="btn btn-info btn-sm" onClick={alertNotifSend}><i className="ri-phone-fill"></i></a>
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
                        </div>

                    ) : ""}

                    {isCardSales == true ? (
                        <div className="row">
                            <div className='col-xl-12 col-md-12'>
                                <div className="card overflow-hidden">
                                    <div className="card-header" style={{ border: "none" }}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>SALES CARD
                                                    <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i> {personName}</span>
                                                    <span className="badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> {"Unit: " + dtCar.no_rangka}</span>
                                                    <span className="badge badge-label bg-danger" style={{ fontSize: "12px" }}><i className="mdi mdi-circle-medium"></i> {"Tanggal STNK: " + dtCar.tgl_stnk}</span>
                                                </h5>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button type="button" onClick={handleCloseSalesCard} className="btn btn-danger btn-sm"><i className="ri-close-circle-fill"></i> Close</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{ zIndex: 1 }}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div style={{ overflowX: 'auto' }}>
                                                    <table className="table table-bordered align-middle table-nowrap mb-0">
                                                        <thead style={{ background: "#E2E8F0" }}>
                                                            <tr>
                                                                <th colSpan={2} style={{ padding: "7px", fontSize: "12px" }}>Informasi Penjualan</th>
                                                            </tr>
                                                            <tr style={{ padding: "7px", fontSize: "12px" }}>
                                                                <th scope="col">Tanggal DO</th>
                                                                <th scope="col">Sales Penjualan</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">{infoDtPenjualan.tgl_do}</td>
                                                                <td className="text-muted">{infoDtPenjualan.nama_sales}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Leasing</td>
                                                                <td className="text-muted">{infoDtPenjualan.nama_leasing == null ? "" : infoDtPenjualan.nama_leasing}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Asuransi</td>
                                                                <td className="text-muted">{infoDtPenjualan.asuransi == null ? "" : infoDtPenjualan.asuransi}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ background: "#E2E8F0", fontWeight: "600" }}>DO Asal</td>
                                                                <td className="text-muted">{infoDtPenjualan.asal_do}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="col-md-8">
                                                <div style={{ overflowX: 'auto' }}>
                                                    <table className="table table-bordered align-middle table-nowrap mb-0">
                                                        <thead style={{ background: "#E2E8F0" }}>
                                                            <tr>
                                                                <th colSpan={7} style={{ padding: "7px", fontSize: "12px" }}>Informasi Kendaraan</th>
                                                            </tr>
                                                            <tr style={{ padding: "7px", fontSize: "12px" }}>
                                                                <th scope="col">Nama Pemilik</th>
                                                                <th scope="col">Nama STNK</th>
                                                                <th scope="col">Tanggal STNK</th>
                                                                <th scope="col">VIN</th>
                                                                <th scope="col">Tipe Kendaraan</th>
                                                                <th scope="col">No Polisi</th>
                                                                <th scope="col">Warna</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">{infoDtCar.nama_pemilik}</td>
                                                                <td className="text-muted">{infoDtCar.nama_stnk}</td>
                                                                <td className="text-muted">{infoDtCar.tgl_stnk}</td>
                                                                <td className="text-muted">{infoDtCar.no_rangka}</td>
                                                                <td className="text-muted">{infoDtCar.tipe}</td>
                                                                <td className="text-muted">{infoDtCar.no_pol}</td>
                                                                <td className="text-muted">{infoDtCar.warna}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div style={{ overflowX: 'auto' }}>
                                                    <table className="table table-bordered align-middle table-nowrap mb-0">
                                                        <thead style={{ background: "#E2E8F0" }}>
                                                            <tr>
                                                                <th colSpan={6} style={{ padding: "7px", fontSize: "12px" }}>
                                                                    Informasi Service Terakhir
                                                                </th>
                                                            </tr>
                                                            <tr style={{ padding: "7px", fontSize: "12px" }}>
                                                                <th scope="col">Nama Pemakai</th>
                                                                <th scope="col">No Telepon</th>
                                                                <th scope="col">Keterangan</th>
                                                                <th scope="col">Tanggal</th>
                                                                <th scope="col">Lokasi Service</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">{infoDtServices.nama_pemakai}</td>
                                                                <td className="text-muted">{infoDtServices.telepon_pemakai}</td>
                                                                <td className="text-muted">{infoDtServices.keterangan_service}</td>
                                                                <td className="text-muted">{infoDtServices.tgl_service}</td>
                                                                <td className="text-muted">
                                                                    {infoDtServices.cabang_name == null ? ("") : (<span className="badge badge-label bg-secondary badge-sm"><i className="lab las la-map-marker"></i> {infoDtServices.cabang_name}</span>)}
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
                        </div>
                    ) : ""}

                    {isCardSa == true ? (
                        <div className="row">
                            <div className='col-xl-12 col-md-12'>
                                <div className="card overflow-hidden">
                                    <div className="card-header" style={{ border: "none" }}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>SA CARD
                                                    <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i> {"VIN: 123456789012345"}</span>
                                                </h5>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button type="button" onClick={handleCloseSaCard} className="btn btn-danger btn-sm"><i className="ri-close-circle-fill"></i> Close</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body" style={{ zIndex: 1 }}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <table className="table table-bordered align-middle table-nowrap mb-0">
                                                    <thead style={{ background: "#E2E8F0" }}>
                                                        <tr>
                                                            <th className="text-uppercase" colSpan={2} style={{ padding: "7px", fontSize: "12px" }}>Revenue / Unit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Jasa</td>
                                                            <td className="text-muted">Rp. -</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Part</td>
                                                            <td className="text-muted">Rp. -</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600" }}>MAT / Bahan</td>
                                                            <td className="text-muted">Rp. -</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600" }}>Oli</td>
                                                            <td className="text-muted">Rp. -</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="col-md-4">
                                                <table className="table table-bordered align-middle table-nowrap mb-0">
                                                    <thead style={{ background: "#E2E8F0" }}>
                                                        <tr>
                                                            <th colSpan={2} style={{ padding: "7px", fontSize: "12px" }}>SARAN UPSELLING</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>1</td>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>UP GRADE TMO SW</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>2</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>3</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>4</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>5</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="col-md-4">
                                                <table className="table table-bordered align-middle table-nowrap mb-0">
                                                    <thead style={{ background: "#E2E8F0" }}>
                                                        <tr>
                                                            <th colSpan={2} style={{ padding: "7px", fontSize: "12px" }}>SARAN CROSS-SELLING</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>1</td>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>UP GRADE TMO SW</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>2</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>3</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>4</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ background: "#E2E8F0", fontWeight: "600", fontSize: "12px" }}>5</td>
                                                            <td className="text-muted"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                        : ""}

                    {isCardMra == true ? (
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="row g-0">
                                        <div className="col-md-12">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>MRA CARD</h5>
                                                    </div>
                                                    <div className="col-md-12 mt-2 p-3">
                                                        <ul className="nav nav-tabs nav-tabs-custom nav-info nav-justified mb-3" role="tablist">
                                                            <li className="nav-item">
                                                                <a className="nav-link active" data-bs-toggle="tab" href="#home1" role="tab">
                                                                    Follow Up
                                                                </a>
                                                            </li>
                                                            {/* <li className="nav-item">
                                                                <a className="nav-link" data-bs-toggle="tab" href="#profile1" role="tab">
                                                                    Bookings
                                                                </a>
                                                            </li> */}
                                                        </ul>
                                                        <div className="tab-content text-muted">
                                                            <div className="tab-pane active" id="home1" role="tabpanel">
                                                                <DataTable
                                                                    columns={columnsMra}
                                                                    data={displayDataMraCard}
                                                                    pagination
                                                                    customStyles={customStyles}
                                                                    defaultSortFieldId={1}
                                                                />
                                                            </div>
                                                            {/* <div className="tab-pane" id="profile1" role="tabpanel">
                                                                <div className="d-flex">
                                                                    <div className="flex-shrink-0">
                                                                        <i className="ri-checkbox-multiple-blank-fill text-success"></i>
                                                                    </div>
                                                                    <div className="flex-grow-1 ms-2">
                                                                        When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown.
                                                                        <div className="mt-2">
                                                                            <a href="" className="btn btn-sm btn-soft-primary">Read More <i className="ri-arrow-right-line ms-1 align-middle"></i></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                        : ""}

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
                                        <div className="card-header" style={{ border: "none" }}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>List Ulang Tahun </h5>
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
                                                        data={dataUltah}
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

            {/* Start History Service */}
            <Dialog
                open={dialogHistory}
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
                                        <div className="card-header" style={{ border: "none" }}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>History Service {noRangkaHistory}</h5>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={closeHistoryService}><i className="ri-close-circle-fill"></i> Close</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12 mt-2 p-3">
                                                    <div className="card" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                        {lsHistoryService.map((val, idx) => (
                                                            <div key={idx}>
                                                                <div className="align-items-center d-flex" style={{ marginBottom: "5px" }}>
                                                                    <div className="live-preview  col-md-12">
                                                                        <div className="list-group">
                                                                            <a href="javascript:void(0);" className="list-group-item list-group-item-action">
                                                                                <div className="float-end">
                                                                                    <span className="badge bg-success">{val.status_wo}</span>
                                                                                </div>
                                                                                <div className="d-flex mb-2 align-items-center">
                                                                                    <div className="flex-shrink-0">
                                                                                        <i className="avatar-sm rounded-circle bx bx-car" style={{ fontSize: "40px" }}></i>
                                                                                    </div>
                                                                                    <div className="flex-grow-1 ms-3">
                                                                                        <h5 className="list-title fs-15 mb-1">{val.nama_pemakai + ' - ' + val.telepon_pemakai + ' '}</h5>
                                                                                        <p className="list-text mb-0 fs-12">{val.tgl_service}</p>
                                                                                        <p className="list-text mb-0 fs-12">Lokasi Service: <b>{val.cabang_name}</b></p>
                                                                                    </div>
                                                                                </div>
                                                                                <p className="list-text mb-0">{val.keterangan_service}</p>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
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
            {/* End History Service */}

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
                                        <div className="card-header" style={{ border: "none" }}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>List STNK </h5>
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
                                                        columns={columnsstnk}
                                                        data={datastnk}
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
                                                    <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Multi Update Data Customer </h5>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <a href={urlDownloadForm} className="btn btn-sm btn-icon btn-success p-2" style={{ width: "100%", cursor: "pointer" }}><i className="ri-file-excel-fill"></i> Download Template Form</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <CustomBlockingOverlay isLoading={isLoading}>

                                                    </CustomBlockingOverlay>
                                                    <form>
                                                        {/* <input type="file" name="fileCust" id="fileCust" onChange={hChangeInputFile} required style={{width: "500px"}} className="form-control"></input> */}
                                                        <TextField
                                                            id="outlined-select-currency-native"
                                                            defaultValue=""
                                                            label=""
                                                            helperText="Pilih File"
                                                            onChange={hChangeInputFile}
                                                            sx={{ width: "50%" }}
                                                            size="small"
                                                            name="fileCust"
                                                            type="file"
                                                            style={{ width: "500px" }}
                                                            required
                                                        >
                                                        </TextField><br></br>
                                                        <button
                                                            className="btn btn-primary btn-sm mt-2"
                                                            onClick={handleUploadDataCustomer}
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

            {/* Start Update Customer  */}
            <Dialog
                open={openFormUpdateCust}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseEditCust}
                maxWidth="xl"
                aria-describedby="alert-dialog-slide-description"
                style={{ width: "100%", margin: "0 auto" }}
            >
                <DialogActions>
                    <div className="dialog-actions-left" style={{ flex: "1", textAlign: "left", marginLeft: "5px" }}>
                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Update Data Customer </h5>
                    </div>
                    <div className="dialog-actions-right" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        <button className="btn btn-sm btn-danger" onClick={handleCloseEditCust}><i className="ri-shut-down-line"></i></button>
                    </div>
                </DialogActions>
                <DialogContent style={{
                    background: "#ecf0f1"
                }}>
                    <div className="row">
                        {/* Data Customer  */}
                        <div className="col-md-12 mb-1">
                            <div className="card">
                                <div className="card-body">
                                    <h6>Data Customer</h6>
                                    <form action="#">
                                        <div className="row">
                                            <div className="col-lg-6 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" readOnly value={updSingleID} id="single_id" placeholder="Nama Customer" />
                                                    <label htmlFor="nama_customer">Single ID</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" readOnly value={updCustomerName} id="nama_customer" placeholder="Nama Customer" />
                                                    <label htmlFor="nama_customer">Nama Customer</label>
                                                </div>
                                            </div>
                                            {/* <div className="col-lg-4 mb-2">
                                                <div className="form-floating">
                                                    <input type="email" className="form-control form-control-sm" onChange={handleChangeEmailCust} name="email_customer" value={updEmailCust !== null ? updEmailCust : ''} id="email_customer" placeholder="Email" />
                                                    <label htmlFor="email_customer">Email</label>
                                                </div>
                                            </div> */}
                                            <div className="col-lg-6 mb-2">
                                                <div className="form-floating">
                                                    <input type="number" className="form-control form-control-sm" onChange={handleChangeTelpCust} value={updTelpCust !== null ? updTelpCust : ''} name="telp_customer" id="telp_customer" placeholder="No Telepon" />
                                                    <label htmlFor="telp_customer">No Telepon</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglLahir} value={updTglLahir !== null ? updTglLahir : ''} name="tgl_lahir_customer" id="tgl_lahir_customer" placeholder="Tanggal Lahir" />
                                                    <label htmlFor="tgl_lahir_customer">Tanggal Lahir</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeAlamatNikCust} value={updAlamatNikCust !== null ? updAlamatNikCust : ''} name="alamat_nik" id="alamat_nik" placeholder="Email" />
                                                    <label htmlFor="alamat_nik">Alamat NIK</label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* Data DO & SPK */}
                        <div className="col-md-12 mb-1">
                            <div className="card">
                                <div className="card-body">
                                    <h6>Data Kendaraan</h6>
                                    <form action="#">
                                        <div className="row">
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <select type="text" className="form-control form-control-sm" value={updNoRangka} onChange={handleChooseVin} name="no_rangka" id="no_rangka" placeholder="Pilih VIN">
                                                        <option value="">-- Pilih No Rangka --</option>
                                                        {lsDtKendaraan.map((vlcar, idcar) => (
                                                            <option key={idcar} value={vlcar.no_rangka}>{vlcar.no_rangka + " (" + vlcar.status_unit + ")"}</option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="no_rangka">Pilih No Rangka</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeDoTam} value={updNoDoTam !== null ? updNoDoTam : ''} name="no_do_tam" id="no_do_tam" placeholder="No DO TAM" />
                                                    <label htmlFor="no_do_tam">No DO TAM</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeDo} value={updNoDo !== null ? updNoDo : ''} name="no_do" id="no_do" placeholder="No DO" />
                                                    <label htmlFor="no_do">No DO</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglDo} value={updTglDO !== null ? updTglDO : ''} name="tgl_do" id="tgl_do" placeholder="Tanggal DO" />
                                                    <label htmlFor="tgl_do">Tanggal DO</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNoSpk} value={updNoSpk !== null ? updNoSpk : ''} name="no_spk" id="no_spk" placeholder="No SPK" />
                                                    <label htmlFor="no_spk">No SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglSpk} value={updTglSpk !== null ? updTglSpk : ''} name="tgl_spk" id="tgl_spk" placeholder="Tanggal SPK" />
                                                    <label htmlFor="tgl_spk">Tanggal SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeKode} value={updKode !== null ? updKode : ''} name="kode" id="kode" placeholder="Kode" />
                                                    <label htmlFor="kode">Kode</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNamaSpk} value={updNamaSpk !== null ? updNamaSpk : ''} name="nama_spk" id="nama_spk" placeholder="Nama SPK" />
                                                    <label htmlFor="nama_spk">Nama SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNamaStnk} value={updNamaStnk !== null ? updNamaStnk : ''} name="nama_stnk" id="nama_stnk" placeholder="Nama STNK" />
                                                    <label htmlFor="nama_stnk">Nama Customer (STNK)</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglAjuAfi} value={updTglAjuAfi !== null ? updTglAjuAfi : ''} name="tgl_aju_afi" id="tgl_aju_afi" placeholder="Tanggal AJU AFI" />
                                                    <label htmlFor="tgl_aju_afi">Tanggal Aju Afi</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNikbdoSpk} value={updNikbdoSpk !== null ? updNikbdoSpk : ''} name="nikbdo_spk" id="nikbdo_spk" placeholder="NIK/NIB SPK" />
                                                    <label htmlFor="nikbdo_spk">NIK/NIB SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNikbdoStnk} value={updNikbdoStnk !== null ? updNikbdoStnk : ''} name="nikbdo_stnk" id="nikbdo_stnk" placeholder="NIK/NIB STNK" />
                                                    <label htmlFor="nikbdo_stnk">NIK/NIB STNK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeKetType} value={updKetType !== null ? updKetType : ''} name="ket_type" id="ket_type" placeholder="Ket Type" />
                                                    <label htmlFor="ket_type">Ket Type</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeType} value={updType !== null ? updType : ''} name="type" id="type" placeholder="Type" />
                                                    <label htmlFor="type">Type</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeWarna} value={updWarna !== null ? updWarna : ''} name="warna" id="warna" placeholder="Warna" />
                                                    <label htmlFor="warna">Warna</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeLeasing} value={updLeasing !== null ? updLeasing : ''} name="leasing" id="leasing" placeholder="Leasing" />
                                                    <label htmlFor="leasing">Leasing</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeAsuransi} value={updAsuransi !== null ? updAsuransi : ''} name="asuransi" id="asuransi" placeholder="Asuransi" />
                                                    <label htmlFor="Asuransi">Asuransi</label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">

                        </div>
                        <div className="col-lg-6">
                            <div className="text-end">
                                <button onClick={handleSubmitUpdateCust} className="btn btn-primary btn-label"><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {/* End Update Customer */}

            {/* Follow Up and Update  */}
            <Dialog
                open={openUpdFollow}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="xl"
                onClose={closeUpdFollow}
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
                                                    <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Update Data Kendaraan & Follow Up</h5>
                                                    <span className="badge bg-primary-subtle text-primary badge-border mt-4" style={{ fontWeight: "bold", fontSize: "12px", marginLeft: "5px" }}>{"BUYER: " + customerBuyer}</span>
                                                    <span className="badge bg-primary-subtle text-primary badge-border mt-4" style={{ fontWeight: "bold", fontSize: "12px", marginLeft: "5px" }}>{"No Telepon: " + telpBuyer}</span><br />
                                                    <span className="badge bg-warning-subtle text-warning badge-border mt-3" style={{ fontWeight: "bold", fontSize: "12px", marginLeft: "5px" }}>{"Datang Service: " + customerService}</span>
                                                    <span className="badge bg-warning-subtle text-warning badge-border mt-3" style={{ fontWeight: "bold", fontSize: "12px", marginLeft: "5px" }}>{"No Telepon: " + telpService}</span>
                                                </div>
                                                <div className="flex-shrink-0">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <form>
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={serviceNoRangka} id="no_rangka_service" name="no_rangka_service" placeholder="No Rangka" />
                                                                    <label htmlFor="deliver">No Rangka</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <div className="form-floating">
                                                                    <input type="text" className="form-control form-control-sm" readOnly value={serviceModelKendaraan} id="model_kendaraan" name="model_kendaraan" placeholder="Model Kendaraan" />
                                                                    <label htmlFor="deliver">Model Kendaraan</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <div className="form-floating">
                                                                    <select type="text" className="form-control form-control-sm" required onChange={handleChangePertanyaanSatu} value={pertanyaanSatu} id="pertanyaansatu" name="pertanyaansatu" placeholder="Pertanyaan 1">
                                                                        <option value="">-- Pilih --</option>
                                                                        <option value="buyer">Buyer (Pembeli)</option>
                                                                        <option value="user">User (Pemakai)</option>
                                                                    </select>
                                                                    <label htmlFor="deliver">Status Kepemilikan Pelanggan Service ?</label>
                                                                    <small style={{fontSize: "10px"}}><i>Pelanggan ketika datang service</i></small>
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
                                                        <button onClick={handleSubmitUpdFollow} className="btn btn-primary btn-block btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Update Kendaraan</button>
                                                        <button onClick={closeUpdFollow} className="btn btn-danger btn-label btn-sm btn-block" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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

            {/* Start History Kendaraan */}
            <Dialog
                open={openHistoryCar}
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
                                        <div className="card-header" style={{ border: "none" }}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>History Kendaraan <br />{historyNoRangka}</h5>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={closeHistoryCar}><i className="ri-close-circle-fill"></i> Close</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-lg-12 mt-2 p-3">
                                                    <div className="card" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                        {listHistoryCar.map((val, idx) => (
                                                            <div key={idx}>
                                                                <div className="align-items-center d-flex" style={{ marginBottom: "5px" }}>
                                                                    <div className="live-preview  col-md-12">
                                                                        <div className="list-group">
                                                                            <a href="javascript:void(0);" className="list-group-item list-group-item-action">
                                                                                <div className="float-end">
                                                                                    <span className={`badge ${val.status_customer === 'active' ? 'bg-success' : 'bg-danger'}`}>{val.status_customer}</span>
                                                                                </div>
                                                                                <div className="d-flex mb-2 align-items-center">
                                                                                    <div className="flex-shrink-0">
                                                                                        <i className={`avatar-sm rounded-circle bx ${val.status_customer === 'active' ? 'bx-user-check' : 'ri-shield-user-line'}`} style={{ fontSize: "40px" }}></i>
                                                                                    </div>
                                                                                    <div className="flex-grow-1 ms-3">
                                                                                        <h5 className="list-title fs-15 mb-1">{val.nama_customer + ' - ' + val.no_telp + ' '}</h5>
                                                                                        <p className="list-text mb-0 fs-12">{val.tipe}</p>
                                                                                        <p className="list-text mb-0 fs-12"><b>{val.no_rangka}</b></p>
                                                                                        <p className="list-text mb-0 fs-12"><b>{"Pemilik ke - " + (idx+1)}</b></p>
                                                                                    </div>
                                                                                </div>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
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
            {/* End History Service */}
        </div>
    );
}

export default Datacustomers;
