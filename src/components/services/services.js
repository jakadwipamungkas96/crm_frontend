import React, { useEffect, useState } from "react";

import axios from 'axios';
import TableContainer from "@mui/material/TableContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@mui/styles';
import swal from 'sweetalert';
import Autocomplete from "@mui/material/Autocomplete";
import Slide from "@mui/material/Slide";
import CryptoJS from 'crypto-js';
import Select from 'react-select';

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

function Services() {
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

    const [loadingTable, setLoadingTable] = useState(false);
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);

    const [lsDtKendaraan, setLsOption] = useState([]);
    const [lsDtTypeCust, setLsOptionTypeCust] = useState([]);
    
    useEffect(() => {
        setLoadingTable(true);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/select/option`;
            try {

                const response = await axios.get(url);
                setLsOption(response.data.kendaraan);
                setLsOptionTypeCust(response.data.cs_type);
                setLoadingTable(false);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, []);

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          zIndex: 2, // Sesuaikan dengan nilai z-index yang diinginkan
          height: "58px"
        }),
        menu: (provided, state) => ({
          ...provided,
          zIndex: 3, // Sesuaikan dengan nilai z-index yang diinginkan
        }),
    };

    const [inpSingleID, setinpSingleID] = useState('');
    const [inpCustomerName, setinpCustomerName] = useState('');
    const [inpNik, setinpNik] = useState('');
    const [inpNoTelp, setinpNoTelp] = useState('');
    const [inpNoPol, setinpNoPol] = useState('');
    const [inpNamaStnk, setinpNamaStnk] = useState('');
    const [inpTglStnk, setinpTglStnk] = useState('');
    const [inpNoRangka, setinpNoRangka] = useState('');
    const [inpNamaPemakai, setinpNamaPemakai] = useState('');
    const [inpTelpPemakai, setinpTelpPemakai] = useState('');
    const [inpCustomerType, setinpCustomerType] = useState('');
    const [inpTglService, setinpTglService] = useState('');
    const [inpKetService, setinpKetService] = useState('');

    const handleChooseVin = (event) => {
        setinpNoRangka(event.value);
        getDetailbyVin(event.value);
        setInputs((values) => ({
            ...values,
            ["no_rangka"]: event.value,
        }));
    }

    const handleChooseCustType = (event) => {
        setinpCustomerType(event.value);
        setInputs((values) => ({
            ...values,
            ["customer_type"]: event.value,
        }));
    }

    const handleChangeNik = (event) => {
        setinpNik(event.target.value);
        setInputs((values) => ({
            ...values,
            ["nik"]: event.target.value,
        }));
    } 

    const handleChangeNoPol = (event) => {
        setinpNoPol(event.target.value);
        setInputs((values) => ({
            ...values,
            ["no_pol"]: event.target.value,
        }));
    } 

    const handleChangeNamaStnk = (event) => {
        const uppercaseValue = event.target.value.toUpperCase();
        setinpNamaStnk(uppercaseValue);
        setInputs((values) => ({
            ...values,
            ["nama_stnk"]: uppercaseValue,
        }));
    } 

    const handleChangeTglStnk = (event) => {
        setinpTglStnk(event.target.value);
        setInputs((values) => ({
            ...values,
            ["tgl_stnk"]: event.target.value,
        }));
    } 

    const handleChangeTglService = (event) => {
        setinpTglService(event.target.value);
        setInputs((values) => ({
            ...values,
            ["tgl_wo"]: event.target.value,
        }));
    } 

    const handleChangeKetService = (event) => {
        setinpKetService(event.target.value);
        setInputs((values) => ({
            ...values,
            ["tgl_wo"]: event.target.value,
        }));
    } 

    const handleChangeNamaPemakai = (event) => {
        setinpNamaPemakai(event.target.value);
        setInputs((values) => ({
            ...values,
            ["decision_maker"]: event.target.value,
        }));
    } 

    const handleChangeTelpPemakai = (event) => {
        setinpTelpPemakai(event.target.value);
        setInputs((values) => ({
            ...values,
            ["decision_maker_phone"]: event.target.value,
        }));
    } 

    const handleChangeNoTelp = (event) => {
        setinpNoTelp(event.target.value);
        setInputs((values) => ({
            ...values,
            ["telp"]: event.target.value,
        }));
    } 

    function getDetailbyVin(vin) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios
            .get("http://127.0.0.1:8000/api/services/vin?vin="+vin)
            .then((response) => {
                if (response.data.data.length == 0) {
                    setinpSingleID('');
                    setinpCustomerName('');
                    setinpNik('');
                    setinpNoPol('');
                    setinpNamaStnk('');
                    setinpTglStnk('');
                    setinpNoTelp('');
                } else {
                    setinpSingleID(response.data.data.single_id);
                    setinpCustomerName(response.data.data.nama_customer);
                    setinpNik(response.data.data.nik);
                    setinpNoPol(response.data.data.no_pol);
                    setinpNamaStnk(response.data.data.nama_stnk);
                    setinpTglStnk(response.data.data.tgl_stnk != null ? formatDateInput(response.data.data.tgl_stnk) : "");
                    setinpNoTelp(response.data.data.telp);

                    setInputs((values) => ({
                        ...values,
                        ["single_id"]: response.data.data.single_id,
                        ["nama_customer"]: response.data.data.nama_customer,
                        ["nik"]: response.data.data.nik,
                        ["no_pol"]: response.data.data.no_pol,
                        ["nama_stnk"]: response.data.data.nama_stnk,
                        ["telp"]: response.data.data.telp,
                    }));
                }
            });
    }

    // Input Services Excel
    const cancelService = (event) => {
        window.location.href = "/so";
    }

    const [inputsServices, setInputs] = React.useState([]);

    const hChangeInputService = (event) => {
        setInputs(values => ({...values, [event.target.name]: event.target.value}));
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

    const handleSubmitService = (event) => {
        event.preventDefault();
        console.log(inputsServices);
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
                            <h4 className="mb-sm-0">Input Services</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">Services</a></li>
                                    <li className="breadcrumb-item active">Input</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body" style={{padding: "15px"}}>
                                <form action="#">
                                    <div className="row">
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                {/* <select type="text" className="form-control form-control-sm" name="no_rangka" id="no_rangka" placeholder="Pilih VIN">
                                                    <option value="">-- Pilih No Rangka --</option>
                                                    {lsDtKendaraan.map((vlcar, idcar) => (
                                                        <option key={idcar} value={vlcar.no_rangka}>{vlcar.no_rangka}</option>
                                                    ))}
                                                </select>
                                                <label htmlFor="no_rangka">Pilih No Rangka</label> */}
                                                <Select styles={customStyles} options={lsDtKendaraan} placeholder="Pilih No Rangka" onChange={handleChooseVin} name="no_rangka" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="text" className="form-control form-control-sm" readOnly value={inpCustomerName} name="nama_customer" id="nama_customer" placeholder="nama_customer" />
                                                <label htmlFor="nama_customer">Nama Pemilik</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="text" className="form-control form-control-sm" onChange={handleChangeNik} value={inpNik !== null ? inpNik : ''} name="nik" id="nik" placeholder="No KTP/NPWP" />
                                                <label htmlFor="nik">KTP/NPWP</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="number" className="form-control form-control-sm" onChange={handleChangeNoTelp} value={inpNoTelp !== null ? inpNoTelp : ''} name="telp" id="telp" placeholder="No Telepon" />
                                                <label htmlFor="telp">No Telepon Pemilik</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="text" className="form-control form-control-sm" onChange={handleChangeNoPol} value={inpNoPol !== null ? inpNoPol : ''} name="no_pol" id="no_pol" placeholder="No Polisi" />
                                                <label htmlFor="no_pol">No Polisi</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="text" className="form-control form-control-sm" onChange={handleChangeNamaStnk} value={inpNamaStnk !== null ? inpNamaStnk : ''} name="nama_stnk" id="nama_stnk" placeholder="Nama STNK" />
                                                <label htmlFor="nama_stnk">Nama STNK</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="date" className="form-control form-control-sm" onChange={handleChangeTglStnk} value={inpTglStnk !== null ? inpTglStnk : ''} name="tgl_stnk" id="tgl_stnk" placeholder="Tanggal STNK" />
                                                <label htmlFor="tgl_stnk">Tanggal STNK</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="text" className="form-control form-control-sm" onChange={handleChangeNamaPemakai} value={inpNamaPemakai !== null ? inpNamaPemakai : ''} name="nama_pemakai" id="nama_pemakai" placeholder="Nama Pemakai" />
                                                <label htmlFor="nama_pemakai">Nama Pemakai Kendaraan</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="number" className="form-control form-control-sm" onChange={handleChangeTelpPemakai} value={inpTelpPemakai !== null ? inpTelpPemakai : ''} name="telp_pemakai" id="telp_pemakai" placeholder="Telepon Pemakai" />
                                                <label htmlFor="telp_pemakai">No Telepon Pemakai</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <Select styles={customStyles} options={lsDtTypeCust} placeholder="Tipe Customer" onChange={handleChooseCustType} name="customer_type" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="date" className="form-control form-control-sm" onChange={handleChangeTglService} value={inpTglService !== null ? inpTglService : ''} name="tgl_service" id="tgl_service" placeholder="Tanggal Service" />
                                                <label htmlFor="tgl_service">Tanggal Service</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-2">
                                            <div className="form-floating">
                                                <input type="text" className="form-control form-control-sm" onChange={handleChangeKetService} value={inpKetService !== null ? inpKetService : ''} name="ket_service" id="ket_service" placeholder="Keterangan Service" />
                                                <label htmlFor="ket_service">Keterangan Service</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer" style={{padding: "15px"}}>
                                <div className="row">
                                    <div className="col-lg-6">

                                    </div>
                                    <div className="col-lg-6">
                                        <div className="text-end">
                                            <button onClick={handleSubmitService} className="btn btn-primary btn-label"><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Submit</button>
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

export default Services;
