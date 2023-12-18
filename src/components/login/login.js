import React,{ useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Login = () => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const data = {
            username: username,
            password: password
        };
    
        axios.post('http://127.0.0.1:8000/api/login', data)
        .then(response => {
            setLoading(false);
            swal("Success", "Berhasil Login", "success", {
                buttons: false,
                timer: 2000,
            });
            
            // window.location.reload();

            
            const enkripUrl    = CryptoJS.AES.encrypt("http://127.0.0.1:8000/", "w1j4y4#t0y0T4");
            const enkripToken  = CryptoJS.AES.encrypt(response.data.access_token, "w1j4y4#t0y0T4");
            // const enkripCabangId= CryptoJS.AES.encrypt(response.data.id_cabang, "w1j4y4#t0y0T4");
            // const enkripPerson = CryptoJS.AES.encrypt(JSON.stringify(response.data.person), "w1j4y4#t0y0T4");
            // const enkripRules = CryptoJS.AES.encrypt(JSON.stringify(response.data.rules), "w1j4y4#t0y0T4");
            // const enkripCabangName = CryptoJS.AES.encrypt(JSON.stringify(response.data.cabang_name), "w1j4y4#t0y0T4");
            // console.log(enkripToken.toString());
            localStorage.setItem('strul', enkripUrl.toString());
            localStorage.setItem('strtkn', enkripToken.toString());
            // localStorage.setItem('strtkn', enkripToken.toString());
            // localStorage.setItem('strcid', enkripCabangId.toString());
            // localStorage.setItem('strprsn', enkripPerson.toString());
            // localStorage.setItem('strrls', enkripRules.toString());
            // localStorage.setItem('strcbn', enkripCabangName.toString());
            // localStorage.setItem('apiUrl', "http://127.0.0.1:8000/");
            // localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('id_cabang', response.data.id_cabang);
            localStorage.setItem('person', JSON.stringify(response.data.person));
            localStorage.setItem('rules', JSON.stringify(response.data.rules));
            localStorage.setItem('cabang_name', JSON.stringify(response.data.cabang_name));
            
            if (response.data.rules == "superadmin" || response.data.rules == "spv" || response.data.rules == "administrator" || response.data.rules == "sales") {
                window.location.href = "/dashboard";
            } else if (response.data.rules == "crc") {
                window.location.href = "/list/bstb";
            }
            // window.location.href = "/dashboard";

        })
        .catch(error => {
            setLoading(false);
            swal("Error", "Kombinasi username dan password salah", "error", {
                buttons: false,
                timer: 2000,
            });
        });
    }
    return (
        <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
            <div className="bg-overlay"></div>
            
            <div className="auth-page-content overflow-hidden pt-lg-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card overflow-hidden shadow-lg">
                                <div className="row g-0">
                                    <div className="col-lg-6">
                                        <div className="p-lg-5 p-4 auth-one-bg h-100">
                                            <div className="bg-overlay"></div>
                                            <div className="position-relative h-100 d-flex flex-column">
                                                <div className="mb-4">
                                                    <a href="index.html" className="d-block">
                                                        <img src="/assets/images/logo_wijaya_white.png" alt="" height="20" /><br/>
                                                    </a>
                                                </div>
                                                <div className="mt-auto">
                                                    <div className="mb-3">
                                                        <i className="ri-double-quotes-l display-4 text-danger"></i>
                                                    </div>

                                                    <div id="qoutescarouselIndicators" className="carousel slide" data-bs-ride="carousel">
                                                        <div className="carousel-indicators">
                                                            <button type="button" data-bs-target="#qoutescarouselIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                                            <button type="button" data-bs-target="#qoutescarouselIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                        </div>
                                                        <div className="carousel-inner text-center text-white pb-5">
                                                            <div className="carousel-item active">
                                                                <p className="fs-15 fst-italic">" Great! User Friendly, Easy to use. Thanks very much! "</p>
                                                            </div>
                                                            <div className="carousel-item">
                                                                <p className="fs-15 fst-italic">" The platform is really great with an amazing company support."</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    

                                    <div className="col-lg-6">
                                        <div className="p-lg-5 p-4">
                                            <div>
                                                <span className="text-uppercase" style={{fontWeight: "bold", fontSize: "20px"}}>SID Wijaya Toyota </span>
                                                <p className="text-muted">Database Single ID Wijaya Toyota</p>
                                            </div>

                                            <div className="mt-4">
                                                <form onSubmit={handleSubmit}>

                                                    <div className="mb-3">
                                                        <label htmlFor="username" className="form-label">Username</label>
                                                        <input type="text" onChange={e => setUserName(e.target.value)} className="form-control" id="username" placeholder="Enter username" />
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="float-end">
                                                            {/* <a href="auth-pass-reset-cover.html" className="text-muted">Forgot password?</a> */}
                                                        </div>
                                                        <label className="form-label" htmlFor="password-input">Password</label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <input type="password" onChange={e => setPassword(e.target.value)} className="form-control pe-5 password-input" placeholder="Enter password" id="password-input" />
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                        </div>
                                                    </div>

                                                    <div className="form-check">
                                                        {/* <input className="form-check-input" type="checkbox" value="" id="auth-remember-check" /> */}
                                                        {/* <label className="form-check-label" htmlFor="auth-remember-check">Remember me</label> */}
                                                    </div>

                                                    <div className="mt-0" style={{textAlign: "right"}}>
                                                        {isLoading ? (
                                                            <button type="button" class="btn btn-outline-warning btn-load">
                                                                <span class="d-flex align-items-center">
                                                                    <span class="flex-grow-1 me-2">
                                                                        Loading...
                                                                    </span>
                                                                    <span class="spinner-grow flex-shrink-0" role="status">
                                                                        <span class="visually-hidden">Loading...</span>
                                                                    </span>
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-danger w-25" type="submit">Masuk</button>
                                                        )}
                                                    </div>

                                                </form>
                                            </div>

                                            <div className="mt-5 text-center">
                                                <p className="mb-0">Belum punya akun ? <a href="https://wa.me/6289626481645?text=Selamat Pagi, saya .... divisi .... Nomor Pekerja .... belum mempunyai akun untuk mengakses CRM" target='__blank' className="fw-semibold text-primary text-decoration-underline"> Silahkan Hubungi IT Administrator</a> </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            
                        </div>
                        

                    </div>
                    
                </div>
                
            </div>
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center" style={{color: "#E2E8F0"}}>
                                <p className="mb-0">&copy;
                                    <script>document.write(new Date().getFullYear())</script>. Supported by PT Cyberion Revolusi Teknologi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Login;
