import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios, { CanceledError } from 'axios';
import { Dialog, DialogContent, Slide, TextField } from '@mui/material';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: 'auto'
};

function Onhand() {
    // Format tanggal dengan format "DD/MM/YYYY"
    const [refreshDt, setRefresh] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState();
    const [searchText, setSearchText] = useState("");
    const [lsDtStock, setLsDtStock] = useState([]);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);

    const [selectedModel, setSelectedModel] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [optionsModel, setOptionsModel] = useState([]);
    const [optionsStatus, setoptionsStatus] = useState([]);
    const [openDelete, setOpenDelete] = React.useState(false);
    
    const [openEdit, setOpenEdit] = useState(false);
    const [arrEdit, setArrEdit] = useState([]);
    
    const [idstock, setIdStock] = useState("");
    const [modelstock, setModelStock] = useState("");

    const [arrUpdate, setArrUpdate] = useState({
        id: 0,
        model: ""
    });

    const handleChangeUpdate = (event) => {
        const { name, value } = event.target;
        setArrUpdate((prevInput) => ({
            ...prevInput,
            [name]: value
        }));
    };
    
    const handleSelectChangeModel = (e) => {
        setSelectedModel(e.target.value);
    };

    const handleSelectChangeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

    const getOption = async () => {
        const url = `http://127.0.0.1:8000/api/stock/option`;
        try {

            const response = await axios.get(url);
            setOptionsModel(response.data.data);
            setoptionsStatus(response.data.status);

        } catch (error) {
            // console.log(error);
        }
    };

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/stock/list/onhand?page=${page}&size=${pageSize}&model=${selectedModel}&status=${selectedStatus}`;
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
        getOption();
    }, [page, pageSize, selectedModel, selectedStatus, refreshDt]);

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

    const handleOpenFormFu = (event) => {
        console.log(event);
    }

    const handleRowsPerPageChange = (event) => {
        setPageSize(event.target.value);
    };

    const handlePageChange = () => {
        setPage(page+1);
    };

    const handlePageChangePrev = () => {
        setPage(page-1);
    };

    const handleDelete = (id, model) => {
        setIdStock(id);
        setModelStock(model);
        setOpenDelete(true)
        
    }

    const handleClose = () => setOpenDelete(false);

    const handleDeleteCar = async () => {

        const url = `http://127.0.0.1:8000/api/stock/delete?id=${idstock}`;
        try {

            const response = await axios.get(url);
            if (response.data.status == "success") {
                swal("Success", `Data Berhasil ${modelstock} dihapus!`, "success", {
                    buttons: false,
                    timer: 2000,
                });

                window.location.href = "/stock/masterdata";

            } else {
                swal("Error", 'Failed deleted', "error", {
                    buttons: false,
                    timer: 2000,
                }); 
                window.location.href = "/stock/masterdata";
            }

        } catch (error) {
            // console.log(error);
        }
    }

    const handleEdit = (data) => {
        setOpenEdit(true);
        setArrEdit(data);
        setArrUpdate((prevInput) => ({
            ...prevInput,
            ["id"]: data.id,
            ["model"]: data.model
        }));
        
    }  

    const cancelEdit = () => {
        setOpenEdit(false);
    }

    const handleSubmitEdit = async () => {
        const url = `http://127.0.0.1:8000/api/stock/update`;
        try {

            const response = await axios.post(url, arrUpdate);
            if (response.data.status == "success") {
                swal("Success", `Data Berhasil Update!`, "success", {
                    buttons: false,
                    timer: 2000,
                });

                window.location.href = "/stock/masterdata";

            } else {
                swal("Error", 'Failed update', "error", {
                    buttons: false,
                    timer: 2000,
                }); 
                window.location.href = "/stock/masterdata";
            }

        } catch (error) {
            // console.log(error);
        }
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
                            <button type="button" onClick={() => {handleEdit(row)}} className="btn btn-info"><i className="ri ri-pencil-line"></i> Edit</button>
                            <button type="button" onClick={() => {handleDelete(row.id, row.model)}} className="btn btn-danger"><i className="ri ri-delete-bin-line"> </i>Delete</button>
                        </div>
                    </>
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status',
            selector: row => <span style={{ }}>{row.tipe_stock}</span>,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Cabang',
            selector: row => <span style={{ }}>{row.cabang}</span>,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Model',
            selector: row => <span style={{ }}>{row.model}</span>,
            sortable: true,
            width: '300px',
        },
        {
            name: 'No Rangka',
            selector: row => <span style={{ }}>{row.no_rangka}</span>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'No Mesin',
            selector: row => <span style={{ }}>{row.no_mesin}</span>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Warna',
            selector: row => <span style={{ }}>{row.warna}</span>,
            sortable: true,
            width: '200px',
        },
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
                                    <div className="col-md-3">
                                        <label>Pilih Model</label>
                                        <Select2
                                            data={optionsModel}
                                            defaultValue={selectedModel}
                                            onChange={handleSelectChangeModel}
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label>Pilih Status</label>
                                        <Select2
                                            data={optionsStatus}
                                            defaultValue={selectedStatus}
                                            onChange={handleSelectChangeStatus}
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        />
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
                                                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                                        <h4 className="mb-sm-0">Master Data Stock</h4>

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
                open={openDelete}
                onClose={handleClose}
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={openDelete}>
                    <Box sx={style}>
                        <i style={{fontSize: "56px", color: "red"}} className='ri-error-warning-fill'></i>
                        <h4>Apakah anda yakin akan menghapus stock kendaraan <b>{modelstock}</b> ini ?</h4><br/>
                        <small className='text-danger'>Data yang sudah terhapus tidak akan bisa dikembalikan !</small>
                        <div className="btn-group btn-group-md mt-5" role="group" aria-label="Basic example">
                            <button type="button" onClick={handleClose} className="btn btn-light btn-sm"><i className="ri ri-close-line"></i> Cancel</button>
                            <button type="button" onClick={handleDeleteCar} className="btn btn-danger btn-sm"><i className="ri ri-check-line"></i> Delete</button>
                        </div>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openEdit}
                onClose={cancelEdit}
                closeAfterTransition
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={openEdit}>
                    <Box sx={style}>
                        <div className="row mb-3">
                            <div className="col-lg-12 col-md-12">
                                <h5>Edit Stock</h5>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-lg-6 col-md-6">
                                <div class="form-floating">
                                    <input type="text" className="form-control" name="model" onChange={handleChangeUpdate} defaultValue={arrEdit.model} id="model" placeholder="Enter your firstname" />
                                    <label htmlFor="model">Model</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 text-end col-md-12">
                                <div className="btn-group btn-group-md" role="group" aria-label="Basic example">
                                    <button type="button" onClick={cancelEdit} className="btn btn-light btn-sm"><i className="ri ri-pencil-line"></i> Cancel</button>
                                    <button type="button" onClick={handleSubmitEdit} className="btn btn-success btn-sm"><i className="ri ri-pencil-line"></i> Simpan</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
        
    );
}

export default Onhand;
