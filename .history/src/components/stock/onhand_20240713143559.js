import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog, DialogContent, Slide, TextField } from '@mui/material';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';

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
    const [inputsImport, setInputs] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(0);
    const [totalRows, setTotalRows] = useState();
    const [searchText, setSearchText] = useState("");
    const [lsDtStock, setLsDtStock] = useState([]);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/stock/list/onhand?page=${page}&size=${pageSize}`;
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
        }
    ];

    const customStyles = {
        tableWrapper: {
          overflowX: "auto", // Memungkinkan pengguliran horizontal
          maxWidth: "100px", // Maksimal lebar tabel
          borderRadius: "10px",
        },
        rows: {
          style: {
            minHeight: "50px", // override the row height
          },
        },
        headRow: {
          style: {
            background: "linear-gradient(to right, #141e30, #243b55)", // Warna latar belakang untuk thead
            color: "white", // Warna teks untuk thead
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
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Overview Stock</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">Stock</a></li>
                                    <li className="breadcrumb-item active"><a href="#">Stock Hari Ini</a></li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-2 overflow-hidden">
                                        <select className='form form-control'>
                                            <option value="">-- Pilih Model --</option>
                                        </select>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <select className='form form-control'>
                                            <option value="">-- Pilih Model --</option>
                                        </select>
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
                                            <DataTable
                                                columns={columnsLsStock}
                                                data={displayData}
                                                key={pageSize}
                                                customStyles={customStyles}
                                                defaultSortFieldId={1}
                                                onSearch={handleSearch}
                                                pagination
                                            />
                                            {/* <nav className="sc-iJuWdM cxFtRn rdt_Pagination">
                                            <span className="sc-bYEuID sc-iktFSN kWntUk hgMgsX">
                                                Rows per page:
                                            </span>
                                            <div className="sc-lmoLKH lcunyj">
                                                <select
                                                aria-label="Rows per page:"
                                                className="sc-cxFKTC kPRdhe"
                                                value={page}
                                                onChange={handleRowsPerPageChange}
                                                >
                                                <option value="10" selected="">
                                                    10
                                                </option>
                                                <option value="20">20</option>
                                                <option value="30">30</option>
                                                </select>
                                                <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                >
                                                <path d="M7 10l5 5 5-5z"></path>
                                                <path d="M0 0h24v24H0z" fill="none"></path>
                                                </svg>
                                            </div>
                                            <span className="sc-bYEuID sc-kLgoAE kWntUk hLjof">
                                                {page}-{page*10} of {totalRows}
                                            </span>
                                            <div className="sc-ezrdqu gODfSl">
                                                <button
                                                id="pagination-previous-page"
                                                type="button"
                                                aria-label="Previous Page"
                                                aria-disabled="true"
                                                disabled=""
                                                className="sc-giInvV MLcXO"
                                                onClick={handlePageChangePrev}
                                                >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                    role="presentation"
                                                >
                                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                                </svg>
                                                </button>
                                                <button
                                                    id="pagination-next-page"
                                                    type="button"
                                                    aria-label="Next Page"
                                                    aria-disabled="true"
                                                    disabled=""
                                                    className="sc-giInvV MLcXO"
                                                    onClick={handlePageChange}
                                                >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                    role="presentation"
                                                >
                                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                                </svg>
                                                </button>
                                            </div>
                                            </nav> */}
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
