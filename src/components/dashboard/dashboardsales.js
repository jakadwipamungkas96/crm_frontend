import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Modal from 'react-modal';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog, DialogContent, Slide } from '@mui/material';
import swal from 'sweetalert';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DashboardSales = () => {

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

    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (arg) => {
        // Store the clicked event in state
        setSelectedEvent(arg.event);
    };

    const closeModal = () => {
        // Clear the selected event when the modal is closed
        setSelectedEvent(null);
    };

    // const [events, setEvents] = useState([
    //     { title: 'Birthday', start: '2024-02-22', type: 'birthday' },
    //     { title: 'STNK Expiry', start: '2024-02-23', type: 'stnk' },
    //     { title: 'Service Date', start: '2024-02-26', end: '2024-02-26', type: 'service' }
    // ]);

    const [events, setEvents] = useState([]);
    const [refreshDt, setRefresh] = useState();
    const token = localStorage.getItem("strtkn") == null ? "" : CryptoJS.AES.decrypt(localStorage.getItem("strtkn"), "w1j4y4#t0y0T4").toString(CryptoJS.enc.Utf8);
    const idCab = JSON.parse(localStorage.getItem("id_cabang"));
    const [inputCabang, setInputCabang] = useState(idCab);
    const rulesName = JSON.parse(localStorage.getItem("rules"));

    const eventTypeLegends = [
        { type: 'birthday', color: '#2563EB', label: 'Birthday' },
        { type: 'stnk', color: '#FACC15', label: 'STNK Expiry' },
        { type: 'service', color: '#16A34A', label: 'Service Date' },
        { type: 'LOW', color: '#94A3B8', label: 'Level Task Low' },
        { type: 'MEDIUM', color: '#DB2777', label: 'Level Task Medium' },
        { type: 'HIGH', color: '#DC2626', label: 'Level Task High' },
        { type: 'Buckets', color: '#7E22CE', label: 'Klaim Buckets' },
    ];

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        const getData = async () => {
            const url = `http://127.0.0.1:8000/api/calendar/agenda`;
            try {
                const response = await axios.get(url);
                setEvents(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [refreshDt]);

    // Custom function to render event content with different colors based on the event type
    const eventContent = (arg) => {
        let eventColor = '';

        switch (arg.event.extendedProps.type) {
            case 'birthday':
                eventColor = '#2563EB';
                break;
            case 'stnk':
                eventColor = '#FACC15';
                break;
            case 'service':
                eventColor = '#16A34A';
                break;
            case 'LOW':
                eventColor = '#94A3B8';
                break;
            case 'MEDIUM':
                eventColor = '#DB2777';
                break;
            case 'HIGH':
                eventColor = '#DC2626';
                break;
            case 'Buckets':
                eventColor = '#7E22CE';
                break;
            default:
                eventColor = 'gray';
        }

        return (
            <>
                <style>
                    {`
                        .fc-event {
                            background-color: transparent !important;
                        }
                    `}
                </style>
                <div
                    className="custom-event"
                    style={{ backgroundColor: eventColor, textAlign: "left" }}
                    onClick={() => handleEventClick(arg)}
                >
                    <span style={{ marginLeft: "10px", marginBottom: "2px", fontSize: "10px" }}>{arg.event.title}</span>
                </div>
            </>
        );
    };

    const [isOpenForm, setOpenForm] = useState(false);
    const [taskDesc, settaskDesc] = useState();
    const [taskDate, settaskDate] = useState();
    const [taskDateEnd, settaskDateEnd] = useState();
    const [taskLevel, settaskLevel] = useState();
    const [inputTask, setInputTask] = useState([]);
    const calendarRef = useRef(null);

    const handleInputTask = (event) => {
        settaskDesc(event.target.value);
        setInputTask((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleInputTaskDate = (event) => {
        settaskDate(event.target.value);
        setInputTask((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleInputTaskDateEnd = (event) => {
        settaskDateEnd(event.target.value);
        setInputTask((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleInputTaskLevel = (event) => {
        settaskLevel(event.target.value);
        setInputTask((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    }

    const handleOpenFormTask = (event) => {
        setOpenForm(true);
    }

    const closeForm = (event) => {
        setOpenForm(false);
    }

    const handleSubmitTask = (event) => {
        event.preventDefault();
        
        axios
            .post("http://127.0.0.1:8000/api/calendar/add/task", inputTask)
            .then(function (response) {
                if (response.data.error == true) {
                    
                    swal("Error", 'Data tidak boleh kosong!', "error", {
                        buttons: false,
                        timer: 2000,
                    });
                } else {
                    
                    swal("Success", 'Data Berhasil disimpan!', "success", {
                        buttons: false,
                        timer: 2000,
                    });

                }
                setOpenForm(false);
                setInputTask([]);
                setRefresh(new Date());
            });
    }

    const handleWindowResize = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().updateSize(); // Update calendar size on window resize
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize); // Add event listener for window resize
        return () => {
            window.removeEventListener('resize', handleWindowResize); // Remove event listener on component unmount
        };
    }, []);

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0">Dashboard Sales</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item active">
                                            <div id="" style={{ background: "#CBD5E1", fontSize: "10px", color: "#0F172A" }} className='p-2'>
                                                Tanggal: <b>{tanggalFormat}</b>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12 col-md-12 bg-white p-3">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {eventTypeLegends.map((legend) => (
                                        <li key={legend.type} style={{ display: 'inline-block', marginRight: '10px', fontSize: "12px" }}>
                                            <div
                                                style={{
                                                    width: '40px',
                                                    height: '10px',
                                                    backgroundColor: legend.color,
                                                    marginRight: '5px',
                                                    display: 'inline-block',
                                                }}
                                            ></div>
                                            {legend.label}
                                        </li>
                                    ))}
                                </ul>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item active">
                                            <button style={{ fontSize: "10px" }} className='p-2 btn btn-sm btn-primary' onClick={handleOpenFormTask}>
                                                Add Task
                                            </button>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* Set the height of the FullCalendar component */}
                            <FullCalendar
                                ref={calendarRef}
                                aspectRatio={2}
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                events={events}
                                eventClick={handleEventClick}
                                eventContent={eventContent}
                                height="500px" // Adjust the height as needed
                            />
                        </div>
                    </div>
                </div>

                {/* Modal for displaying event details */}
                <Modal
                    isOpen={selectedEvent !== null}
                    onRequestClose={closeModal}
                    contentLabel="Event Details"
                >
                    <h2>{selectedEvent?.title}</h2>
                    <p>Date: {selectedEvent?.start?.toLocaleDateString()}</p>
                    <button onClick={closeModal}>Close</button>
                </Modal>
            </div>
            {/* Start Import  */}
            <Dialog
                open={isOpenForm}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="xl"
                onClose={closeForm}
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
                                                    <h5 className="card-title mb-0" style={{ fontSize: "17px" }}>Add To Do List </h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-2">
                                                            <div className="form-floating">
                                                                <input type="text" className="form-control form-control-sm" onChange={handleInputTask} value={taskDesc} placeholder="Task Description" name="title" />
                                                                <label htmlFor="task_desc">Task Description</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-floating">
                                                                <input type="date" className="form-control form-control-sm" placeholder="Task Date" onChange={handleInputTaskDate} value={taskDate} name="tanggal_awal" />
                                                                <label htmlFor="task_date">Pilih Tanggal Awal</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <div className="form-floating">
                                                                <input type="date" className="form-control form-control-sm" placeholder="Task Date" onChange={handleInputTaskDateEnd} value={taskDateEnd} name="tanggal_akhir" />
                                                                <label htmlFor="task_date">Pilih Tanggal Akhir</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 mb-2">
                                                            <div className="form-floating">
                                                                <select type="text" className="form-control form-control-sm" placeholder="Task Date" onChange={handleInputTaskLevel} value={taskLevel} name="type">
                                                                    <option value={'LOW'}>LOW</option>
                                                                    <option value={'MEDIUM'}>MEDIUM</option>
                                                                    <option value={'HIGH'}>HIGH</option>
                                                                </select>
                                                                <label htmlFor="task_date">Pilih Level Task</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                                <div className="text-end">
                                                                    <button onClick={handleSubmitTask} className="btn btn-primary btn-label btn-sm" ><i className="ri-save-3-line label-icon align-middle fs-16 me-2"></i> Save</button>
                                                                    <button onClick={closeForm} className="btn btn-danger btn-label btn-sm" style={{ marginLeft: "5px" }}><i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i> Cancel</button>
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
                </DialogContent>
            </Dialog>
            {/* End Import */}
        </>
    );
};

export default DashboardSales;
