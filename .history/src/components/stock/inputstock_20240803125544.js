import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog, DialogContent, Slide, TextField } from '@mui/material';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';

function Inputstock() {
    
    const [fileUpload, setFileUp] = React.useState([]);
    const [kategoriStock, setKategoriStock] = React.useState();
    const [refreshDt, setRefresh] = useState();
    const [inputsImport, setInputs] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }, []);

    // Import Excel
    const [importExcel, setimportExcel] = React.useState(false);
    const showFormImport = (event) => {
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

    const handleKategoriStock = (event) => {
        setKategoriStock(event.target.value);
        setInputs(values => ({ ...values, [event.target.name]: event.target.value }));
    }

    const handleChooseFileStocks = (event) => {
        setFileUp(event.target.files[0]);
        setInputs(values => ({ ...values, [event.target.name]: fileUpload }));
    }

    const handleUploadStock = (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('filestock', fileUpload);
        formData.append('kategori', kategoriStock);
        formData.append('tipe_stock', "FREE");
        setLoading(true);
        axios.post('http://127.0.0.1:8000/api/stock/import', formData).then(function (response) {
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
                setRefresh(new Date());
                window.location.href = "/stock/onhand"
            }
        }).catch(function (error) {
            setLoading(false);
            // setimportExcel(false);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                let errorMessage = 'Internal Server Error';
                if (error.response.status === 500) {
                    errorMessage = 'Internal Server Error';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                swal("Error", errorMessage, "error", {
                    buttons: false,
                    timer: 2000,
                });
            } else if (error.request) {
                // The request was made but no response was received
                swal("Error", "No response received from the server", "error", {
                    buttons: false,
                    timer: 2000,
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                swal("Error", error.message, "error", {
                    buttons: false,
                    timer: 2000,
                });
            }
        });
    }

    const handleSubmitStock = (event) => {
        console.log(event);
    }


    return (
        <div className="page-content">
            <div className="container-fluid">
                <CustomBlockingOverlay isLoading={loading}>
                </CustomBlockingOverlay>
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Input Stock</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">Stock</a></li>
                                    <li className="breadcrumb-item active"><a href="#">Input Stock</a></li>
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
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="card-title mb-0">Metode Input Stock</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <ul className="nav nav-tabs mb-3 text-center" role="tablist">
                                            <li className="nav-item col-md-6">
                                                <a className="nav-link active" data-bs-toggle="tab" href="#import" role="tab" aria-selected="false">
                                                    Import
                                                </a>
                                            </li>
                                            <li className="nav-item col-md-6">
                                                <a className="nav-link" data-bs-toggle="tab" href="#formInput" role="tab" aria-selected="false">
                                                    Form Input
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="tab-content text-muted">
                                            <div className="tab-pane active" id="import" role="tabpanel">
                                                <a target='_blank' href='resources/template/template_stock_do_tam.xlsx' type="button" className="btn btn-outline-success waves-effect waves-light">Download Template Excel</button>

                                                <div className="row mt-3">

                                                    <div className="col-md-6">
                                                        <label htmlFor="formFile" className="form-label">Pilih File</label>
                                                        {/* <input className="form-control" type="file" id="formFile" name="filestocks" onChange={handleChooseFileStocks} value={fileUpload} /> */}
                                                        <TextField
                                                            id="outlined-select-currency-native"
                                                            defaultValue=""
                                                            label=""
                                                            helperText="Pilih File"
                                                            onChange={handleChooseFileStocks}
                                                            sx={{ width: "100%" }}
                                                            size="small"
                                                            name="filestocks"
                                                            type="file"
                                                            required
                                                        >
                                                        </TextField><br></br>
                                                    </div>
                                                    
                                                    <div className="col-md-6">
                                                        <label htmlFor="formFile" className="form-label">Pilih Kategori Stock</label>
                                                        <select className="form-select mb-3" aria-label="Default select example" onChange={handleKategoriStock}  defaultValue="" value={kategoriStock}>
                                                            <option>-- Pilih --</option>
                                                            <option value="ON HAND">ON HAND</option>
                                                            {/* <option value="BARTER CABANG">Barter Cabang</option>
                                                            <option value="BARTER DEALER">Barter Dealer</option> */}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-12 text-end">
                                                        <button type="button" className="btn btn-sm btn-primary waves-effect waves-light" onClick={handleUploadStock}>Simpan</button>
                                                    </div>

                                                </div>


                                            </div>
                                            <div className="tab-pane" id="formInput" role="tabpanel">
                                                <div className="row mt-3">

                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="tgl">Tanggal</label>
                                                                <input type="date" className="form-control" name="tanggal" id="tanggal" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="type">Type</label>
                                                                <input type="text" className="form-control" name="type" id="type" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="frameNo">Frame No</label>
                                                                <input type="text" className="form-control" name="frameNo" id="frameNo" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="enginePrefixNo">Engine Prefix No</label>
                                                                <input type="text" className="form-control" name="enginePrefixNo" id="enginePrefixNo" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="modelCodeKatashiki">Model Code Katashiki</label>
                                                                <input type="text" className="form-control" name="modelCodeKatashiki" id="modelCodeKatashiki" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="sfx">SFX</label>
                                                                <input type="text" className="form-control" name="sfx" id="sfx" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="karoseriCode">Karoseri Code</label>
                                                                <input type="text" className="form-control" name="karoseriCode" id="karoseriCode" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="karoseriName">Karoseri Name</label>
                                                                <input type="text" className="form-control" name="karoseriName" id="karoseriName" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="colorExterior">Color Exterior</label>
                                                                <input type="text" className="form-control" name="colorExterior" id="colorExterior" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="colorInterior">Color Interior</label>
                                                                <input type="text" className="form-control" name="colorInterior" id="colorInterior" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="color">Color</label>
                                                                <input type="text" className="form-control" name="color" id="color" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="warna">Warna</label>
                                                                <input type="text" className="form-control" name="warna" id="warna" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="distributionPrice">Distribution Price</label>
                                                                <input type="number" className="form-control" name="distributionPrice" id="distributionPrice" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="salesTax">Sales Tax</label>
                                                                <input type="number" className="form-control" name="salesTax" id="salesTax" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="luxuryTax">Luxury Tax</label>
                                                                <input type="number" className="form-control" name="luxuryTax" id="luxuryTax" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="cancellDo">Cancel DO</label>
                                                                <input type="text" className="form-control" name="cancellDo" id="cancellDo" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="doNo">DO NO</label>
                                                                <input type="text" className="form-control" name="doNo" id="doNo" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="filler">Filler</label>
                                                                <input type="text" className="form-control" name="filler" id="filler" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="doDate">DO Date</label>
                                                                <input type="date" className="form-control" name="doDate" id="doDate" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="registrationLine">Registration Line</label>
                                                                <input type="text" className="form-control" name="registrationLine" id="registrationLine" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="keyNo">Key No</label>
                                                                <input type="text" className="form-control" name="keyNo" id="keyNo" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="paymentCode">Payment Code</label>
                                                                <input type="text" className="form-control" name="paymentCode" id="paymentCode" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="priceType">Price Type</label>
                                                                <input type="text" className="form-control" name="priceType" id="priceType" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="dueDate">Due Date</label>
                                                                <input type="date" className="form-control" name="dueDate" id="dueDate" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="resFlag">Res Flag</label>
                                                                <input type="text" className="form-control" name="resFlag" id="resFlag" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="daCancelNo">Da Cancel No</label>
                                                                <input type="text" className="form-control" name="daCancelNo" id="daCancelNo" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="daNo">Da No</label>
                                                                <input type="text" className="form-control" name="daNo" id="daNo" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="wmiCode">WMI Code</label>
                                                                <input type="text" className="form-control" name="wmiCode" id="wmiCode" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="zoneCode">Zone Code</label>
                                                                <input type="text" className="form-control" name="zoneCode" id="zoneCode" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="branchCode">Branch Code</label>
                                                                <input type="text" className="form-control" name="branchCode" id="branchCode" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="destinationCode">Destination Code</label>
                                                                <input type="text" className="form-control" name="destinationCode" id="destinationCode" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="doNoTent">Do No Tent</label>
                                                                <input type="text" className="form-control" name="doNoTent" id="doNoTent" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="doTentDate">Do Tent Date</label>
                                                                <input type="date" className="form-control" name="doTentDate" id="doTentDate" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="rrn">RRN</label>
                                                                <input type="text" className="form-control" name="rrn" id="rrn" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="advFlag">Adv Flag</label>
                                                                <input type="text" className="form-control" name="advFlag" id="advFlag" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="mainDealer">Main Dealer</label>
                                                                <input type="text" className="form-control" name="mainDealer" id="mainDealer" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="discountPrice">Discount Price</label>
                                                                <input type="number" className="form-control" name="discountPrice" id="discountPrice" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="intColorName">Int Color Name</label>
                                                                <input type="text" className="form-control" name="intColorName" id="intColorName" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="standardPrice">Standard Price</label>
                                                                <input type="number" className="form-control" name="standardPrice" id="standardPrice" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="reffNo">Reff No</label>
                                                                <input type="text" className="form-control" name="reffNo" id="reffNo" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="wpbt">WPBT</label>
                                                                <input type="number" className="form-control" name="wpbt" id="wpbt" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="vat">VAT</label>
                                                                <input type="number" className="form-control" name="vat" id="vat" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="wpat">WPAT</label>
                                                                <input type="number" className="form-control" name="wpat" id="wpat" required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="pph22">PPH 22</label>
                                                                <input type="number" className="form-control" name="pph22" id="pph22" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="cabang">Cabang</label>
                                                                <select type="text" className="form-control" name="cabang" id="cabang" defaultValue="" required>
                                                                    <option value="">--SELECT CABANG--</option>
                                                                    <option value="WLD">WLD</option>
                                                                    <option value="WLP">WLP</option>
                                                                    <option value="WLS">WLS</option>
                                                                    <option value="WML">WML</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="noPinjaman">No Pinjaman</label>
                                                                <input type="text" className="form-control" name="noPinjaman" id="noPinjaman" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="outstanding">Outstanding</label>
                                                                <input type="text" className="form-control" name="outstanding" id="outstanding" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="tglAkseptasi">Tanggal Akseptasi</label>
                                                                <input type="date" className="form-control" name="tglAkseptasi" id="tglAkseptasi" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="tglJatuhTempo">Tanggal Jatuh Tempo</label>
                                                                <input type="date" className="form-control" name="tglJatuhTempo" id="tglJatuhTempo" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="persenBunga">Persen Bunga</label>
                                                                <input type="text" className="form-control" name="persenBunga" id="persenBunga" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="bunga">Bunga</label>
                                                                <input type="text" className="form-control" name="bunga" id="bunga" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2">
                                                            <div className="">
                                                                <label htmlFor="pokokBunga">Pokok Bunga</label>
                                                                <input type="text" className="form-control" name="pokokBunga" id="pokokBunga" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2 mb-4">
                                                            <div className="">
                                                                <label htmlFor="selisih">Selisih</label>
                                                                <input type="text" className="form-control" name="selisih" id="selisih" />
                                                            </div>
                                                        </div>

                                                    <div className="col-md-12 text-end">
                                                        <button type="button" className="btn col-md-12 btn-sm btn-primary waves-effect waves-light" onClick={handleSubmitStock}>Simpan</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
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

export default Inputstock;
