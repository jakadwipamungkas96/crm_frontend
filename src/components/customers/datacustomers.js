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

    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const [lsDtCustomer, setLsDtCustomer] = useState([]);
    
    useEffect(() => {
        setLoading(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/customers/datacustomer?page=${currentPage}&size=${perPage}`;
            try {

                const response = await axios.get(url);
                setTotalRows(response.data.totalAll);
                setLoading(false);
                setLsDtCustomer(response.data.data);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [currentPage, perPage, refreshDt]);

    const handlePageChange = (page, totalRows) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPageSize(newPerPage);
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
        headCells: {
            style: {
                background: "#DC2626",
                color: "white",
                textAlign: "center"
            },
        }
    };
    
    const columnsLsCustomer = [
        {
            name: 'Aksi',
            cell: row => <>
                            {/* <button style={{fontSize: "12px"}} type="button" className={`btn btn-secondary btn-sm ${rulesName == 'sales' ? '' : 'd-none'}`}> */}
                            <button style={{fontSize: "12px"}} type="button" onClick={(event) => {handleOpenEditCust(row);}} className={`btn btn-secondary btn-sm`}>
                                <i className="ri-edit-2-line"></i> <strong>Update</strong>
                            </button>
                            <button onClick={(event) => {handleOpenCardCustomer(row);}} style={{fontSize: "12px", marginLeft: "10px"}} type="button" className="btn btn-primary btn-sm">
                                <span className="badge bg-success ms-1">{row.total_kendaraan}</span> <strong>Kendaraan</strong>
                            </button> 
                        </>,
            width: "250px"
        },
        // {
        //     name: 'Total Kendaraan',
        //     selector: row => row.total_kendaraan,
        //     sortable: true,
        //     width: "100px"
        // },
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
            name: 'No Telepon',
            selector: row => row.telp,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            width: "150px"
        },
        {
            name: 'Alamat',
            selector: row => row.alamat_nik,
            sortable: true,
            width: "300px"
        },
        {
            name: 'Kecamatan',
            selector: row => row.kecamatan,
            sortable: true,
            width: "200px"
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
    const [lstDtTenggatStnk, setlsTenggatStnk] = useState([]);
    const [totalKendaraan, setTotalKendaraan] = useState(0);
    const [isCardShow, setIsCardShow] = useState(false); // Buka customer card
    const [isCardSales, setCardSales] = useState(false); // Buka sales card
    const [dtCar, setDtCar] = useState([]);
    const [infoDtCar, setInfoDtCar] = useState([]);
    const [infoDtPenjualan, setInfoDtPenjualan] = useState([]);
    const [infoDtServices, setInfoDtServices] = useState([]);

    const handleOpenDetailKendaraan = (event) => {
        if (rulesName == "superadmin") {
            
            setIsCardShow(true);
            setDtCar(event);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios
                .get("http://127.0.0.1:8000/api/customers/datacustomer/detail/infokendaraan?vin="+event.no_rangka)
                .then((response) => {
                    setInfoDtCar(response.data.dtKendaraan);
                    setInfoDtPenjualan(response.data.dtPenjualan);
                    setInfoDtServices(response.data.dtService);
                });

        } else if (rulesName == "sales"){
            console.log("buka card sales");
            setCardSales(true);
            setDtCar(event);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios
                .get("http://127.0.0.1:8000/api/customers/datacustomer/detail/infokendaraan?vin="+event.no_rangka)
                .then((response) => {
                    setInfoDtCar(response.data.dtKendaraan);
                    setInfoDtPenjualan(response.data.dtPenjualan);
                    setInfoDtServices(response.data.dtService);
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
            .get("http://127.0.0.1:8000/api/customers/datacustomer/detail?single_id="+singleID)
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
        headCells: {
            style: {
                background: "#DC2626",
                color: "white",
                textAlign: "center"
            },
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
            selector: row => row.status_unit,
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
            width: "150px"
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

    const urlExport = `http://127.0.0.1:8000/api/summary/export/customers?cabang_name=${cleanedCabangName}&id_cabang=${idCab}`;
    const urlDownloadForm = `http://127.0.0.1:8000/api/template_form_update_data_customer`;

    const [importExcel, setimportExcel] = React.useState(false);
    const [fileUpload, setFileUp] = React.useState([]);
    const [inputsImport, setInputs] = React.useState([]);

    const hChangeInputFile = (event) => {
        console.log(event.target.files[0]);
        console.log(event.target.name);
        setFileUp(event.target.files[0]);
        setInputs(values => ({...values, [event.target.name]: fileUpload}));
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
                <img src="/assets/images/icon_wijaya.png" style={{opacity: 0.8}} alt="" height="50" /><br /><br />
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
        
        formData.append('fileCust',fileUpload);

        setLoading(true);
        axios.post('http://127.0.0.1:8000/api/customers/datacustomers/import_update', formData).then(function(response){
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
        setupdAlamatNikCust(event.alamat_nik);
        // Konversi tanggal input ke objek Date
        const dateObj = new Date(event.tgl_ultah);
        // Dapatkan tahun, bulan, dan tanggal dari objek Date
        const year = dateObj.getFullYear();
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Tambahkan 1 karena bulan dimulai dari 0
        const day = ('0' + dateObj.getDate()).slice(-2);

        // Gabungkan tahun, bulan, dan tanggal sesuai dengan format yang diinginkan
        const formattedDate = `${year}-${month}-${day}`;
        setupdTglLahir(formattedDate);
        
        setFormUpdateCust(true);
    }

    const handleCloseEditCust = (event) => {
        setFormUpdateCust(false);
    }

    const handleChooseVin = (event) => {
        getDetailbyVin(event.target.value);
    }

    const handleSubmitUpdateCust = (event) => {
        console.log(inputsUpdCust);
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

    function getDetailbyVin(vin) {
        console.log(vin);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios
            .get("http://127.0.0.1:8000/api/delivery_orders/detail/vin?vin="+vin)
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
                } else {
                    setupdNoDoTam(response.data.data.no_do_tam);
                    setupdNoDo(response.data.data.no_do);
                    
                    setupdTglDO(formatDateInput(response.data.data.tgl_do));
                    setupdTglSpk(formatDateInput(response.data.data.tgl_spk));
                    setupdNoSpk(response.data.data.no_spk);
                    setupdKode(response.data.data.kode);
                    setupdNamaSpk(response.data.data.nama_spk);
                    setupdNamaStnk(response.data.data.nama_stnk);
                    setupdTglAjuAfi(formatDateInput(response.data.data.tgl_aju_afi));
                    setupdNikbdoSpk(response.data.data.nikbdo_spk);
                    setupdNikbdoStnk(response.data.data.nikbdo_stnk);
                    setupdKetType(response.data.data.ket_type);
                    setupdType(response.data.data.type);
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
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="card-title mb-0">List Data Customer</h5> 
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" style={{background: "#CBD5E1", fontSize: "10px"}} className='p-2'>
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
                                        {/* <h5 className="card-title mb-0">List Data Customer</h5>  */}
                                        <div id="" className='p-2 col-md-3'>
                                            <input
                                                className="form-control form-control-md"
                                                type="text"
                                                value={searchText}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                placeholder="Search..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {/* Content disini  */}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" className='p-2'>
                                            <a href={urlExport} className="btn btn-sm btn-success"><i className="ri-file-excel-2-fill"></i> Export Excel</a>
                                            <a onClick={handleOpenFormImport} className="btn btn-sm btn-info" style={{marginLeft: "5px", cursor: "pointer"}}><i className="ri-edit-2-line"></i> Multi Update</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{padding: "15px"}}>
                                {isLoading ? (
                                    <div className="text-center ">
                                        <i className="mdi mdi-spin mdi-loading" style={{fontSize: "30px", color: "#991B1B"}}></i> <h6 className="m-0 loading-text">Please wait...</h6>
                                    </div>
                                ) : (
                                    
                                    <DataTable
                                        columns={columnsLsCustomer}
                                        data={displayData}
                                        pagination
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
                                                                <span className="card-title mb-0" style={{fontSize: "14px"}}>NIK: {nameCustomer.nik == null ? (<span className="badge bg-dark-subtle text-body badge-border">NIK Kosong</span>) : nameCustomer.nik}</span><br></br>
                                                                <p className="card-text" style={{fontSize: "20px"}}><span className="text-dark"><i className="ri-car-washing-fill"></i> <b>{totalKendaraan}</b> Total Kendaraan</span></p>
                                                                <hr></hr>
                                                                <p className="card-text mb-2 text-muted" style={{fontSize: "13px"}}><i className="ri-phone-fill"></i> {nameCustomer.telp == null ? (<span className="badge bg-dark-subtle text-body badge-border">No Telepon Kosong</span>) : nameCustomer.telp}</p>
                                                                <p className="card-text mb-2 text-muted" style={{fontSize: "13px"}}><i className="ri-cake-2-line"></i> {nameCustomer.tgl_ultah == "" ? (<span className="badge bg-dark-subtle text-body badge-border">Tanggal Kosong</span>) : nameCustomer.tgl_ultah} 
                                                                 {currentDateFormatted == nameCustomer.tgl_ultah_cek ? (<span className="badge bg-primary">Hari ini berulang tahun</span>) : ""}</p>
                                                                <p className="card-text mb-2" style={{fontSize: "13px"}}>
                                                                    {nameCustomer.alamat_nik == null ? (<span className="badge bg-dark-subtle text-body badge-border">Alamat Kosong</span>) : nameCustomer.alamat_nik}
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
                                                        <span className="card-title mb-0" style={{fontSize: "15px", fontWeight: 500}}><i className="ri-calendar-event-fill"></i> {"List Masa Tenggat STNK Bulan Ini"}</span>
                                                    </div>
                                                    <div className="card-body" style={{overflow: "y", maxHeight: 100}}>
                                                        <ul className="list-group">
                                                            {lstDtTenggatStnk.map((val, idx) => (
                                                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                                    <span style={{fontSize: 11}}><b>{val.no_rangka}</b> - {"("+val.model_type+")"} - <b>{val.nama_customer}</b><br></br> <span className="text-muted">Tanggal STNK: 15 November 2023</span></span> 
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
                                                        <div style={{height: "auto"}}>
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
                                        <div className="card-header" style={{border: "none"}}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="card-title mb-0" style={{fontSize: "17px"}}>Data Unit 
                                                        <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i> {dtCar.no_rangka}</span>
                                                        <span className="badge badge-label bg-primary" style={{fontSize: "12px"}}><i className="mdi mdi-circle-medium"></i> {"Tanggal STNK: "+dtCar.tgl_stnk}</span>
                                                    </h5>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={handleCardShowClose}><i className="ri-close-circle-fill"></i> Close</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body" style={{zIndex: 1}}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div style={{ overflowX: 'auto' }}>
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
                                                                    <td className="text-muted">{infoDtPenjualan.tgl_do}</td>
                                                                    <td className="text-muted">{infoDtPenjualan.nama_sales}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Leasing</td>
                                                                    <td className="text-muted">{infoDtPenjualan.nama_leasing == null ? "" : infoDtPenjualan.nama_leasing}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Asuransi</td>
                                                                    <td className="text-muted">{infoDtPenjualan.asuransi == null ? "" : infoDtPenjualan.asuransi}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>DO Asal</td>
                                                                    <td className="text-muted">{infoDtPenjualan.asal_do}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div style={{ overflowX: 'auto' }}>
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
                                                                    <td className="text-muted">{infoDtCar.no_rangka}</td>
                                                                    <td className="text-muted">{infoDtCar.no_pol}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Type</td>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Warna</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-muted">{infoDtCar.tipe}</td>
                                                                    <td className="text-muted">{infoDtCar.warna}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Nama STNK</td>
                                                                    <td className="text-muted">{infoDtCar.nama_stnk}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div style={{ overflowX: 'auto' }}>
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
                                                                    <td className="text-muted">{infoDtServices.nama_pemakai}</td>
                                                                    <td className="text-muted">{infoDtServices.tgl_service}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Keterangan Service</td>
                                                                    <td className="text-muted">{infoDtServices.keterangan_service}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Lokasi Service</td>
                                                                    <td className="text-muted">{infoDtServices.cabang_name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>No Telepon Pemakai</td>
                                                                    <td className="text-muted">
                                                                        {infoDtServices.telepon_pemakai} <button className="btn btn-info btn-sm" onClick={alertNotifSend}><i className="ri-phone-fill"></i></button>
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
                                        <div className="card-header" style={{border: "none"}}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="card-title mb-0" style={{fontSize: "17px"}}>SALES CARD 
                                                        <span className="badge badge-label bg-secondary"><i className="mdi mdi-circle-medium"></i> {personName}</span>
                                                        <span className="badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> {"Unit: " + dtCar.no_rangka}</span>
                                                        <span className="badge badge-label bg-danger" style={{fontSize: "12px"}}><i className="mdi mdi-circle-medium"></i> {"Tanggal STNK: "+dtCar.tgl_stnk}</span>
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
                                                    <div style={{ overflowX: 'auto' }}>
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
                                                                    <td className="text-muted">{infoDtPenjualan.tgl_do}</td>
                                                                    <td className="text-muted">{infoDtPenjualan.nama_sales}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Leasing</td>
                                                                    <td className="text-muted">{infoDtPenjualan.nama_leasing == null ? "" : infoDtPenjualan.nama_leasing}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>Asuransi</td>
                                                                    <td className="text-muted">{infoDtPenjualan.asuransi == null ? "" : infoDtPenjualan.asuransi}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{background: "#E2E8F0", fontWeight: "600"}}>DO Asal</td>
                                                                    <td className="text-muted">{infoDtPenjualan.asal_do}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div className="col-md-8">
                                                    <div style={{ overflowX: 'auto' }}>
                                                        <table className="table table-bordered align-middle table-nowrap mb-0">
                                                            <thead style={{background: "#E2E8F0"}}>
                                                                <tr>
                                                                    <th colSpan={7} style={{padding: "7px", fontSize: "12px"}}>Informasi Kendaraan</th>
                                                                </tr>
                                                                <tr style={{padding: "7px", fontSize: "12px"}}>
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
                                                            <thead style={{background: "#E2E8F0"}}>
                                                                <tr>
                                                                    <th colSpan={6} style={{padding: "7px", fontSize: "12px"}}>
                                                                        Informasi Service Terakhir
                                                                    </th>
                                                                </tr>
                                                                <tr style={{padding: "7px", fontSize: "12px"}}>
                                                                    <th scope="col">Nama Pemakai</th>
                                                                    <th scope="col">No Telepon</th>
                                                                    <th scope="col">Keterangan</th>
                                                                    <th scope="col">Tanggal</th>
                                                                    <th scope="col">Lokasi Service</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-muted">Alberto</td>
                                                                    <td className="text-muted">+628123456789</td>
                                                                    <td className="text-muted">Ganti Oli</td>
                                                                    <td className="text-muted">11 November 2023</td>
                                                                    <td className="text-muted">
                                                                        <span className="badge badge-label bg-secondary badge-sm"><i className="lab las la-map-marker"></i> Wijaya Padalarang</span>
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
                                        <div className="card-header" style={{border: "none"}}>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="card-title mb-0" style={{fontSize: "17px"}}>Multi Update Data Customer </h5>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <a href={urlDownloadForm} className="btn btn-sm btn-icon btn-success p-2" style={{width: "100%", cursor: "pointer"}}><i className="ri-file-excel-fill"></i> Download Template Form</a>
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
                                                            sx={{width: "50%"}}
                                                            size= "small"
                                                            name="fileCust"
                                                            type="file"
                                                            style={{width: "500px"}}
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
                    <div className="dialog-actions-left" style={{flex: "1",textAlign: "left", marginLeft: "5px"}}>
                        <h5 className="card-title mb-0" style={{fontSize: "17px"}}>Update Data Customer </h5>
                    </div>
                    <div className="dialog-actions-right" style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
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
                                                    <input type="text" className="form-control form-control-sm" readOnly value={updSingleID} id="nama_customer" placeholder="Nama Customer" />
                                                    <label htmlFor="nama_customer">Single ID</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" readOnly value={updCustomerName} id="nama_customer" placeholder="Nama Customer" />
                                                    <label htmlFor="nama_customer">Nama Customer</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-2">
                                                <div className="form-floating">
                                                    <input type="email" className="form-control form-control-sm" onChange={handleChangeEmailCust} value={updEmailCust !== null ? updEmailCust : ''} id="email_customer" placeholder="Email" />
                                                    <label htmlFor="email_customer">Email</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-2">
                                                <div className="form-floating">
                                                    <input type="number" className="form-control form-control-sm" onChange={handleChangeTelpCust} value={updTelpCust !== null ? updTelpCust : ''} id="telp_customer" placeholder="No Telepon" />
                                                    <label htmlFor="telp_customer">No Telepon</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglLahir} value={updTglLahir !== null ? updTglLahir : ''} id="tgl_lahir_customer" placeholder="Tanggal Lahir" />
                                                    <label htmlFor="tgl_lahir_customer">Tanggal Lahir</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeAlamatNikCust} value={updAlamatNikCust !== null ? updAlamatNikCust : ''} id="alamat_nik" placeholder="Email" />
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
                                                    <select type="text" className="form-control form-control-sm" onChange={handleChooseVin} id="no_rangka" placeholder="Pilih VIN">
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
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeDoTam} value={updNoDoTam !== null ? updNoDoTam : ''} id="no_do_tam" placeholder="No DO TAM" />
                                                    <label htmlFor="no_do_tam">No DO TAM</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeDo} value={updNoDo !== null ? updNoDo : ''} id="no_do" placeholder="No DO" />
                                                    <label htmlFor="no_do">No DO</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglDo} value={updTglDO !== null ? updTglDO : ''} id="tgl_do" placeholder="Tanggal DO" />
                                                    <label htmlFor="tgl_do">Tanggal DO</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNoSpk} value={updNoSpk !== null ? updNoSpk : ''} id="no_spk" placeholder="No SPK" />
                                                    <label htmlFor="no_spk">No SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglSpk} value={updTglSpk !== null ? updTglSpk : ''} id="tgl_spk" placeholder="Tanggal SPK" />
                                                    <label htmlFor="tgl_spk">Tanggal SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeKode} value={updKode !== null ? updKode : ''} id="kode" placeholder="Kode" />
                                                    <label htmlFor="kode">Kode</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNamaSpk} value={updNamaSpk !== null ? updNamaSpk : ''} id="nama_spk" placeholder="Nama SPK" />
                                                    <label htmlFor="nama_spk">Nama SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNamaStnk} value={updNamaStnk !== null ? updNamaStnk : ''} id="nama_stnk" placeholder="Nama STNK" />
                                                    <label htmlFor="nama_stnk">Nama Customer (STNK)</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="date" className="form-control form-control-sm" onChange={handleChangeTglAjuAfi} value={updTglAjuAfi !== null ? updTglAjuAfi : ''} id="tgl_aju_afi" placeholder="Tanggal AJU AFI" />
                                                    <label htmlFor="tgl_aju_afi">Tanggal Aju Afi</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNikbdoSpk} value={updNikbdoSpk !== null ? updNikbdoSpk : ''} id="nikbdo_spk" placeholder="NIK/NIB SPK" />
                                                    <label htmlFor="nikbdo_spk">NIK/NIB SPK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeNikbdoStnk} value={updNikbdoStnk !== null ? updNikbdoStnk : ''} id="nikbdo_stnk" placeholder="NIK/NIB STNK" />
                                                    <label htmlFor="nikbdo_stnk">NIK/NIB STNK</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeKetType} value={updKetType !== null ? updKetType : ''} id="ket_type" placeholder="Ket Type" />
                                                    <label htmlFor="ket_type">Ket Type</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control form-control-sm" onChange={handleChangeType} value={updType !== null ? updType : ''} id="type" placeholder="Type" />
                                                    <label htmlFor="type">Type</label>
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
        </div>
    );
}

export default Datacustomers;
