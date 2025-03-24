import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "react-select2-wrapper/css/select2.css";
import swal from "sweetalert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

function Pengajuancancel() {
  // Format tanggal dengan format "DD/MM/YYYY"
  const [refreshDt, setRefresh] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState();
  const [searchText, setSearchText] = useState("");
  const [lsDtStock, setLsDtStock] = useState([]);
  
  const rulesName = JSON.parse(localStorage.getItem("rules"));
  const token =
    localStorage.getItem("strtkn") == null
      ? ""
      : CryptoJS.AES.decrypt(
          localStorage.getItem("strtkn"),
          "w1j4y4#t0y0T4"
        ).toString(CryptoJS.enc.Utf8);
  const [openPengajuanCancel, setOpenPengajuanCancel] = useState(false);
  const [arrPengajuan, setArrPengajuan] = useState({
    id: "",
    validasi_pengajuan: "",
  });
  const [nomorSpk, setNomorSpk] = useState("");
  const [showbtn, setShowBtn] = useState(true);
  const [approveModal, setApproveModal] = useState(false);

  useEffect(() => {
    setLoadingTable(true);
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    const getData = async () => {
      const url = `https://api.crm.wijayatoyota.co.id/api/spk/list/pengajuan?page=${page}&size=${pageSize}`;
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
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(30, 41, 59, 0.5)",
              color: "white",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5000,
            }}
          >
            <img
              src="/assets/images/icon_wijaya.png"
              style={{ opacity: 0.8 }}
              alt=""
              height="50"
            />
            <br />
            <br />
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
    setPage(page + 1);
  };

  const handlePageChangePrev = () => {
    setPage(page - 1);
  };

  const [approveID, setApproveID] = useState();
  const [approveNoSpk, setApproveNoSpk] = useState();
  const [approveReasonCancel, setApproveReasonCancel] = useState();

  const showApprove = (id, no_spk, reason_cancel) => {
    setApproveID(id);
    setApproveNoSpk(no_spk);
    setApproveReasonCancel(reason_cancel);
    setApproveModal(true);
    setArrPengajuan((prevInput) => ({
      ...prevInput,
      ["id"]: id,
    }));
  };

  function closeModal() {
    setApproveModal(false);
  }

  const showTrack = (id) => {
    console.log(id);
  };

  const handleSubmitValidasi = async () => {
    try {
      const response = await axios.post(
        `https://api.crm.wijayatoyota.co.id/api/spk/pengajuan/validasi`,
        arrPengajuan
      );

      if (response.data.status == "success") {
        setLoading(false);

        swal("Success", response.data.msg, "success", {
          buttons: false,
          timer: 2000,
        });

        window.location.href = "/spk/pengajuancancel";
      } else {
        setLoading(false);

        swal("Error", response.data.msg, "error", {
          buttons: false,
          timer: 2000,
        });
        window.location.href = "/spk/pengajuancancel";
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const columnsLsStock =
    rulesName === "spv"
      ? [
          {
            name: "ID",
            selector: (row) => <span style={{}}>{row.id}</span>,
            sortable: true,
            width: "80px",
          },
          {
            name: "Pengajuan Cancel",
            selector: (row) => {
              if (row.status_pengajuan_cancel === "waiting") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-light text-body">
                      <i className="mdi mdi-circle-medium"></i> Waiting
                    </span>
                  </>
                );
              } else if (row.status_pengajuan_cancel === "reject") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-danger">
                      <i className="mdi mdi-circle-medium"></i> Rejected
                    </span>
                  </>
                );
              } else if (row.status_pengajuan_cancel === "approve") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-success">
                      <i className="mdi mdi-circle-medium"></i> Approved
                    </span>
                  </>
                );
              }
            },
            sortable: true,
            width: "150px",
          },
          {
            name: "Reason Cancel",
            selector: (row) => <span style={{}}>{row.reason_cancel}</span>,
            sortable: true,
            width: "200px",
          },
          {
            name: "Matching Status",
            selector: (row) => {
              if (row.matching_status === "waiting") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-light text-body">
                      <i className="mdi mdi-circle-medium"></i> Waiting
                    </span>
                  </>
                );
              } else if (row.matching_status === "match") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-success">
                      <i className="mdi mdi-circle-medium"></i> Match
                    </span>
                  </>
                );
              } else if (row.matching_status === "unmatch") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-danger">
                      <i className="mdi mdi-circle-medium"></i> Not Match
                    </span>
                  </>
                );
              }
            },
            sortable: true,
            width: "150px",
          },
          {
            name: "Status SPK",
            selector: (row) => {
              if (row.status === "waiting") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-light text-body">
                      <i className="mdi mdi-circle-medium"></i> Waiting
                    </span>
                  </>
                );
              } else if (row.status === "approve") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-success">
                      <i className="mdi mdi-circle-medium"></i> Approve
                    </span>
                  </>
                );
              } else if (row.status === "cancel") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-danger">
                      <i className="mdi mdi-circle-medium"></i> Cancel
                    </span>
                  </>
                );
              }
            },
            sortable: true,
            width: "150px",
          },
          {
            name: "NO SPK",
            selector: (row) => <span style={{}}>{row.no_spk}</span>,
            sortable: true,
            width: "150px",
          },
          {
            name: "Tanggal SPK",
            selector: (row) => <span style={{}}>{row.tgl_spk}</span>,
            sortable: true,
            width: "150px",
          },
          {
            name: "Nama Customer",
            selector: (row) => (
              <>
                <span style={{}}>{row.nama_customer}</span>
                <br />
                <span>{row.single_id}</span>
              </>
            ),
            sortable: true,
            width: "200px",
          },
          {
            name: "Nama STNK",
            selector: (row) => <span style={{}}>{row.nama_stnk}</span>,
            sortable: true,
            width: "200px",
          },
        ]
      : [
          {
            name: "ID",
            selector: (row) => <span style={{}}>{row.id}</span>,
            sortable: true,
            width: "80px",
          },
          {
            name: "Aksi",
            selector: (row) => {
              if (rulesName === "stock") {
                if (row.status_pengajuan_cancel === "waiting") {
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          showApprove(row.id, row.no_spk, row.reason_cancel);
                        }}
                        className="btn btn-sm btn-info"
                      >
                        <i className="ri ri-more-fill"></i> Validasi Pengajuan
                      </button>
                    </>
                  );
                } else {
                  return (
                    <>
                      <button
                        type="button"
                        disabled
                        className="btn btn-sm btn-info"
                      >
                        <i className="ri ri-more-fill"></i> Validasi Pengajuan
                      </button>
                    </>
                  );
                }
              }
            },
            sortable: true,
            width: "200px",
          },
          {
            name: "Pengajuan Cancel",
            selector: (row) => {
              if (row.status_pengajuan_cancel === "waiting") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-light text-body">
                      <i className="mdi mdi-circle-medium"></i> Waiting
                    </span>
                  </>
                );
              } else if (row.status_pengajuan_cancel === "reject") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-danger">
                      <i className="mdi mdi-circle-medium"></i> Rejected
                    </span>
                  </>
                );
              } else if (row.status_pengajuan_cancel === "approve") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-success">
                      <i className="mdi mdi-circle-medium"></i> Approved
                    </span>
                  </>
                );
              }
            },
            sortable: true,
            width: "150px",
          },
          {
            name: "Reason Cancel",
            selector: (row) => <span style={{}}>{row.reason_cancel}</span>,
            sortable: true,
            width: "200px",
          },
          {
            name: "Matching Status",
            selector: (row) => {
              if (row.matching_status === "waiting") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-light text-body">
                      <i className="mdi mdi-circle-medium"></i> Waiting
                    </span>
                  </>
                );
              } else if (row.matching_status === "match") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-success">
                      <i className="mdi mdi-circle-medium"></i> Match
                    </span>
                  </>
                );
              } else if (row.matching_status === "unmatch") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-danger">
                      <i className="mdi mdi-circle-medium"></i> Not Match
                    </span>
                  </>
                );
              }
            },
            sortable: true,
            width: "150px",
          },
          {
            name: "Status SPK",
            selector: (row) => {
              if (row.status === "waiting") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-light text-body">
                      <i className="mdi mdi-circle-medium"></i> Waiting
                    </span>
                  </>
                );
              } else if (row.status === "approve") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-success">
                      <i className="mdi mdi-circle-medium"></i> Approve
                    </span>
                  </>
                );
              } else if (row.status === "cancel") {
                return (
                  <>
                    <span className="sticky-column badge badge-label bg-danger">
                      <i className="mdi mdi-circle-medium"></i> Cancel
                    </span>
                  </>
                );
              }
            },
            sortable: true,
            width: "150px",
          },
          {
            name: "NO SPK",
            selector: (row) => <span style={{}}>{row.no_spk}</span>,
            sortable: true,
            width: "150px",
          },
          {
            name: "Tanggal SPK",
            selector: (row) => <span style={{}}>{row.tgl_spk}</span>,
            sortable: true,
            width: "150px",
          },
          {
            name: "Nama Customer",
            selector: (row) => (
              <>
                <span style={{}}>{row.nama_customer}</span>
                <br />
                <span>{row.single_id}</span>
              </>
            ),
            sortable: true,
            width: "200px",
          },
          {
            name: "Nama STNK",
            selector: (row) => <span style={{}}>{row.nama_stnk}</span>,
            sortable: true,
            width: "200px",
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
        borderRadius: "5px",
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

  const showModalSpk = () => {
    window.location.href = "/spk/inputspk";
  };

  const showModalCancel = () => {
    setOpenPengajuanCancel(true);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setArrPengajuan((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <CustomBlockingOverlay isLoading={loading}></CustomBlockingOverlay>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body" style={{ padding: "15px" }}>
                <div className="row">
                  <div className="col-md-12">
                    {loadingTable ? (
                      <div className="text-center ">
                        <i
                          className="mdi mdi-spin mdi-loading"
                          style={{ fontSize: "30px", color: "#991B1B" }}
                        ></i>{" "}
                        <h6 className="m-0 loading-text">Please wait...</h6>
                      </div>
                    ) : (
                      <>
                        <div className="row mt-2">
                          <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                              <h4 className="mb-sm-0">
                                List Pengajuan Cancel SPK
                              </h4>

                              <div className="page-title-right">
                                <div
                                  className="btn-toolbar"
                                  role="toolbar"
                                  aria-label="Toolbar with button groups"
                                >
                                  <div
                                    className="btn-group btn-group-md"
                                    role="group"
                                    aria-label="Basic example"
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-light btn-md"
                                    >
                                      Total Data
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-light btn-md"
                                    >
                                      {totalRows}
                                    </button>
                                  </div>
                                  &nbsp;
                                  <div
                                    className="btn-group me-2"
                                    role="group"
                                    aria-label="First group"
                                  >
                                    <select
                                      aria-label="Rows per page:"
                                      className="form-select"
                                      defaultValue={pageSize}
                                      onChange={handleRowsPerPageChange}
                                    >
                                      <option value="10">10</option>
                                      <option value="20">20</option>
                                      <option value="30">30</option>
                                    </select>
                                    &nbsp;
                                    <button
                                      type="button"
                                      onClick={handlePageChangePrev}
                                      className="btn btn-light btn-md"
                                    >
                                      <i className="ri-arrow-left-s-line"></i>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handlePageChange}
                                      className="btn btn-light btn-md"
                                    >
                                      <i className="ri-arrow-right-s-line"></i>
                                    </button>
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

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={approveModal}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            closeModal();
          }
        }}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={approveModal}>
          <Box sx={style}>
            <div className="row mb-3">
              <div className="col-lg-12 col-md-12">
                <h4>Validasi Pengajuan</h4>
              </div>
              <div className="col-lg-12 col-md-12 mt-3">
                <span className="mt-2">
                  <b>NO SPK:</b> <br />
                </span>
                <span className="mt-2">{approveNoSpk}</span>
                <br></br>
                <span className="mt-2">
                  <b>Reason Pengajuan Cancel:</b> <br />
                </span>
                <span className="mt-2">{approveReasonCancel}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 mb-3">
                <div className="form-floating">
                  <select
                    type="text"
                    className="form-control form-control-sm form-select"
                    onChange={handleChangeInput}
                    name="validasi_pengajuan"
                    id="validasi_pengajuan"
                    placeholder=""
                    required
                  >
                    <option value={""}>-- Pilih Status --</option>
                    <option value={"approve"}>Approve</option>
                    <option value={"reject"}>Reject</option>
                  </select>
                  <label htmlFor="validasi_pengajuan">
                    Silahkan Pilih Status
                  </label>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mb-3 text-end">
                <div class="btn-group" role="group" aria-label="Basic example">
                  <button
                    onClick={handleSubmitValidasi}
                    className="btn btn-sm btn-success waves-effect waves-light"
                  >
                    Save
                  </button>
                  <button
                    onClick={closeModal}
                    className="btn btn-sm btn-dark waves-effect waves-light"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default Pengajuancancel;
