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

function Users() {
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

    const [dataUsers, setDataUsers] = useState([]);
    const [refreshDt, setRefresh] = useState();
    // const [isLoading, setLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const rulesName = JSON.parse(localStorage.getItem("rules"));
    console.log(token);

    const [lsDtUsers, setLsDtUsers] = useState([]);

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/users`;
            try {

                const response = await axios.get(url);
                setLsDtUsers(response.data.data);
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

    const columnsLsUsers = [
        {
            name: 'ID',
            selector: row => row.id_key,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Aksi',
            selector: row => {
                return <>
                    <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                        {/* <button onClick={(event) => { handleEdit(row); }} type="button" className="btn btn-info"><i className="ri ri-checkbox-circle-fill"></i> Update</button>
                        <button onClick={(event) => { handleDelete(row); }} type="button" className="btn btn-danger"><i className="ri ri-close-circle-fill"> </i>Delete</button> */}
                        <button type="button" data-toggle="tooltip" title="Edit Users" onClick={(event) => { handleEdit(row); }} class="btn btn-sm btn-success btn-icon waves-effect waves-light"><i class="ri-edit-2-line"></i></button>
                        <button type="button" data-toggle="tooltip" title="Reset Password" onClick={(event) => { handleEdit(row); }} class="btn btn-sm btn-info btn-icon waves-effect waves-light"><i class="ri-restart-line"></i></button>
                        <button type="button" data-toggle="tooltip" title="Delete Users" onClick={(event) => { handleDelete(row); }} className="btn btn-sm btn-danger btn-icon waves-effect waves-light"><i class="ri-delete-bin-5-line"></i></button>
                    </div>
                </>
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'Nama',
            selector: row => row.person,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Role',
            selector: row => row.rules,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Last Login',
            selector: row => row.last_login,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Cabang',
            selector: row => row.cabang_name,
            sortable: true,
            width: '300px',
        },
    ];

    const handleSearch = (text) => {
        setSearchText(text);
    };

    // Logika pencarian, memfilter data berdasarkan beberapa kolom
    const filteredData = lsDtUsers.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const displayData = searchText ? filteredData : lsDtUsers;

    const [openFormAdd, setOpenFormAdd] = useState(false);
    const [openFormEdit, setOpenEdit] = useState(false);
    const [inputUsers, setInputUsers] = useState([]);
    const [updateUsers, setUpdateUsers] = useState([]);
    const [listCabang, setListCabang] = useState([]);
    const [listSpv, setListSpv] = useState([]);
    const [addNamaLengkap, setNamaLengkap] = useState();
    const [addUsername, setUsername] = useState();
    const [addPassword, setPassword] = useState();
    const [addRole, setRole] = useState();
    const [addSpv, setSpv] = useState();
    const [addSalesId, setSalesId] = useState();
    const [addSpvId, setSpvId] = useState();
    const [addCabang, setCabang] = useState();

    const [updateNamaLengkap, setUpdateNamaLengkap] = useState();
    const [updateUsername, setUpdateUsername] = useState();
    const [updatePassword, setUpdatePassword] = useState();
    const [updateRole, setUpdateRole] = useState();
    const [updateSpv, setUpdateSpv] = useState();
    const [updateSalesId, setUpdateSalesId] = useState();
    const [updateSpvId, setUpdateSpvId] = useState();
    const [updateCabang, setUpdateCabang] = useState();

    // GET CABANG LIST
    const getCabang = async () => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const url = `http://127.0.0.1:8000/api/users/opt/cabang`;
        try {
            const response = await axios.get(url);
            setListCabang(response.data.data);
        } catch (error) {
            // console.log(error);
        }
    }

    const getSpv = async (id_cabang) => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const url = `http://127.0.0.1:8000/api/users/data/getspv?id_cabang=${id_cabang}`;
        try {
            const response = await axios.get(url);
            setListSpv(response.data.data);
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        getCabang();
    }, []);

    const handleOpenFormAdd = (event) => {
        setOpenFormAdd(true);
    }

    const closeFormAdd = (event) => {
        setOpenFormAdd(false);
        setInputUsers([]);
    }

    const handleNamaLengkap = (event) => {
        setNamaLengkap(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUsername = (event) => {
        setUsername(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleRole = (event) => {
        setRole(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSpv = (event) => {
        setSpv(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleCabang = (event) => {
        setCabang(event.target.value);
        getSpv(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSalesId = (event) => {
        setSalesId(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSpvId = (event) => {
        setSpvId(event.target.value);
        setInputUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSubmitUsers = (event) => {
        event.preventDefault();
        console.log(inputUsers);
        axios.post('http://127.0.0.1:8000/api/users/create', inputUsers).then(function(response){
            
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

                window.location.href = "/users";

            }
        });
    }

    

    const handleEdit = (event) => {
        console.log(event);
        setOpenEdit(true);
        setUpdateNamaLengkap(event.person);
        setUpdateCabang(event.id_cabang);
        setUpdateRole(event.rules);
        setUpdateSalesId(event.sales_id);
        setUpdateSpvId(event.spv_id);
        setUpdateUsername(event.username);
        getSpv(event.id_cabang);
        setUpdateUsers((values) => ({
            ...values,
            ["id"]: event.id,
            ["update_id_cabang"]: event.id_cabang,
            ["update_person"]: event.person,
            ["update_rules"]: event.rules,
            ["update_username"]: event.username,
            ["update_sales_id"]: event.sales_id,
            ["update_spv_id"]: event.spv_id,
            ["update_team_id"]: event.spv_id,
        }));
    }

    const handleUpdateNamaLengkap = (event) => {
        setUpdateNamaLengkap(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUpdateUsername = (event) => {
        setUpdateUsername(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUpdatePassword = (event) => {
        setUpdatePassword(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUpdateRole = (event) => {
        setUpdateRole(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUpdateSpv = (event) => {
        setUpdateSpvId(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUpdateCabang = (event) => {
        setUpdateCabang(event.target.value);
        getSpv(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUpdateSalesId = (event) => {
        setUpdateSalesId(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleUpdateSpvId = (event) => {
        setUpdateSpvId(event.target.value);
        setUpdateUsers((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }
    

    const closeFormEdit = (event) => {
        setOpenEdit(false);
        setUpdateUsers([]);
    }

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        axios.post('http://127.0.0.1:8000/api/users/update', updateUsers).then(function(response){
            
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

                window.location.href = "/users";

            }
        });
    }

    const handleDelete = (event) => {
        console.log(event.id);
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
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Users Management</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">List</a></li>
                                    <li className="breadcrumb-item active"><a href="#">Users</a></li>
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
                                        <h5 className="card-title mb-0">List Users</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            value={searchText}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Search..."
                                            style={{ width: "50%" }}
                                        />
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <button className="btn btn-primary btn-sm" onClick={handleOpenFormAdd}><i className="ri-user-add-line"></i> Add Users</button>
                                    </div>
                                    <div className="col-md-12">
                                        {loadingTable ? (
                                            <div className="text-center ">
                                                <i className="mdi mdi-spin mdi-loading" style={{ fontSize: "30px", color: "#991B1B" }}></i> <h6 className="m-0 loading-text">Please wait...</h6>
                                            </div>
                                        ) : (

                                            <DataTable
                                                className="mt-2"
                                                columns={columnsLsUsers}
                                                data={displayData}
                                                pagination
                                                paginationPerPage={5}
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
                </div>

                {/* Start Add Users  */}
                <Dialog
                    open={openFormAdd}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={closeFormAdd}
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
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Input New Users</h5>
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
                                                                        <select type="text" className="form-control form-control-sm" value={addCabang} onChange={handleCabang} name="id_cabang" id="cabang" placeholder="cabang">
                                                                            <option value={''}>-- Pilih Cabang --</option>
                                                                            {listCabang.map((val, index) => (
                                                                                <option key={index} value={val.id}>{val.cabang_name}</option>
                                                                            ))}
                                                                            <option value={5}>Head Office Wijaya Toyota</option>
                                                                        </select>
                                                                        <label htmlFor="cabang">Pilih Cabang</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={addNamaLengkap} onChange={handleNamaLengkap} name="person" id="nama_lengkap" placeholder="Nama Lengkap" />
                                                                        <label htmlFor="nama_lengkap">Nama Lengkap</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" value={addRole} onChange={handleRole} name="rules" id="role" placeholder="role">
                                                                            <option value={''}>-- Pilih Role --</option>
                                                                            <option value={'superadmin'}>Superadmin</option>
                                                                            <option value={'administrator'}>Administrator</option>
                                                                            <option value={'sales'}>Sales</option>
                                                                            <option value={'spv'}>SPV</option>
                                                                            <option value={'crc'}>CRC</option>
                                                                            <option value={'mra'}>MRA</option>
                                                                        </select>
                                                                        <label htmlFor="role">Pilih Role Users</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${addRole === 'sales' ? '' : 'd-none'}`}>
                                                                    <div className={`form-floating`}>
                                                                        <select type="text" className={`form-control form-control-sm`} value={addSpv} onChange={handleSpv} name="team_id" id="spv" placeholder="spv">
                                                                            <option value={''}>-- Pilih Team SPV --</option>
                                                                            {listSpv.map((val, index) => (
                                                                                <option key={index} value={val.spv_id}>{val.nama_spv}</option>
                                                                            ))}
                                                                        </select>
                                                                        <label htmlFor="spv">Pilih Team SPV</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${addRole === 'sales' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={addSalesId} onChange={handleSalesId} name="sales_id" id="sales_id" placeholder="sales_id" />
                                                                        <label htmlFor="sales_id">Sales ID</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${addRole === 'spv' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={addSpvId} onChange={handleSpvId} name="spv_id" id="spv_id" placeholder="spv_id" />
                                                                        <label htmlFor="spv_id">Spv ID</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={addUsername} onChange={handleUsername} name="username" id="username" placeholder="username" />
                                                                        <label htmlFor="username">Username</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="password" className="form-control form-control-sm" value={addPassword} onChange={handlePassword} name="password" id="password" placeholder="Password" />
                                                                        <label htmlFor="Password">Password</label>
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
                                                            <button onClick={handleSubmitUsers} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                            <button onClick={closeFormAdd} className="btn btn-danger btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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

                {/* Update Users */}
                <Dialog
                    open={openFormEdit}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={closeFormEdit}
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
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Edit Users</h5>
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
                                                                        <select type="text" className="form-control form-control-sm" value={updateCabang} onChange={handleUpdateCabang} name="update_id_cabang" id="cabang" placeholder="cabang">
                                                                            <option value={''}>-- Pilih Cabang --</option>
                                                                            {listCabang.map((val, index) => (
                                                                                <option key={index} value={val.id}>{val.cabang_name}</option>
                                                                            ))}
                                                                            <option value={5}>Head Office Wijaya Toyota</option>
                                                                        </select>
                                                                        <label htmlFor="cabang">Pilih Cabang</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={updateNamaLengkap} onChange={handleUpdateNamaLengkap} name="update_person" id="nama_lengkap" placeholder="Nama Lengkap" />
                                                                        <label htmlFor="nama_lengkap">Nama Lengkap</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <select type="text" className="form-control form-control-sm" value={updateRole} onChange={handleUpdateRole} name="update_rules" id="role" placeholder="role">
                                                                            <option value={''}>-- Pilih Role --</option>
                                                                            <option value={'superadmin'}>Superadmin</option>
                                                                            <option value={'administrator'}>Administrator</option>
                                                                            <option value={'sales'}>Sales</option>
                                                                            <option value={'spv'}>SPV</option>
                                                                            <option value={'crc'}>CRC</option>
                                                                            <option value={'mra'}>MRA</option>
                                                                        </select>
                                                                        <label htmlFor="role">Pilih Role Users</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${updateRole === 'sales' ? '' : 'd-none'}`}>
                                                                    <div className={`form-floating`}>
                                                                        <select type="text" className={`form-control form-control-sm`} value={updateSpvId} onChange={handleUpdateSpv} name="update_team_id" id="spv" placeholder="spv">
                                                                            <option value={''}>-- Pilih Team SPV --</option>
                                                                            {listSpv.map((val, index) => (
                                                                                <option key={index} value={val.spv_id}>{val.nama_spv}</option>
                                                                            ))}
                                                                        </select>
                                                                        <label htmlFor="spv">Pilih Team SPV</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${updateRole === 'sales' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={updateSalesId} onChange={handleUpdateSalesId} name="update_sales_id" id="sales_id" placeholder="sales_id" />
                                                                        <label htmlFor="sales_id">Sales ID</label>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-6 mb-2 ${updateRole === 'spv' ? '' : 'd-none'}`}>
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={updateSpvId} onChange={handleUpdateSpvId} name="update_spv_id" id="spv_id" placeholder="spv_id" />
                                                                        <label htmlFor="spv_id">Spv ID</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <div className="form-floating">
                                                                        <input type="text" className="form-control form-control-sm" value={updateUsername} onChange={handleUpdateUsername} name="update_username" id="username" placeholder="username" />
                                                                        <label htmlFor="username">Username</label>
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
                                                            <button onClick={handleSubmitEdit} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                            <button onClick={closeFormEdit} className="btn btn-danger btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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

            </div>
        </div>
    );
}

export default Users;
