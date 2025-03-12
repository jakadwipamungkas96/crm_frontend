import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog, DialogContent, Slide, TextField } from '@mui/material';
import swal from 'sweetalert';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Inputspk() {
    
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const cabang = localStorage.getItem("cabang");
    const spvid = JSON.parse(localStorage.getItem("spvid"));
    console.log(spvid);
    
    const personName = JSON.parse(localStorage.getItem("person"));
    
    const [loading, setLoading] = useState(false);
    const [modalCustomer, setModalCustomer] = useState(false);
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedModelWarna, setSelectedModelWarna] = useState("");
    const [selectedModelRangka, setSelectedModelRangka] = useState("");
    const [selectedSales, setSelectedSales] = useState("");
    const [optionsModel, setOptionsModel] = useState([]);
    const [optionsModelWarna, setOptionsWarna] = useState([]);
    const [optionsModelRangka, setOptionsRangka] = useState([]);
    const [optionsSales, setOptionsSales] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [arrInput, setArrInput] = useState({
        single_id: "",
        outlet_name: cabang,
        no_spk: "",
        customer_name: "",
        model: "",
        type_model: "",
        katashiki_suffix: "",
        katashiki: "",
        suffix: "",
        color: "",
        color_code: "",
        tanggal_spk: "",
        pekerjaan_customer: "",
        demand_structure: "",
        trade_in: "",
        financial_type: "",
        jenis_leasing: "",
        tanggal_aplikasi_masuk_ke_leasing: "",
        dp_rate: "",
        booking_fee: "",
        no_telp: "",
        sales_id: "",
        spv_id: spvid,
    });

    const [filterSingleId, setFilterSingleId] = useState("");

    function closeModal() {
        setModalCustomer(false);
    }

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
        setLoading(true);
        console.log(arrInput);
        
        const url = `http://127.0.0.1:8000/api/spk/create`;
        
        try {

            const response = await axios.post(url, arrInput);

            if (response.data.status == "success") {
                swal("Success", `Data Berhasil Update!`, "success", {
                    buttons: false,
                    timer: 2000,
                });
                setLoading(false);
                window.location.href = "/spk/list";

            } else {
                setLoading(false);
                swal("Error", response.data.msg, "error", {
                    buttons: false,
                    timer: 2000,
                }); 
                // window.location.href = "/spk/list";
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

    const handleChangeSales = (e) => {
        setArrInput((prevInput) => ({
            ...prevInput,
            [e.target.name]: e.target.value
        }));
        setSelectedSales(e.target.value);        
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
            
            var detail = response.data.detail;
            setArrInput(prevState => ({
                ...prevState, // mempertahankan nilai field lain yang ada
                katashiki_suffix: detail.katsuf,
                suffix: detail.sfx
            }));

        } catch (error) {
            // console.log(error);
        }
    }

    const getOption = async () => {
        const url = `http://127.0.0.1:8000/api/stock/option`;
        try {

            const response = await axios.get(url);
            setOptionsModel(response.data.data);
            setOptionsSales(response.data.sales);

        } catch (error) {
            // console.log(error);
        }
    };


    function handleChangeSingleId(event) {
        setFilterSingleId(event.target.value);
    }

    const [filterInPopUp, setfilterInPopUp] = useState('');

    const handleChangeSearchInPopUp = (event) => {
        setfilterInPopUp(event.target.value);
        console.log(event.target.value);
        
    };

    const fetchCustomers = async (query) => {
        const url = `http://127.0.0.1:8000/api/spk/search?q=${query}`;
        try {
            const response = await axios.post(url); // Tunggu hasil dari axios
            const data = response.data.data;
            setListCustomer(data); // Perbarui state dengan data yang diterima
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (filterInPopUp) {
                fetchCustomers(filterInPopUp); // Hanya fetch data jika input tidak kosong
            }
        }, 500); // Menunda 500ms setelah mengetik
    
        return () => clearTimeout(delayDebounceFn); // Bersihkan timeout jika pengguna terus mengetik
    }, [filterInPopUp]);

    async function handleTerapkan() {
        setLoading(true);
        const url = `http://127.0.0.1:8000/api/spk/search?q=${filterSingleId}`;
        try {

            const response = await axios.post(url);
            setLoading(false);
            const data     = response.data.data;
            setListCustomer(data);
            setModalCustomer(true);

        } catch (error) {
            // console.log(error);
        }      
    }

    function handleChooseCustomer(single_id, nama_customer, no_telepon, sales_id) {        
        setArrInput(prevState => ({
            ...prevState, // mempertahankan nilai field lain yang ada
            single_id: single_id,
            nama_customer: nama_customer,
            no_telp: no_telepon,
            sales_id: sales_id
        }));
        setModalCustomer(false);
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
                                            <input type="text" className="form-control form-control-sm" readOnly onChange={handleChangeInput} value={cabang} name="outlet_name" id="outlet_name" placeholder="" required />
                                            <label htmlFor="outlet_name">Outlet Name</label>
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
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} value={arrInput.nama_customer} name="nama_customer" id="nama_customer" placeholder="" required />
                                            <label htmlFor="nama_customer">Nama Customer</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="number" className="form-control form-control-sm" readOnly onChange={handleChangeInput} value={arrInput.no_telp} name="no_telp" id="no_telp" placeholder="" required />
                                            <label htmlFor="no_telp">Nomor Telepon</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Pilih Sales</label>
                                        <Select2
                                            data={optionsSales}
                                            defaultValue={selectedSales}
                                            onChange={handleChangeSales}
                                            name="id_sales"
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} value={personName} readOnly name="spv_id" id="spv_id" placeholder="" required />
                                            <label htmlFor="spv_id">SPV</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2 d-none">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} value={spvid} readOnly name="spv_id" id="spv_id" placeholder="" required />
                                            <label htmlFor="spv_id">SPV</label>
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
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} value={arrInput.katashiki_suffix} name="katashiki_suffix" id="katashiki_suffix" placeholder="" required />
                                            <label htmlFor="katashiki_suffix">katashiki suffix</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Katashiki</label>
                                        <Select2
                                            data={optionsModelRangka}
                                            defaultValue={selectedModelRangka}
                                            onChange={handleSelectRangka}
                                            name="katashiki"
                                            options={{
                                                placeholder: 'All',
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} value={arrInput.suffix} name="suffix" id="suffix" placeholder="" required />
                                            <label htmlFor="suffix">suffix</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Color</label>
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
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="color_code" id="color_code" placeholder="" required />
                                            <label htmlFor="color_code">color code</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="date" className="form-control form-control-sm" onChange={handleChangeInput} name="tanggal_spk" id="tanggal_spk" placeholder="" required />
                                            <label htmlFor="tanggal_spk">Tanggal SPK</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="pekerjaan_customer" id="pekerjaan_customer" placeholder="" required />
                                            <label htmlFor="pekerjaan_customer">Pekerjaan Customer</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        {/* <div className="form-floating"> */}
                                            <label htmlFor="demand_structure">Demand Structure</label>
                                            <select type="text" className="form-control" name="demand_structure" onChange={handleChangeInput} id="demand_structure" defaultValue="" required>
                                                <option value="">--Pilih--</option>
                                                <option value="first_buyer">{"First Buyer"}</option>
                                                <option value="additional">{"Additional"}</option>
                                                <option value="trade_in">{"Trade In"}</option>
                                                <option value="replacement">{"Replacement"}</option>
                                            </select>
                                            {/* <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="demand_structure" id="demand_structure" placeholder="" required /> */}
                                        {/* </div> */}
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="trade_in_required" id="trade_in_required" placeholder="" required />
                                            <label htmlFor="trade_in_required">Trade In</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        {/* <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="financial_type" id="financial_type" placeholder="" required />
                                            <label htmlFor="financial_type">Financial Type</label>
                                        </div> */}
                                        <label htmlFor="financial_type">Financial Type</label>
                                        <select type="text" className="form-control" name="financial_type" onChange={handleChangeInput} id="financial_type" defaultValue="" required>
                                            <option value="">--Pilih--</option>
                                            <option value="cash">{"Cash"}</option>
                                            <option value="credit">{"Credit"}</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="jenis_leasing" id="jenis_leasing" placeholder="" required />
                                            <label htmlFor="jenis_leasing">Jenis Leasing</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="date" className="form-control form-control-sm" onChange={handleChangeInput} name="tanggal_aplikasi_masuk_ke_leasing" id="tanggal_aplikasi_masuk_ke_leasing" placeholder="" required />
                                            <label htmlFor="tanggal_aplikasi_masuk_ke_leasing">Tanggal Aplikasi Masuk Leasing</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="dp_rate">DP Rate</label>
                                        <select type="text" className="form-control" name="dp_rate" onChange={handleChangeInput} id="dp_rate" defaultValue="" required>
                                            <option value="">--SELECT DP RATE--</option>
                                            <option value="< 20%">{"< 20%"}</option>
                                            <option value="20% - <30%">{"20% - <30%"}</option>
                                            <option value="30% - <40%">{"30% - <40%"}</option>
                                            <option value=">40%">{">40%"}</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="booking_fee" id="booking_fee" placeholder="" required />
                                            <label htmlFor="booking_fee">Booking Fee</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="form-floating">
                                            <input type="text" className="form-control form-control-sm" onChange={handleChangeInput} name="booking_fee" id="booking_fee" placeholder="" required />
                                            <label htmlFor="booking_fee">Booking Fee</label>
                                        </div>
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

            <Dialog
                open={modalCustomer}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="xl"
                onClose={closeModal}
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
                                                        <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Pilih Customer</h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <button type='button' onClick={closeModal} className='btn btn-danger btn-sm'>X</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            onChange={handleChangeSearchInPopUp}
                                                            value={filterInPopUp}
                                                            id="filter_search"
                                                            name="filter_search"
                                                            placeholder="Cari Customer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="table-responsive" style={{ fontSize: "12px" }}>
                                                        <table className="table align-middle table-nowrap mb-0">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Single ID</th>
                                                                    <th>Nama Customer</th>
                                                                    <th>No Identitas (NIK/NPWP)</th>
                                                                    <th>No Telepon</th>
                                                                    <th>Sales</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {listCustomer.length > 0 ? 
                                                                    <>
                                                                        {listCustomer.map((value, index) =>
                                                                            <tr key={index}>
                                                                                <td className='text-bold'>{value.single_id}</td>
                                                                                <td>{value.nama_customer}</td>
                                                                                <td>{value.nik_buyer}</td>
                                                                                <td>{value.no_telp}</td>
                                                                                <td>{value.sales}</td>
                                                                                <td>
                                                                                    <button type='button' onClick={() => handleChooseCustomer(value.single_id, value.nama_customer, value.no_telp, value.sales_id)} className='btn btn-info btn-sm'>Pilih</button>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </>
                                                                : 
                                                                    <>
                                                                        <tr className='text-center'>
                                                                            <td colSpan={6}>Customer tidak ditemukan</td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                            </tbody>
                                                        </table>
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
    );
}

export default Inputspk;
