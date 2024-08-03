import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog, DialogContent, Slide, TextField } from '@mui/material';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

function Onhand() {
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

    const [selectedModel, setSelectedModel] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [optionsModel, setOptionsModel] = useState([]);
  
    const handleSelectChangeModel = (e) => {
        setSelectedModel(e.target.value);
    };

    const handleSelectChangeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

    // const optionsModel = [
    //     { id: 1, text: 'Option 1' },
    //     { id: 2, text: 'Option 2' },
    //     { id: 3, text: 'Option 3' },
    // ];

    const optionsStatus = [
        { id: 1, text: 'FREE' },
        { id: 2, text: 'BOOKING' },
        { id: 3, text: 'BARTER' },
    ];

    // useEffect(() => {
        const getOption = async () => {
            const url = `http://127.0.0.1:8000/api/stock/option`;
            try {

                const response = await axios.get(url);
                setOptionsModel(response.data.data);

            } catch (error) {
                // console.log(error);
            }
        };
        // getOption();
    // }, []);

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/stock/list/onhand?page=${page}&size=${pageSize}&model=${selectedModel}`;
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
    }, [page, pageSize, selectedModel, refreshDt]);

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
                            <button type="button" className="btn btn-info"><i className="ri ri-pencil-line"></i> Edit</button>
                            <button type="button" className="btn btn-danger"><i className="ri ri-delete-bin-line"> </i>Delete</button>
                        </div>
                    </>
            },
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
                                                                        defaultValue={""}
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
        </div>
    );
}

export default Onhand;
