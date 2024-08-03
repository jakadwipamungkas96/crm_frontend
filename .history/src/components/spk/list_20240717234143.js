import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';
import Box from '@mui/material/Box';

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderLeft: '3px solid #000',
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

function List() {
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
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState();
    const [searchText, setSearchText] = useState("");
    const [lsDtStock, setLsDtStock] = useState([]);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const [optionsCustomer, setOptionsCustomer] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [OpenSpk, setOpenSpk] = useState(false);

    const handleSelectChangeCustomer = (e) => {
        setSelectedCustomer(e.target.value);
    };

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

    const handleRowsPerPageChange = (event) => {
        setPageSize(event.target.value);
    };

    const handlePageChange = () => {
        setPage(page+1);
    };

    const handlePageChangePrev = () => {
        setPage(page-1);
    };
    
    const columnsLsStock = [
        {
            name: 'ID',
            selector: row => <span style={{ }}>{row.id}</span>,
            sortable: true,
            width: '80px',
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

    const showModalSpk = () => {
        setOpenSpk(true);
    }

    const closeModalSpk = (event) => {
        setOpenSpk(false);
    }

    const handleSubmitSpk = (event) => {
        event.preventDefault();
    }

    const handleSearchCustomer = (event) => {
        setTimeout(() => {
            console.log(event.target.value);
        }, 300);
    }

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
                                        {/* <label>Search Customer</label> */}
                                        {/* <Select2
                                            data={optionsCustomer}
                                            defaultValue={selectedCustomer}
                                            onChange={handleSelectChangeCustomer}
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        /> */}
                                        <div className="btn-group btn-group-md" role="group" aria-label="Basic example">
                                            <button type="button" onClick={showModalSpk} className="btn btn-primary"><i className="ri ri-pencil-line"></i> Tambah SPK</button>
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
            {/* Start Add SPK  */}
            <Modal
                open={OpenSpk}
                onClose={closeModalSpk}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal}>
                    <div className='card'>
                        <div className='card-header'>
                            <h5>Input SPK Customer</h5>
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-md-12 ml-2 mb-5'>
                                    <div>
                                        <label for="basiInput" class="form-label">Search Customer</label>
                                        <input type="password" class="form-control" onChange={handleSearchCustomer} id="basiInput" />
                                    </div>
                                </div>
                                <div className='col-md-12 ml-2 mb-2'>
                                    <div class="table-responsive table-card">
                                        <table class="table table-nowrap table-striped-columns mb-0">
                                            <thead class="table-light">
                                                <tr>
                                                    <th scope="col">Single ID</th>
                                                    <th scope="col">Nama Customer</th>
                                                    <th scope="col">No. Identitas</th>   
                                                    <th scope="col">Tanggal Lahir</th>   
                                                    <th scope="col">Action</th>   
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>3303-I0001</td>
                                                    <td>William Elmore</td>
                                                    <td>3299292999292</td>
                                                    <td>12 Juli 1998</td>
                                                    <td>
                                                        <button type="button" class="btn btn-sm btn-primary">Pilih</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer'>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default List;
