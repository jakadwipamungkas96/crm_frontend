import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import swal from 'sweetalert';

const Profile = () => {
    const uid = JSON.parse(localStorage.getItem("uid"));
    const rulesName = JSON.parse(localStorage.getItem("rules"));
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const id_cabang = JSON.parse(localStorage.getItem("id_cabang"));
    const usrCabangName = JSON.parse(localStorage.getItem("cabang_name"));

    const [personName, setPersonName] = useState(JSON.parse(localStorage.getItem("person")));
    const [telegramChatId, setTelegramChatId] = useState();
    const [isChatId, setIsChatID] = useState();
    const [inputsProfile, setInputProfile] = useState([]);
    const [isLoading, setLoading] = useState(false);


    const handlePersonName = (event) => {
        setPersonName(event.target.value);
        setInputProfile((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleTelegramChatId = (event) => {
        setTelegramChatId(event.target.value);
        setInputProfile((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const getDetailUser = async () => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const url = `http://127.0.0.1:8000/api/users/${uid}`;
        try {
            const response = await axios.get(url);
            console.log(response.data.data.person);
            setInputProfile((values) => ({
                ...values,
                ["uid"]: uid,
                ["person"]: response.data.data.person,
            }));
            setTelegramChatId(response.data.tchatid);
            setIsChatID(response.data.tchatid);
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        getDetailUser();
    }, []);

    const handleSubmitProfile = async (event) => {
        console.log(inputsProfile);
        event.preventDefault();
        setLoading(true);
        await axios
            .post("http://127.0.0.1:8000/api/users/update/sales", inputsProfile)
            .then(function (response) {
                if (response.data.error == true) {
                    setLoading(false);
                    swal("Error", 'Data tidak boleh kosong!', "error", {
                        buttons: false,
                        timer: 2000,
                    });
                } else {
                    setLoading(false);
                    swal("Success", 'Data Berhasil diperbaharui!', "success", {
                        buttons: false,
                        timer: 2000,
                    });

                    // window.location.href = "/profile";
                }
            });
    }

    return (
        <div className="page-content">
            <div className="container-fluid">

                <div className="row bg-white">
                    <div className="col-xl-12">
                        <div className="card ribbon-box border shadow-none mb-lg-0">
                            <div className="card-body text-muted">
                                <span className="ribbon-three ribbon-three-secondary"><span style={{ fontWeight: 500 }}>Profile</span></span>
                                <div className='row'>
                                    <div className='col-xl-12 p-5'>
                                        <div>
                                            <label htmlFor="namalengkap" className="form-label">Nama Lengkap</label>
                                            <input type="text" className="form-control" id="namalengkap" name="namalengkap" value={personName} onChange={handlePersonName} />
                                        </div>
                                        <div className='mt-2'>
                                            <label htmlFor="namalengkap" className="form-label">Telegram Chat ID</label>
                                            <input type="text" className="form-control mb-2" id="namalengkap" name="telegram_chat_id" value={telegramChatId !== null ? telegramChatId : ''} onChange={handleTelegramChatId} />
                                            <i><small className={`text-danger ${isChatId != null ? 'd-none' : ''}`}>Telegram Chat ID masih kosong, silahkan untuk melihat panduan cara mendaftar dengan klik
                                                <a className='text-primary' style={{ cursor: "pointer", textDecoration: "underline" }}> disini</a></small></i>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-6 text-end'>
                                        
                                    </div>
                                    <div className='col-md-6 text-end'>
                                        <button className='btn btn-primary btn-sm' onClick={handleSubmitProfile}><i className='ri ri-save-line'></i> Simpan</button>
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

export default Profile;