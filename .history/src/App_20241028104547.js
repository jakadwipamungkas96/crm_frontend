import React, { useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import feather from "feather-icons";
import "./App.css";
import Login from "./components/login/login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import DataCustomers from "./components/customers/datacustomers";
import Ulangtahun from "./components/ulangtahun/ulangtahun";
import Dashboard from "./components/dashboard/dashboard";
import CryptoJS from "crypto-js";
import Do from "./components/delivery_orders/do";
import So from "./components/service_orders/so";
import Carlist from "./components/car/carlist";
import Services from "./components/services/services";
import Attacklist from "./components/service_orders/attacklist";
import Bstb from "./components/delivery_orders/bstb";
import Servicepertama from "./components/service_orders/servicepertama";
import Bucket from "./components/customers/bucket";
import Profile from "./components/profile/profile";
import Nextservices from "./components/service_orders/nextservices";
import Wablast from "./components/service_orders/wablast";
import Reason from "./components/reason/reason";
import DashboardSales from "./components/dashboard/dashboardsales";
import Users from "./components/users/users";
import Overview from "./components/stock/onhand";
import Inputstock from "./components/stock/inputstock";
import Onhand from "./components/stock/onhand";
import DashboardMra from "./components/dashboard/dashboardmra";
import List from "./components/spk/list";
import Inputspk from "./components/spk/inputspk";
import Liststock from "./components/stock/liststock";
import Pengajuancancel from "./components/spk/pengajuancancel";
import Validasido from "./components/stock/validasido";
import Validasimatching from "./components/stock/validasimatching";
import Validasiinternal from "./components/stock/validasiinternal";
import Validasiafi from "./components/stock/validasiafi";

function App() {
  useEffect(() => {
    function m() {
      feather.replace();
      var e = document.documentElement.clientWidth,
        e =
          (e < 1025 && 767 < e
            ? (document.body.classList.remove("twocolumn-panel"),
              "twocolumn" === sessionStorage.getItem("data-layout") &&
                (document.documentElement.setAttribute(
                  "data-layout",
                  "twocolumn"
                ),
                document.getElementById("customizer-layout03") &&
                  document.getElementById("customizer-layout03").click()),
              "vertical" === sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-sidebar-size",
                  "sm"
                ),
              "semibox" === sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-sidebar-size",
                  "sm"
                ),
              document.querySelector(".hamburger-icon") &&
                document.querySelector(".hamburger-icon").classList.add("open"))
            : 1025 <= e
            ? (document.body.classList.remove("twocolumn-panel"),
              "twocolumn" === sessionStorage.getItem("data-layout") &&
                (document.documentElement.setAttribute(
                  "data-layout",
                  "twocolumn"
                ),
                document.getElementById("customizer-layout03") &&
                  document.getElementById("customizer-layout03").click()),
              "vertical" === sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-sidebar-size",
                  sessionStorage.getItem("data-sidebar-size")
                ),
              "semibox" === sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-sidebar-size",
                  sessionStorage.getItem("data-sidebar-size")
                ),
              document.querySelector(".hamburger-icon") &&
                document
                  .querySelector(".hamburger-icon")
                  .classList.remove("open"))
            : e <= 767 &&
              (document.body.classList.remove("vertical-sidebar-enable"),
              document.body.classList.add("twocolumn-panel"),
              "twocolumn" === sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-layout",
                  "vertical"
                ),
              "horizontal" !== sessionStorage.getItem("data-layout") &&
                document.documentElement.setAttribute(
                  "data-sidebar-size",
                  "lg"
                ),
              document.querySelector(".hamburger-icon")) &&
              document.querySelector(".hamburger-icon").classList.add("open"),
          document.querySelectorAll("#navbar-nav > li.nav-item"));
    }

    function O() {
      var e = document.documentElement.clientWidth;
      if (767 < e) {
        document.querySelector(".hamburger-icon").classList.toggle("open");
      }

      if (
        "horizontal" === document.documentElement.getAttribute("data-layout")
      ) {
        if (document.body.classList.contains("menu")) {
          document.body.classList.remove("menu");
        } else {
          document.body.classList.add("menu");
        }
      }

      if ("vertical" === document.documentElement.getAttribute("data-layout")) {
        if (e <= 1025 && 767 < e) {
          document.body.classList.remove("vertical-sidebar-enable");
          if (
            "sm" === document.documentElement.getAttribute("data-sidebar-size")
          ) {
            document.documentElement.setAttribute("data-sidebar-size", "");
          } else {
            document.documentElement.setAttribute("data-sidebar-size", "sm");
          }
        } else if (1025 < e) {
          document.body.classList.remove("vertical-sidebar-enable");
          if (
            "lg" === document.documentElement.getAttribute("data-sidebar-size")
          ) {
            document.documentElement.setAttribute("data-sidebar-size", "sm");
          } else {
            document.documentElement.setAttribute("data-sidebar-size", "lg");
          }
        } else if (e <= 767) {
          document.body.classList.add("vertical-sidebar-enable");
          document.documentElement.setAttribute("data-sidebar-size", "lg");
        }
      }

      if ("semibox" === document.documentElement.getAttribute("data-layout")) {
        if (767 < e) {
          if (
            "show" ===
            document.documentElement.getAttribute("data-sidebar-visibility")
          ) {
            if (
              "lg" ===
              document.documentElement.getAttribute("data-sidebar-size")
            ) {
              document.documentElement.setAttribute("data-sidebar-size", "sm");
            } else {
              document.documentElement.setAttribute("data-sidebar-size", "lg");
            }
          } else {
            document.getElementById("sidebar-visibility-show").click();
            document.documentElement.setAttribute(
              "data-sidebar-size",
              document.documentElement.getAttribute("data-sidebar-size")
            );
          }
        } else if (e <= 767) {
          document.body.classList.add("vertical-sidebar-enable");
          document.documentElement.setAttribute("data-sidebar-size", "lg");
        }
      }

      if (
        "twocolumn" === document.documentElement.getAttribute("data-layout")
      ) {
        if (document.body.classList.contains("twocolumn-panel")) {
          document.body.classList.remove("twocolumn-panel");
        } else {
          document.body.classList.add("twocolumn-panel");
        }
      }
    }

    function G() {
      document.addEventListener("DOMContentLoaded", function () {
        var e = document.getElementsByClassName("code-switcher");
        Array.from(e).forEach(function (a) {
          a.addEventListener("change", function () {
            var e = a.closest(".card"),
              t = e.querySelector(".live-preview"),
              e = e.querySelector(".code-view");
            if (a.checked) {
              t.classList.add("d-none");
              e.classList.remove("d-none");
            } else {
              t.classList.remove("d-none");
              e.classList.add("d-none");
            }
          });
        });
        feather.replace();
      });

      window.addEventListener("resize", m);
      m();

      document.addEventListener("scroll", function () {
        var e;
        (e = document.getElementById("page-topbar")) &&
          (50 <= document.body.scrollTop ||
          50 <= document.documentElement.scrollTop
            ? e.classList.add("topbar-shadow")
            : e.classList.remove("topbar-shadow"));
      });

      window.addEventListener("load", function () {
        var e;
        g();

        (e = document.getElementsByClassName("vertical-overlay")) &&
          Array.from(e).forEach(function (e) {
            e.addEventListener("click", function () {
              document.body.classList.remove("vertical-sidebar-enable");
              "twocolumn" === sessionStorage.getItem("data-layout")
                ? document.body.classList.add("twocolumn-panel")
                : document.documentElement.setAttribute(
                    "data-sidebar-size",
                    sessionStorage.getItem("data-sidebar-size")
                  );
            });
          });

        document.getElementById("topnav-hamburger-icon") &&
          document
            .getElementById("topnav-hamburger-icon")
            .addEventListener("click", O);

        var e = sessionStorage.getItem("defaultAttribute");
        e = JSON.parse(e);
        var t = document.documentElement.clientWidth;
      });
    }

    function g() {
      const { pathname } = window.location;
      const e = pathname === "/" ? "index.html" : pathname.substring(1);
    }
    G();
  }, []);

  // SESSION STORAGE
  const personName = JSON.parse(localStorage.getItem("person"));
  const rulesName = JSON.parse(localStorage.getItem("rules"));
  const token =
    localStorage.getItem("strtkn") == null
      ? ""
      : CryptoJS.AES.decrypt(
          localStorage.getItem("strtkn"),
          "w1j4y4#t0y0T4"
        ).toString(CryptoJS.enc.Utf8);
  const id_cabang = JSON.parse(localStorage.getItem("id_cabang"));
  const uid = JSON.parse(localStorage.getItem("uid"));
  const usrCabangName = JSON.parse(localStorage.getItem("cabang_name"));

  const avaProfile = "assets/images/users/user-dummy-img.jpg";
  const logoWL = "assets/images/logo_wijaya_white.png";
  // Menghapus segment kedua dari path
  var domain = window.location.protocol + "//" + window.location.host;

  // Variable
  const checkToken = () => {
    const token =
      localStorage.getItem("strtkn") == null
        ? ""
        : CryptoJS.AES.decrypt(
            localStorage.getItem("strtkn"),
            "w1j4y4#t0y0T4"
          ).toString(CryptoJS.enc.Utf8);
    axios
      .post("https://api.crm.wijayatoyota.co.id/api/logout", token)
      .then((response) => {
        swal("Success", "Berhasil Logout", "success", {
          buttons: false,
          timer: 2000,
        });

        window.location.href = "/";
      })
      .catch((error) => {
        swal("Error", "Gagal Logout", "error", {
          buttons: false,
          timer: 2000,
        });
      });
  };

  const handleLogout = () => {
    // const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    // axios.post('https://api.crm.wijayatoyota.co.id/api/logout')
    //   .then(response => {

    localStorage.removeItem("sid");
    localStorage.removeItem("uid");
    localStorage.removeItem("strul");
    localStorage.removeItem("strtkn");
    localStorage.removeItem("person");
    localStorage.removeItem("rules");
    localStorage.removeItem("cabang_name");
    localStorage.removeItem("id_cabang");

    swal("Success", "Berhasil Logout", "success", {
      buttons: false,
      timer: 2000,
    });

    window.location.href = "/";

    // })
    // .catch(error => {
    //   swal("Error", "Gagal Logout", "error", {
    //     buttons: false,
    //     timer: 2000,
    //   });
    // });
  };

  if (!token) {
    return <Login />;
  }

  return (
    <Router>
      <div id="layout-wrapper">
        <header id="page-topbar">
          <div className="layout-width">
            <div className="navbar-header">
              <div className="d-flex">
                {/* LOGO */}
                <div className="navbar-brand-box horizontal-logo">
                  <a href="index.html" className="logo logo-dark">
                    <span className="logo-sm">
                      <img src={domain + "/" + logoWL} alt="" height="17" />
                    </span>
                    <span className="logo-lg">
                      <img src={domain + "/" + logoWL} alt="" height="17" />
                    </span>
                  </a>

                  <a href="index.html" className="logo logo-light">
                    <span className="logo-sm">
                      <img src={domain + "/" + logoWL} alt="" height="17" />
                    </span>
                    <span className="logo-lg">
                      <img src={domain + "/" + logoWL} alt="" height="17" />
                    </span>
                  </a>
                </div>

                <div className="dropdown ms-1 topbar-head-dropdown header-item topnav-hamburger">
                  <button
                    type="button"
                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="ri-apps-fill"></span>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end">
                    {/* <a href="javascript:void(0);" className="dropdown-item notify-item language py-2" data-lang="en" title="English"> */}
                    {/* <span className="align-middle">English</span> */}
                    {/* </a> */}
                    <div id="scrollbar">
                      <div className="container-fluid">
                        <div id="two-column-menu"></div>
                        <ul className="navbar-nav" id="navbar-nav">
                          <li
                            className="menu-title mb-2"
                            style={{
                              background: "rgb(229, 231, 235)",
                              color: "#000",
                            }}
                          >
                            <span>
                              <img
                                src={domain + "/assets/images/icon_wijaya.png"}
                                alt=""
                                height="20"
                              />{" "}
                              {usrCabangName}
                            </span>
                          </li>

                          {rulesName == "mra" ? (
                            <>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/dashboard/mra"
                                >
                                  <i className="ri-dashboard-line"></i>{" "}
                                  <span data-key="t-widgets">
                                    Dashboard MRA
                                  </span>
                                </NavLink>
                              </li>
                            </>
                          ) : (
                            ""
                          )
                          }

                          {rulesName == "sales" ? (
                            <>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/dashboard/sales"
                                >
                                  <i className="ri-dashboard-line"></i>{" "}
                                  <span data-key="t-widgets">
                                    Dashboard Sales
                                  </span>
                                </NavLink>
                              </li>
                            </>
                          ) : rulesName == "mra" ? (
                            <>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/dashboard/mra"
                                >
                                  <i className="ri-dashboard-line"></i>{" "}
                                  <span data-key="t-widgets">
                                    Dashboard MRA
                                  </span>
                                </NavLink>
                              </li>
                            </>
                          ) : (
                            <>
                              <li className={`nav-item`}>
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/dashboard"
                                >
                                  <i className="ri-dashboard-line"></i>{" "}
                                  <span data-key="t-widgets">Dashboard</span>
                                </NavLink>
                              </li>
                            </>
                          )}
                          <li className="menu-title">
                            <span data-key="t-menu">Customers</span>
                          </li>
                          <li className="nav-item">
                            <NavLink
                              className="nav-link menu-link"
                              exact="true"
                              to="/datacustomers"
                            >
                              <i className="ri-honour-line"></i>{" "}
                              <span data-key="t-widgets">
                                Database Customers
                              </span>
                            </NavLink>
                          </li>
                          {rulesName != "crc" || rulesName != "kacab" || rulesName != 'sas' ? (
                            <li className="nav-item">
                              <NavLink
                                className="nav-link menu-link"
                                exact="true"
                                to="/customers/bucket"
                              >
                                <i className="ri-indent-increase"></i>{" "}
                                <span data-key="t-widgets">
                                  Sharing Data Bucket
                                </span>
                              </NavLink>
                            </li>
                          ) : (
                            ""
                          )}

                          {/* <li className="nav-item"><NavLink className="nav-link menu-link"exact="true" to="/ulangtahun"><i className="ri-cake-line"></i> <span data-key="t-widgets">List Ulang Tahun</span></NavLink></li> */}
                          <li className="menu-title">
                            <span data-key="t-menu">List</span>
                          </li>
                          {rulesName != "mra" ? (
                            <li className="nav-item">
                              <NavLink
                                className="nav-link menu-link"
                                exact="true"
                                to="/do"
                              >
                                <i className="ri-indent-increase"></i>{" "}
                                <span data-key="t-widgets">Delivery Order</span>
                              </NavLink>
                            </li>
                          ) : (
                            <>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/services/attacklist"
                                >
                                  <i className="ri-file-list-3-fill"></i>{" "}
                                  <span data-key="t-widgets">Attacklist</span>
                                </NavLink>
                              </li>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/wablast"
                                >
                                  <i className="ri-whatsapp-line"></i>{" "}
                                  <span data-key="t-widgets">WA Blast</span>
                                </NavLink>
                              </li>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/reason"
                                >
                                  <i className="ri-list-check-2"></i>{" "}
                                  <span data-key="t-widgets">
                                    Master Reason
                                  </span>
                                </NavLink>
                              </li>
                            </>
                          )}

                          {rulesName != "spv" && rulesName != "kacab" ? (
                            <>
                              <li className="menu-title">
                                <span data-key="t-menu">Service</span>
                              </li>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/input/servicepertama"
                                >
                                  <i className="ri-file-list-3-fill"></i>{" "}
                                  <span data-key="t-widgets">
                                    Service Pertama
                                  </span>
                                </NavLink>
                              </li>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/services/booking"
                                >
                                  <i className="ri-file-list-3-fill"></i>{" "}
                                  <span data-key="t-widgets">
                                    Service Lainnya
                                  </span>
                                </NavLink>
                              </li>
                            </>
                          ) : (
                            ""
                          )}

                          {rulesName == "crc" ? (
                            <li className="nav-item">
                              <NavLink
                                className="nav-link menu-link"
                                exact="true"
                                to="/list/bstb"
                              >
                                <i className="ri-file-list-3-fill"></i>{" "}
                                <span data-key="t-widgets">
                                  DEC Tracking by BSTB
                                </span>
                              </NavLink>
                            </li>
                          ) : (
                            ""
                          )}

                          {rulesName == "superadmin" ? (
                            <>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/services/attacklist"
                                >
                                  <i className="ri-file-list-3-fill"></i>{" "}
                                  <span data-key="t-widgets">Attacklist</span>
                                </NavLink>
                              </li>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/wablast"
                                >
                                  <i className="ri-whatsapp-line"></i>{" "}
                                  <span data-key="t-widgets">WA Blast</span>
                                </NavLink>
                              </li>
                            </>
                          ) : (
                            ""
                          )}

                          {rulesName != "sales" ? (
                            <>
                              <li className="nav-item">
                                <NavLink
                                  className="nav-link menu-link"
                                  exact="true"
                                  to="/so"
                                >
                                  <i className="ri-list-check-2"></i>{" "}
                                  <span data-key="t-widgets">
                                    Service Order
                                  </span>
                                </NavLink>
                              </li>
                            </>
                          ) : (
                            ""
                          )}

                          {rulesName == "superadmin" ? (
                            <li className="nav-item">
                              <a
                                className="nav-link menu-link"
                                href="#sidebarDtUserManagement"
                                data-bs-toggle="collapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="sidebarDtUserManagement"
                              >
                                <i className="ri-shield-user-line"></i>{" "}
                                <span data-key="t-dashboards">
                                  User Management
                                </span>
                              </a>
                              <div
                                className="collapse menu-dropdown"
                                id="sidebarDtUserManagement"
                              >
                                <ul className="nav nav-sm flex-column">
                                  <li className="nav-item">
                                    <a href="/users" className="nav-link">
                                      {" "}
                                      List User
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="dropdown ms-sm-3 header-item topbar-user">
                  <button
                    type="button"
                    className="btn"
                    id="page-header-user-dropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="d-flex align-items-center">
                      <img
                        className="rounded-circle header-profile-user"
                        src={domain + "/" + avaProfile}
                        alt="Header Avatar"
                      />
                      <span className="text-start ms-xl-2">
                        <span className="d-none d-xl-inline-block ms-1 fw-semibold user-name-text">
                          {personName}
                        </span>
                        <span className="d-none d-xl-block ms-1 fs-13 user-name-sub-text">
                          {rulesName}
                        </span>
                      </span>
                    </span>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {personName}!</h6>
                    <a
                      className={`dropdown-item ${
                        rulesName === "sales" ? "" : "d-none"
                      }`}
                      href="/profile"
                    >
                      <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>{" "}
                      <span className="align-middle">Profile</span>
                    </a>{" "}
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
                      <span className="align-middle" data-key="t-logout">
                        Logout
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="app-menu navbar-menu" style={{ overflow: "auto" }}>
          <div className="navbar-brand-box">
            <a href="index.html" className="logo logo-dark">
              <span className="logo-sm">
                <img src={domain + "/" + logoWL} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={domain + "/" + logoWL} alt="" height="17" />
              </span>
            </a>
            <a href="index.html" className="logo logo-light">
              <span className="logo-sm">
                <img src={domain + "/" + logoWL} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={domain + "/" + logoWL} alt="" height="17" />
              </span>
            </a>
            <button
              type="button"
              className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
              id="vertical-hover"
            >
              <i className="ri-record-circle-line"></i>
            </button>
          </div>

          <div id="scrollbar">
            <div className="container-fluid">
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <li
                  className="menu-title mb-2"
                  style={{ background: "rgb(229, 231, 235)", color: "#000" }}
                >
                  <span>
                    <img
                      src={domain + "/assets/images/icon_wijaya.png"}
                      alt=""
                      height="20"
                    />{" "}
                    {usrCabangName}
                  </span>
                </li>

                {rulesName == "mra" ? (
                    <>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link menu-link"
                          exact="true"
                          to="/dashboard/mra"
                        >
                          <i className="ri-dashboard-line"></i>{" "}
                          <span data-key="t-widgets">
                            Dashboard MRA
                          </span>
                        </NavLink>
                      </li>
                    </>
                  ) : (
                    ""
                  )
                }

                {rulesName == "sales" ? (
                  <>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link menu-link"
                        exact="true"
                        to="/dashboard/sales"
                      >
                        <i className="ri-dashboard-line"></i>{" "}
                        <span data-key="t-widgets">Dashboard Sales</span>
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className={`nav-item`}>
                      <NavLink
                        className={`nav-link menu-link ${rulesName == "stock" || rulesName == "mra" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}
                        exact="true"
                        to="/dashboard"
                      >
                        <i className="ri-dashboard-line"></i>{" "}
                        <span data-key="t-widgets">Dashboard</span>
                      </NavLink>
                    </li>
                  </>
                )}

                {rulesName != "stock" && rulesName != "do" && rulesName != "afi" ? (
                    <>

                      <li className="menu-title">
                        <span data-key="t-menu">Customers</span>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link menu-link"
                          exact="true"
                          to="/datacustomers"
                        >
                          <i className="ri-honour-line"></i>{" "}
                          <span data-key="t-widgets">Database Customers</span>
                        </NavLink>
                      </li>

                    </>
                ) : (
                  ""
                )}

                {rulesName != "kacab" && rulesName != "crc" && rulesName != 'sas' ? (
                  <li className="nav-item">
                    <NavLink
                      className={`nav-link menu-link ${rulesName == "stock" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}
                      exact="true"
                      to="/customers/bucket"
                    >
                      <i className="ri-indent-increase"></i>{" "}
                      <span data-key="t-widgets">Sharing Data Bucket</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
                {/* <li className="nav-item"><NavLink className="nav-link menu-link"exact="true" to="/ulangtahun"><i className="ri-cake-line"></i> <span data-key="t-widgets">List Ulang Tahun</span></NavLink></li> */}
                <li className={`menu-title ${rulesName == "stock" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}>
                  <span data-key="t-menu">List</span>
                </li>
                {rulesName != "mra" ? (
                  <li className="nav-item">
                    <NavLink
                      className={`nav-link menu-link ${rulesName == "stock" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}
                      exact="true"
                      to="/do"
                    >
                      <i className="ri-indent-increase"></i>{" "}
                      <span data-key="t-widgets">Delivery Order</span>
                    </NavLink>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link menu-link"
                        exact="true"
                        to="/services/attacklist"
                      >
                        <i className="ri-file-list-3-fill"></i>{" "}
                        <span data-key="t-widgets">Attacklist</span>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link menu-link"
                        exact="true"
                        to="/wablast"
                      >
                        <i className="ri-whatsapp-line"></i>{" "}
                        <span data-key="t-widgets">WA Blast</span>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link menu-link"
                        exact="true"
                        to="/reason"
                      >
                        <i className="ri-list-check-2"></i>{" "}
                        <span data-key="t-widgets">Master Reason</span>
                      </NavLink>
                    </li>
                  </>
                )}

                {rulesName != "spv" && rulesName != "kacab" ? (
                  <>
                    <li className={`menu-title ${rulesName == "stock" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}>
                      <span data-key="t-menu">Service</span>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link ${rulesName == "stock" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}
                        exact="true"
                        to="/input/servicepertama"
                      >
                        <i className="ri-file-list-3-fill"></i>{" "}
                        <span data-key="t-widgets">Service Pertama</span>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link ${rulesName == "stock" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}
                        exact="true"
                        to="/services/booking"
                      >
                        <i className="ri-file-list-3-fill"></i>{" "}
                        <span data-key="t-widgets">Service Lainnya</span>
                      </NavLink>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {rulesName == "crc" ? (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link menu-link"
                      exact="true"
                      to="/list/bstb"
                    >
                      <i className="ri-file-list-3-fill"></i>{" "}
                      <span data-key="t-widgets">DEC Tracking by BSTB</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                {rulesName == "superadmin" ? (
                  <>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link menu-link"
                        exact="true"
                        to="/services/attacklist"
                      >
                        <i className="ri-file-list-3-fill"></i>{" "}
                        <span data-key="t-widgets">Attacklist</span>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link menu-link"
                        exact="true"
                        to="/wablast"
                      >
                        <i className="ri-whatsapp-line"></i>{" "}
                        <span data-key="t-widgets">WA Blast</span>
                      </NavLink>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {rulesName != "sales" ? (
                  <>
                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link ${rulesName == "stock" || rulesName == "do" || rulesName == "afi" ? 'd-none' : ''}`}
                        exact="true"
                        to="/so"
                      >
                        <i className="ri-list-check-2"></i>{" "}
                        <span data-key="t-widgets">Service Order</span>
                      </NavLink>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {rulesName == "superadmin" ? (
                  <li className="nav-item">
                    <a
                      className="nav-link menu-link"
                      href="#sidebarDtUserManagement"
                      data-bs-toggle="collapse"
                      role="button"
                      aria-expanded="false"
                      aria-controls="sidebarDtUserManagement"
                    >
                      <i className="ri-shield-user-line"></i>{" "}
                      <span data-key="t-dashboards">User Management</span>
                    </a>
                    <div
                      className="collapse menu-dropdown"
                      id="sidebarDtUserManagement"
                    >
                      <ul className="nav nav-sm flex-column">
                        <li className="nav-item">
                          <a href="/users" className="nav-link">
                            {" "}
                            List User
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  ""
                )}

                {rulesName == "stock" ? (
                  <>
                    <li className={`menu-title`}>
                      <span data-key="t-menu">Stock Manager</span>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/stock/masterdata"
                      >
                        <i className="ri-database-2-line"></i>{" "}
                        <span data-key="t-widgets">Master Data</span>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/stock/input"
                      >
                        <i className="ri-list-check-2"></i>{" "}
                        <span data-key="t-widgets">Input Data</span>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/stock/validasi/matching"
                      >
                        <i className="ri-checkbox-circle-line"></i>{" "}
                        <span data-key="t-widgets">Validasi Matching Unit</span>
                      </NavLink>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {rulesName == "sales" || rulesName == "spv"  || rulesName == "superadmin" || rulesName == "stock" ? (
                    <>
                    <li className={`menu-title`}>
                      <span data-key="t-menu">SPK</span>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/spk/list"
                      >
                        <i className="ri-list-check-2"></i>{" "}
                        <span data-key="t-widgets">List SPK</span>
                      </NavLink>
                    </li>
                  </>
                  ) : ("")
                }

                {rulesName == "do" ? (
                    <>
                    <li className={`menu-title`}>
                      <span data-key="t-menu">DO</span>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/validasi/do/internal"
                      >
                        <i className="ri-list-check-2"></i>{" "}
                        <span data-key="t-widgets">Validasi DO INTERNAL</span>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/validasi/do/fisik"
                      >
                        <i className="ri-list-check-2"></i>{" "}
                        <span data-key="t-widgets">Validasi DO FISIK</span>
                      </NavLink>
                    </li>
                  </>
                  ) : ("")
                }

                {rulesName == "afi" ? (
                    <>
                    <li className={`menu-title`}>
                      <span data-key="t-menu">AFI</span>
                    </li>

                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/validasi/afi"
                      >
                        <i className="ri-list-check-2"></i>{" "}
                        <span data-key="t-widgets">Validasi AFI</span>
                      </NavLink>
                    </li>
                  </>
                  ) : ("")
                }

                {rulesName == "spv" || rulesName == "superadmin" || rulesName == "stock" ? (
                    <>
                    <li className="nav-item">
                      <NavLink
                        className={`nav-link menu-link`}
                        exact="true"
                        to="/spk/pengajuancancel"
                      >
                        <i className="ri-forbid-line"></i>{" "}
                        <span data-key="t-widgets">Pengajuan Cancel SPK</span>
                      </NavLink>
                    </li>
                  </>
                  ) : ("")
                }


                          
                  <>
                    <li className="menu-title">
                      <span data-key="t-menu">Stock</span>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link menu-link"
                        exact="true"
                        to="/stock/list"
                      >
                        <i className="ri-dashboard-line"></i>{" "}
                        <span data-key="t-widgets">
                          Stock Kendaraan
                        </span>
                      </NavLink>
                    </li>
                  </>

              </ul>
            </div>
          </div>
        </div>
        <div className="vertical-overlay"></div>
        <div className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/datacustomers" element={<DataCustomers />}></Route>
            <Route path="/ulangtahun" element={<Ulangtahun />}></Route>
            <Route path="/do" element={<Do />}></Route>
            <Route path="/so" element={<So />}></Route>
            <Route path="/car/list" element={<Carlist />}></Route>
            <Route path="/services/input" element={<Services />}></Route>
            <Route path="/services/attacklist" element={<Attacklist />}></Route>
            <Route path="/list/bstb" element={<Bstb />}></Route>
            <Route
              path="/input/servicepertama"
              element={<Servicepertama />}
            ></Route>
            <Route path="/customers/bucket" element={<Bucket />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/services/booking" element={<Nextservices />}></Route>
            <Route path="/wablast" element={<Wablast />}></Route>
            <Route path="/reason" element={<Reason />}></Route>
            <Route path="/dashboard/sales" element={<DashboardSales />}></Route>
            <Route path="/users" element={<Users />}></Route>
            <Route path="/dashboard/mra" element={<DashboardMra />}></Route>
            <Route path="/stock/overview" element={<Overview />}></Route>
            <Route path="/stock/input" element={<Inputstock />}></Route>
            <Route path="/stock/masterdata" element={<Onhand />}></Route>
            <Route path="/spk/list" element={<List />}></Route>
            <Route path="/spk/inputspk" element={<Inputspk />}></Route>
            <Route path="/stock/list" element={<Liststock />}></Route>
            <Route path="/spk/pengajuancancel" element={<Pengajuancancel />}></Route>
            <Route path="/validasi/do/fisik" element={<Validasido />}></Route>
            <Route path="/stock/validasi/matching" element={<Validasimatching />}></Route>
            <Route path="/validasi/do/internal" element={<Validasiinternal />}></Route>
            <Route path="/validasi/afi" element={<Validasiafi />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
