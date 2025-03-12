import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import 'react-select2-wrapper/css/select2.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import swal from 'sweetalert';
import Select2 from 'react-select2-wrapper';
import zIndex from '@mui/material/styles/zIndex';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: 'auto'
};

function List() {
    // Format tanggal dengan format "DD/MM/YYYY"
    const [refreshDt, setRefresh] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState();
    const [searchText, setSearchText] = useState("");
    const [lsDtStock, setLsDtStock] = useState([]);
    const [optNoSpk, setOptionNoSpk] = useState([]);
    const [selectedNoSpk, setSelectedNoSpk] = useState();
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const [openPengajuanCancel, setOpenPengajuanCancel] = useState(false);
    const [openEditSpk, setOpenEditSpk] = useState(false);
    const [detailSpk, setDetailSpk] = useState([]);
    const [arrPengajuan, setArrPengajuan] = useState({
        no_spk: "",
        reason_cancel: ""

    });
    const [arrEditSpk, setArrEditSpk] = useState({
        no_spk: "",
        status: ""
    });
    const [nomorSpk, setNomorSpk] = useState("");
    const [showbtn, setShowBtn] = useState(true);

    const getNoSpk = async () => {
        const url = `http://127.0.0.1:8000/api/spk/option/no_spk`;
        try {

            const response = await axios.get(url);            
            setOptionNoSpk(response.data.lsnospk);

        } catch (error) {
            // console.log(error);
        }
    }

    const handleChangeNoSpk = (event) => {
        setSelectedNoSpk(event.target.value);
    }

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/spk/list?page=${page}&size=${pageSize}`;
            try {

                const response = await axios.get(url);
                setLsDtStock(response.data.data);
                setTotalRows(response.data.allOnhand);
                setLoadingTable(false);

            } catch (error) {
                // console.log(error);
            }
        };
        getData();
        getNoSpk();
    }, [page, pageSize, refreshDt]);

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
                            zIndex: 5000,
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

    const handleRowsPerPageChange = (event) => {
        setPageSize(event.target.value);
    };

    const handlePageChange = () => {
        setPage(page+1);
    };

    const handlePageChangePrev = () => {
        setPage(page-1);
    };
    
    const showApprove = (id) => {
        console.log(id);
        
    }

    const handleEditSpk = (row) => {
        setOpenEditSpk(true);
        setDetailSpk(row);
        setArrEditSpk((prevInput) => ({
            ...prevInput,
            ["no_spk"]: row.no_spk,
            ["no_rangka"]: row.no_rangka
        }));
    }
    
    const columnsLsStock = [
        {
            name: 'ID',
            selector: row => <span style={{ }}>{row.id}</span>,
            sortable: true,
            width: '80px',
        },
        {
            name: 'Aksi',
            selector: row => {
                return <>
                        <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                            <button type="button" onClick={() => handleEditSpk(row)} className="btn btn-info btn-sm"><i className="ri ri-pencil-line"></i> Edit</button>
                        </div>
                    </>
            },
            sortable: true,
            width: '100px',
        },
        {
            name: 'Matching Status',
            selector: row => {
                if (row.matching_status === 'waiting') {
                    return <><span className="sticky-column badge badge-label bg-light text-body"><i className="mdi mdi-circle-medium"></i> Waiting</span></>
                } else if (row.matching_status === 'match') {
                    return <><span className="sticky-column badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> Match</span></>
                } else if (row.matching_status === 'unmatch') {
                    return <><span className="sticky-column badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> Not Match</span></>
                } 
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'Status SPK',
            selector: row => {
                if (row.status === 'waiting') {
                    return <><span className="sticky-column badge badge-label bg-light text-body"><i className="mdi mdi-circle-medium"></i> Waiting</span></>
                } else if (row.status === 'approve') {
                    return <><span className="sticky-column badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> Approve</span></>
                } else if (row.status === 'cancel') {
                    return <><span className="sticky-column badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> Cancel</span></>
                }
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'Active/Inactive SPK',
            selector: row => {
                if (row.is_active === 1) {
                    return <><span className="sticky-column badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> Active</span></>
                } else {
                    return <><span className="sticky-column badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> Inactive</span></>
                }
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'DO INTERNAL',
            selector: row => {
                if (row.do_internal_status === 'waiting') {
                    return <><span className="sticky-column badge badge-label bg-light text-body"><i className="mdi mdi-circle-medium"></i> Waiting</span></>
                } else if (row.do_internal_status === 'approve') {
                    return <><span className="sticky-column badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> Approve</span></>
                } else if (row.do_internal_status === 'reject') {
                    return <><span className="sticky-column badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> Reject</span></>
                } 
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'DO FISIK',
            selector: row => {
                if (row.do_fisik_status === 'waiting') {
                    return <><span className="sticky-column badge badge-label bg-light text-body"><i className="mdi mdi-circle-medium"></i> Waiting</span></>
                } else if (row.do_fisik_status === 'approve') {
                    return <><span className="sticky-column badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> Approve</span></>
                } else if (row.do_fisik_status === 'reject') {
                    return <><span className="sticky-column badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> Reject</span></>
                } 
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'Status AFI',
            selector: row => {
                if (row.afi_status === 'waiting') {
                    return <><span className="sticky-column badge badge-label bg-light text-body"><i className="mdi mdi-circle-medium"></i> Waiting</span></>
                } else if (row.afi_status === 'approve') {
                    return <><span className="sticky-column badge badge-label bg-success"><i className="mdi mdi-circle-medium"></i> Approve</span></>
                } else if (row.afi_status === 'reject') {
                    return <><span className="sticky-column badge badge-label bg-danger"><i className="mdi mdi-circle-medium"></i> Reject</span></>
                } 
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'NO SPK',
            selector: row => <span style={{ }}>{row.no_spk}</span>,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Tanggal SPK',
            selector: row => <span style={{ }}>{row.tgl_spk}</span>,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Nama Customer',
            selector: row => <><span style={{ }}>{row.nama_customer}</span><br/><span>{row.single_id}</span></>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Model',
            selector: row => <span style={{ }}>{row.model}</span>,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Warna',
            selector: row => <span style={{ }}>{row.warna}</span>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'No Rangka',
            selector: row => <span style={{ }}>{row.no_rangka}</span>,
            sortable: true,
            width: '200px',
        }
    ];

    const customStyles = {
        tableWrapper: {
          overflowX: "auto", // Memungkinkan pengguliran horizontal
          maxWidth: "100px", // Maksimal lebar tabel
          borderRadius: "10px",
        },
        headRow: {
          style: {
            background: "#334155", // Warna latar belakang untuk thead
            color: "white", // Warna teks untuk thead
            borderRadius: "5px"
          },
        },
    };

    // Logika pencarian, memfilter data berdasarkan beberapa kolom
    const filteredData = lsDtStock.filter((item) =>
        Object.values(item).some(
        (value) =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const displayData = searchText ? filteredData : lsDtStock; // Jika searchText kosong, tampilkan semua data
    // END List Data Customer

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const showModalSpk = () => {
        window.location.href="/spk/inputspk";
    }
    const showEditSpk = () => {
        window.location.href="/spk/editspk";
    }

    const showModalCancel = () => {
        setOpenPengajuanCancel(true);
    }

    const handleClosePengajuan = () => {
        setOpenPengajuanCancel(false);
        setNomorSpk("");
    }

    const handleCloseEditSpk = () => {
        setOpenEditSpk(false);
    }

    const handleIsActiveSpk = (event) => {
        setArrEditSpk((prevInput) => ({
            ...prevInput,
            [event.target.name]: event.target.value
        }));
    }

    const handleInputPengajuan = (event) => {
        const { name, value } = event.target;
        setArrPengajuan((prevInput) => ({
            ...prevInput,
            [name]: value
        }));
    }

    const handleSearchSpk = async (event) => {
        
        setNomorSpk(event.target.value);
        setArrPengajuan((prevInput) => ({
            ...prevInput,
            [event.target.name]: event.target.value
        }));

        var arrNoSpk = {
            no_spk: event.target.value
        };

        try {

            const response = await axios.post(`http://127.0.0.1:8000/api/spk/findspk`, arrNoSpk);
            
            if (response.data.total > 0) {
                setShowBtn(false);
            }

        } catch (error) {
            // console.log(error);
        }
    }

    const handleSubmitPengajuanCancel = async () => {
        setLoading(true);
        if (arrPengajuan.reason_cancel == "") {
            setLoading(false);
            swal("Error", 'Reason cancel tidak boleh kosong', "error", {
                buttons: false,
                timer: 2000,
            });
        } else {
            try {

                const response = await axios.post(`http://127.0.0.1:8000/api/spk/pengajuan/cancel`, arrPengajuan);

                if (response.data.status == "success") {
                    setLoading(false);

                    swal("Success", response.data.msg, "success", {
                        buttons: false,
                        timer: 2000,
                    });
    
                    window.location.href = "/spk/list";
    
                } else {
                    setLoading(false);

                    swal("Error", response.data.msg, "error", {
                        buttons: false,
                        timer: 2000,
                    }); 
                    window.location.href = "/spk/list";
                }
    
            } catch (error) {
                // console.log(error);
            }
        }
    }
    const handleSubmitEditSpk = async () => {
        console.log(arrEditSpk);
        
    }

    const rulesName = JSON.parse(localStorage.getItem("rules"));
    
    return (
        <div className="page-content">
            <div className="container-fluid">
                <CustomBlockingOverlay isLoading={loading}>
                </CustomBlockingOverlay>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="btn-group btn-group-md" role="group" aria-label="Basic example">
                                            {rulesName == "spv" ? 
                                                <>
                                                    <button type="button" onClick={showModalSpk} className="btn btn-primary btn-sm"><i className="ri ri-pencil-line"></i> Tambah SPK</button>
                                                    <button type="button" onClick={showModalCancel} className="btn btn-danger btn-sm"><i className="ri ri-file-edit-fill"></i> Pengajuan Cancel SPK</button>
                                                </>
                                                : 

                                                <>
                                                    <h5>Monitoring SPK</h5>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="row">
                                    <div className="col-md-12">
                                    {loadingTable ? (
                                        <div className="text-center ">
                                            <i className="mdi mdi-spin mdi-loading" style={{ fontSize: "30px", color: "#991B1B" }}></i> <h6 className="m-0 loading-text">Please wait...</h6>
                                        </div>
                                    ) : (

                                        <>
                                            <div className="row mt-2">
                                                <div className="col-12">
                                                    <button type="button" onClick={showModalCancel} className={`btn btn-warning btn-sm ${rulesName == 'stock' ? '' : 'd-none'}`}><i className="ri ri-file-edit-fill"></i> Pengajuan Cancel SPK</button>
                                                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                                        <h4 className="mb-sm-0">List SPK</h4>

                                                        <div className="page-title-right">
                                                            <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                                                <div className="btn-group btn-group-md" role="group" aria-label="Basic example">
                                                                    <button type="button" className="btn btn-light btn-md">Total Data</button>
                                                                    <button type="button" className="btn btn-light btn-md">{totalRows}</button>
                                                                </div>&nbsp;
                                                                <div className="btn-group me-2" role="group" aria-label="First group">
                                                                    <select
                                                                        aria-label="Rows per page:"
                                                                        className="form-select"
                                                                        defaultValue={pageSize}
                                                                        onChange={handleRowsPerPageChange}
                                                                    >
                                                                        <option value="10">10</option>
                                                                        <option value="20">20</option>
                                                                        <option value="30">30</option>
                                                                    </select>&nbsp;
                                                                    <button type="button" onClick={handlePageChangePrev} className="btn btn-light btn-md"><i className="ri-arrow-left-s-line"></i></button>
                                                                    <button type="button" onClick={handlePageChange} className="btn btn-light btn-md"><i className="ri-arrow-right-s-line"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <DataTable
                                                columns={columnsLsStock}
                                                data={displayData}
                                                key={pageSize}
                                                striped
                                                customStyles={customStyles}
                                                defaultSortFieldId={0}
                                            />
                                        </>

                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openPengajuanCancel}
                onClose={handleClosePengajuan}
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
                id="modalPengajuanCancel"
            >
                <Fade in={openPengajuanCancel}>
                    <Box sx={style}>
                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-6">
                                <h5>Pengajuan Cancel</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 text-end">
                                <button type="button" onClick={handleClosePengajuan} className="btn btn-light btn-sm"><i className="ri-close-line"></i></button>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="row mb-2">
                                <div className="col-lg-6 col-md-6">
                                    <select className="form-control" name="no_spk" onChange={handleSearchSpk} value={nomorSpk}>
                                        <option value={""}>-- Pilih NO SPK --</option>
                                        {optNoSpk.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div className="col-lg-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" name="no_spk" onChange={handleSearchSpk} value={nomorSpk} id="no_spk" />
                                        <label htmlFor="no_spk">Masukan Nomor SPK</label>
                                    </div>
                                </div> */}
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" name="reason_cancel" onChange={handleInputPengajuan} id="reason_cancel" />
                                        <label htmlFor="reason_cancel">Masukan Reason Cancel</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-12 col-md-12 text-end">
                                <div className="btn-group btn-group-md" role="group" aria-label="Basic example">
                                    <button type="button" onClick={handleClosePengajuan} className="btn btn-light btn-sm"><i className="ri-close-line"></i> Cancel</button>
                                    <button type="button" onClick={handleSubmitPengajuanCancel} className="btn btn-success btn-sm" disabled={showbtn}><i className="ri ri-check-double-fill"></i> Kirim Pengajuan</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>

            {/* Edit SPK  */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openEditSpk}
                onClose={handleCloseEditSpk}
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
                id="modalPengajuanCancel"
            >
                <Fade in={openEditSpk}>
                    <Box sx={style}>
                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-6">
                                <h5>Edit SPK <strong>{detailSpk.no_spk}</strong></h5>
                            </div>
                            <div className="col-lg-6 col-md-6 text-end">
                                <button type="button" onClick={handleCloseEditSpk} className="btn btn-light btn-sm"><i className="ri-close-line"></i></button>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="row mb-2">
                                <div className="col-lg-6 col-md-6">
                                    <select className="form-control" name="is_active" value={detailSpk.is_active} onChange={handleIsActiveSpk}>
                                        <option value={""}>-- Pilih Status --</option>
                                            <option value={1}>{"active"}</option>
                                            <option value={0}>{"inactive"}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-12 col-md-12 text-end">
                                <div className="btn-group btn-group-md" role="group" aria-label="Basic example">
                                    <button type="button" onClick={handleCloseEditSpk} className="btn btn-light btn-sm"><i className="ri-close-line"></i> Cancel</button>
                                    <button type="button" onClick={handleSubmitEditSpk} className="btn btn-success btn-sm"><i className="ri ri-check-double-fill"></i> Save</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default List;
