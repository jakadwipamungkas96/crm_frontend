import React, { useEffect, useState } from "react";
import axios from 'axios';
import TableContainer from "@mui/material/TableContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@mui/styles';

// Modal Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

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

function Ulangtahun() {
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

    const [dataProspek, setDataProspek] = useState([]);
    const [dataProspek2, setDataProspek2] = useState([]);
    const [refreshDt, setRefresh] = useState();
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const token = localStorage.getItem("access_token");
    
    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/area/sales/datacustomer?page=${page}&size=${pageSize}`;
            try {

                const response = await axios.get(url);
                setDataProspek(response.data.data);
                setDataProspek2(response.data);
                setLoading(false);

            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [page, pageSize, refreshDt]);

    const [rowCountState, setRowCountState] = React.useState(
        dataProspek2?.totalAll || 0
    );

    React.useEffect(() => {
        setRowCountState((prevRowCountState) =>
            dataProspek2?.totalAll !== undefined
                ? dataProspek2?.totalAll
                : prevRowCountState
        );
    }, [dataProspek2?.totalAll, setRowCountState]);


    const [openCustCard, setopenCustCard] = React.useState(false);
    const [nameCustomer, setNameCustomer] = React.useState();
    const [singleIdNo, setSingleIdNo] = React.useState();
    const handleOpenCardCustomer = (event) => {
        console.log(event);
        setopenCustCard(true);
        setNameCustomer(event.nama_customer);
        setSingleIdNo(event.single_id);
    }
    const handleClose = () => setopenCustCard(false);

    const columns = [
        {
            field: "Kendaraan Dimiliki",
            renderCell: (cellEdit) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                            handleOpenCardCustomer(cellEdit.row);
                        }}
                        style={{
                            fontSize: "10px"
                        }}
                    >
                        List Kendaraan
                    </Button>
                );
            },
            minWidth: 200,
        },
        { field: "single_id", headerName: "Single ID", minWidth: 250 },
        { field: "no_rangka", headerName: "No Rangka", minWidth: 250 },
        { field: "nama_customer", headerName: "Customer", minWidth: 250 },
        { field: "nama_stnk", headerName: "Nama STNK", minWidth: 250 },
        { field: "alamat", headerName: "Alamat", minWidth: 250 },
        { field: "kecamatan", headerName: "Kecamatan", minWidth: 250 },
        { field: "telp", headerName: "Telepon", minWidth: 250 },
        { field: "email", headerName: "Email", minWidth: 250 },
        { field: "tipe", headerName: "Kendaraan", minWidth: 250 },
        { field: "asuransi", headerName: "Asuransi", minWidth: 250 },
        { field: "asuransi_type", headerName: "Tipe Asuransi", minWidth: 250 },
        { field: "ket", headerName: "Keterangan", minWidth: 250 },
    ];
    const columnsCustCar = [
        { field: "no_rangka", headerName: "VIN", minWidth: 250 },
        { field: "nama_stnk", headerName: "Nama STNK", minWidth: 200 },
        { field: "no_pol", headerName: "No Polisi", minWidth: 100 },
        { field: "tipe", headerName: "Kendaraan", minWidth: 100 },
        { field: "asuransi", headerName: "Asuransi", minWidth: 250 },
        { field: "asuransi_type", headerName: "Tipe Asuransi", minWidth: 250 },
        { field: "ket", headerName: "Keterangan", minWidth: 250 },
    ];

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Database Customers</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">Customers</a></li>
                                    <li className="breadcrumb-item active">Database Customers</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className='col-xl-12 col-md-12'>
                        <div className="card overflow-hidden">
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-1 mt-2">
                                                    <label htmlFor="nameInput" className="form-label">Filter</label>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input type="date" className="form-control" id="nameInput" placeholder="Enter your name" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" style={{background: "#CBD5E1", fontSize: "10px"}} className='p-2'>
                                            Tanggal: <b>{tanggalFormat}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6 col-md-6">
                        <div className="card card-animate overflow-hidden">
                            <div className="position-absolute start-0" style={{zIndex: 0}}>
                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                    <path id="Shape 8" className="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                                </svg>
                            </div>
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="text-uppercase fw-medium text-truncate mb-3">Reminder Ulang Tahun</p>
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-0"><span>0 <sup style={{fontSize: '12px'}}>Customers</sup></span></h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id=""><img src="assets/images/icon_wijaya.png" alt="" height="50" style={{opacity: 0.5}} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-6">
                        <div className="card card-animate overflow-hidden">
                            <div className="position-absolute start-0" style={{zIndex: 0}}>
                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                                    <path id="Shape 8" className="s0" d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z" />
                                </svg>
                            </div>
                            <div className="card-body" style={{zIndex: 1}}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="text-uppercase fw-medium text-truncate mb-3">Reminder STNK<br/></p>
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-0"><span>0 <sup style={{fontSize: '12px'}}>Customers</sup></span></h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id=""><img src="assets/images/icon_wijaya.png" alt="" height="50" style={{opacity: 0.5}} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                {/* <h5 className="card-title mb-0">List Data Customer</h5> */}
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="card-title mb-0">List Data Customer</h5> 
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div id="" className='p-2'>
                                            <button className="btn btn-sm btn-success">Export Excel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{padding: "5px"}}>
                                <TableContainer style={{ height: 500, width: "100%", fontSize: "10px" }} className="p-1 mb-2">
                                    <DataGrid
                                        rows={dataProspek}
                                        rowCount={rowCountState}
                                        loading={isLoading}
                                        components={{ Toolbar: GridToolbar }}
                                        componentsProps={{
                                            toolbar: {
                                                showQuickFilter: true,
                                                quickFilterProps: { debounceMs: 500 },
                                            },
                                        }}
                                        disableColumnFilter
                                        disableColumnSelector
                                        disableDensitySelector
                                        rowsPerPageOptions={[25, 50, 100]}
                                        pagination
                                        page={page}
                                        pageSize={pageSize}
                                        paginationMode="server"
                                        onPageChange={(newPage) => setPage(newPage)}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        columns={columns}
                                        className={classes.noTableHover}
                                    />
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Start Modal Customer Card */}
            <Dialog
                    open={openCustCard}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="xl"
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    style={{ width: "90%", margin: "0 auto" }}
                >
                    <DialogContent style={{
                        // borderLeft: "5px solid #c23616",
                        background: "#ecf0f1"
                        // borderRight: "5px solid #c23616",
                    }}>
                        <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-xxl-4">
                                    <div className="card">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img className="rounded-start img-fluid h-100 object-fit-cover" src="assets/images/users/avatar-6.jpg" alt="Card image" />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-header">
                                                    <h5 className="card-title mb-0">{nameCustomer} <i className="ri-checkbox-circle-fill text-success"></i></h5>
                                                    <span className="card-title mb-0" style={{fontSize: "12px"}}><i className="ri-shield-user-fill"></i> {singleIdNo}</span>
                                                </div>
                                                <div className="card-body">
                                                    <p className="card-text mb-2">Jl. Ir. H. Juanda No.131, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132</p>
                                                    <p className="card-text"><span className="text-dark"><i className="ri-car-washing-fill"></i> <b>1</b> Total Kendaraan</span></p>
                                                    {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-8">
                                    <div className="card">
                                        <div className="row g-0">
                                            <div className="col-md-12">
                                                <div className="card-header">
                                                    <h5 className="card-title mb-0">Data Kendaraan</h5>
                                                </div>
                                                <div className="card-body">
                                                    <TableContainer style={{ height: 200, width: "100%", fontSize: "10px" }} className="p-1 mb-2">
                                                        <DataGrid
                                                            rows={dataProspek}
                                                            rowCount={rowCountState}
                                                            loading={isLoading}
                                                            componentsProps={{
                                                                toolbar: {
                                                                    showQuickFilter: true,
                                                                    quickFilterProps: { debounceMs: 500 },
                                                                },
                                                            }}
                                                            disableColumnFilter
                                                            disableColumnSelector
                                                            disableDensitySelector
                                                            rowsPerPageOptions={[25, 50, 100]}
                                                            pagination
                                                            page={page}
                                                            pageSize={pageSize}
                                                            paginationMode="server"
                                                            onPageChange={(newPage) => setPage(newPage)}
                                                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                            columns={columnsCustCar}
                                                            className={classes.noTableHover}
                                                        />
                                                    </TableContainer>
                                                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
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
            {/* End Modal Customer Card */}
        </div>
    );
}

export default Ulangtahun;
