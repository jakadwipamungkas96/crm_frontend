import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Modal from 'react-modal';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog, DialogContent, Slide } from '@mui/material';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';
import * as am5 from "@amcharts/amcharts5";
import am5index from "@amcharts/amcharts5/index";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DashboardMra = () => {

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

    useEffect(() => {
        // Create root element
        let root = am5.Root.new("chartdiv");

        // Themes begin
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create chart
        let chart = root.container.children.push(am5percent.SlicedChart.new(root, {
            layout: root.verticalLayout
        }));

        // Create series
        let series = chart.series.push(am5percent.FunnelSeries.new(root, {
            alignLabels: false,
            orientation: "vertical",
            valueField: "value",
            categoryField: "category"
        }));

        series.slices.template.setAll({
            strokeOpacity: 0,
            fillGradient: am5.LinearGradient.new(root, {
                rotation: 0,
                stops: [{ brighten: -0.4 }, { brighten: 0.4 }, { brighten: -0.4 }]
            })
        });

        series.data.setAll([
            { value: 10, category: "Database Call-Out" },
            { value: 9, category: "Connected" },
            { value: 6, category: "Contacted" },
            { value: 5, category: "CAI" },
        ]);

        series.appear();

        // Create legend
        let legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50,
            marginTop: 15,
            marginBottom: 15
        }));
        legend.data.setAll(series.dataItems);

        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0">Dashboard MRA Funneling</h4>

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
                            <div className="row">
                                <div className='col-md-2'>
                                    <table className='table text-center'>
                                        <tr>
                                            <td style={{background: "#EAB308"}}>TARGET</td>
                                            <td style={{background: "#EAB308"}}>%</td>
                                        </tr>
                                        <tr>
                                            <td style={{background: "#000000"}}>&nbsp;</td>
                                            <td style={{background: "#000000"}}>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>100</td>
                                            <td style={{background: "#000000"}}></td>
                                        </tr>
                                        <tr>
                                            <td>90</td>
                                            <td>90%</td>
                                        </tr>
                                        <tr>
                                            <td>90</td>
                                            <td>100%</td>
                                        </tr>
                                        <tr>
                                            <td>50</td>
                                            <td>56%</td>
                                        </tr>
                                    </table>
                                </div>

                                <div className='col-md-6'>
                                    <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
                                </div>

                                <div className='col-md-2'>
                                    <table className='table text-center'>
                                        <tr>
                                            <td style={{background: "#10B981"}}>ACTUAL</td>
                                            <td style={{background: "#10B981"}}>%</td>
                                        </tr>
                                        <tr>
                                            <td>1749</td>
                                            <td style={{background: "#000000"}}>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>1749</td>
                                            <td>100%</td>
                                        </tr>
                                        <tr>
                                            <td>1199</td>
                                            <td>69%</td>
                                        </tr>
                                        <tr>
                                            <td>703</td>
                                            <td>59%</td>
                                        </tr>
                                        <tr>
                                            <td>346</td>
                                            <td>29%</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardMra;
