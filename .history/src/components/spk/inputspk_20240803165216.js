import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog, DialogContent, Slide, TextField } from '@mui/material';
import swal from 'sweetalert';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

function Inputspk() {
    
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedModelWarna, setSelectedModelWarna] = useState("");
    const [selectedModelRangka, setSelectedModelRangka] = useState("");
    const [optionsModel, setOptionsModel] = useState([]);
    const [optionsModelWarna, setOptionsWarna] = useState([]);
    const [optionsModelRangka, setOptionsRangka] = useState([]);
    const [arrInput, setArrInput] = useState({
        single_id: "",
        nama_customer: "",
        no_spk: "",
        tgl_spk: "",
        nama_stnk: "",
        no_telp: "",
        modelkendaraan: "",
        no_rangka: "",
        warnakendaraan: ""
    });

    const [filterSingleId, setFilterSingleId] = useState("");

    const handleChangeInput = (event) => {
        const { name, value } = event.target;
        setArrInput((prevInput) => ({
            ...prevInput,
            [name]: value
        }));
    };

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        getOption();
    }, []);
    

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

    const handleSubmitSpk = async (event) => {
        console.log(arrInput);
        const url = `http://127.0.0.1:8000/api/spk/create`;
        
        try {

            const response = await axios.post(url, arrInput);

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

    const cancelInputSpk = (event) => {
        console.log(event);
    }


    const handleSelectChangeModel = (e) => {
        setSelectedModel(e.target.value);
        setArrInput((prevInput) => ({
            ...prevInput,
            [e.target.name]: e.target.value
        }));
        
        if (e.target.value != "") {
            getNoRangka(e.target.value);
        }
        
    };

    const handleSelectWarna = (e) => {
        setArrInput((prevInput) => ({
            ...prevInput,
            [e.target.name]: e.target.value
        }));
        setSelectedModelWarna(e.target.value);        
    };

    const handleSelectRangka = (e) => {
        setArrInput((prevInput) => ({
            ...prevInput,
            [e.target.name]: e.target.value
        }));
        setSelectedModelRangka(e.target.value);   
        if (e.target.value != "") {
            getWarnaKendaraan(e.target.value); 
        }
    };

    const getWarnaKendaraan = async (norangka) => {
        const url = `http://127.0.0.1:8000/api/stock/warna?car=${selectedModel}&no_rangka=${norangka}`;
        try {

            const response = await axios.get(url);
            setOptionsWarna(response.data.data);
            setOptionsWarna(response.data.data);

        } catch (error) {
            // console.log(error);
        }
    }

    const getNoRangka = async (modelcar) => {
        const url = `http://127.0.0.1:8000/api/stock/norangka?car=${modelcar}`;
        try {

            const response = await axios.get(url);
            setOptionsRangka(response.data.data);

        } catch (error) {
            // console.log(error);
        }
    }

    const getOption = async () => {
        const url = `http://127.0.0.1:8000/api/stock/option`;
        try {

            const response = await axios.get(url);
            setOptionsModel(response.data.data);

        } catch (error) {
            // console.log(error);
        }
    };


    function handleChangeSingleId(event) {
        setFilterSingleId(event.target.value);
    }

    function handleTerapkan() {
        console.log(filterSingleId);        
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
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="card-title mb-0">Input SPK</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            onChange={handleChangeSingleId}
                                            value={filterSingleId}
                                            id="singleId"
                                            name="single_id"
                                            placeholder="Cari Customer"
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <button
                                            onClick={handleTerapkan}
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                        >
                                            <i className=" ri-user-search-line"></i> Go
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="nama_customer" id="nama_customer" placeholder="" required />
                                            <label htmlFor="nama_customer">Nama Customer</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="no_spk" id="no_spk" placeholder="" required />
                                            <label htmlFor="no_spk">Nomor SPK</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="date" className="form-control form-control-sm" onChange={handleChangeInput} name="tgl_spk" id="tgl_spk" placeholder="" required />
                                            <label htmlFor="tgl_spk">Tanggal SPK</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="nama_stnk" id="nama_stnk" placeholder="" required />
                                            <label htmlFor="nama_stnk">Nama STNK</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="number" className="form-control form-control-sm" onChange={handleChangeInput} name="no_telp" id="no_telp" placeholder="" required />
                                            <label htmlFor="no_telp">Nomor Telepon</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Pilih Model Kendaraan</label>
                                        <Select2
                                            data={optionsModel}
                                            defaultValue={selectedModel}
                                            onChange={handleSelectChangeModel}
                                            name="modelkendaraan"
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Pilih No Rangka Kendaraan</label>
                                        <Select2
                                            data={optionsModelRangka}
                                            defaultValue={selectedModelRangka}
                                            onChange={handleSelectRangka}
                                            name="no_rangka"
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Pilih Warna Kendaraan</label>
                                        <Select2
                                            data={optionsModelWarna}
                                            defaultValue={selectedModelWarna}
                                            onChange={handleSelectWarna}
                                            name="warnakendaraan"
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-12 text-end mb-2">
                                        <div className="btn-group btn-group-md" role="group" aria-label="Basic example">
                                            <button type="button" onClick={cancelInputSpk} className="btn btn-secondary btn-sm"><i className="ri ri-pencil-line"></i> Cancel</button>
                                            <button type="button" onClick={handleSubmitSpk} className="btn btn-success btn-sm"><i className="ri ri-pencil-line"></i> Simpan</button>
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

export default Inputspk;
