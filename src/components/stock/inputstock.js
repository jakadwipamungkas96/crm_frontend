import React from 'react';

function Inputstock() {
    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Input Stock</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="#">Stock</a></li>
                                    <li className="breadcrumb-item active"><a href="#">Input Stock</a></li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="card-title mb-0">Metode Input Stock</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: "15px" }}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <ul className="nav nav-tabs mb-3 text-center" role="tablist">
                                            <li className="nav-item col-md-6">
                                                <a className="nav-link active" data-bs-toggle="tab" href="#import" role="tab" aria-selected="false">
                                                    Import
                                                </a>
                                            </li>
                                            <li className="nav-item col-md-6">
                                                <a className="nav-link" data-bs-toggle="tab" href="#formInput" role="tab" aria-selected="false">
                                                    Form Input
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="tab-content text-muted">
                                            <div className="tab-pane active" id="import" role="tabpanel">
                                                <button type="button" class="btn btn-outline-success waves-effect waves-light">Download Template Excel</button>

                                                <div className="row mt-3">

                                                    <div className="col-md-6">
                                                        <label for="formFile" class="form-label">Pilih File</label>
                                                        <input class="form-control" type="file" id="formFile" />
                                                    </div>
                                                    
                                                    <div className="col-md-6">
                                                        <label for="formFile" class="form-label">Pilih Kategori Stock</label>
                                                        <select class="form-select mb-3" aria-label="Default select example">
                                                            <option selected>-- Pilih --</option>
                                                            <option value="ON HAND">ON HAND</option>
                                                            <option value="BARTER CABANG">Barter Cabang</option>
                                                            <option value="BARTER DEALER">Barter Dealer</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-12 text-end">
                                                        <button type="button" class="btn btn-sm btn-primary waves-effect waves-light">Simpan</button>
                                                    </div>

                                                </div>


                                            </div>
                                            <div className="tab-pane" id="formInput" role="tabpanel">
                                                <div className="row mt-3">

                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="tgl">Tanggal</label>
                                                                <input type="date" class="form-control" name="tanggal" id="tanggal" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="type">Type</label>
                                                                <input type="text" class="form-control" name="type" id="type" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="frameNo">Frame No</label>
                                                                <input type="text" class="form-control" name="frameNo" id="frameNo" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="enginePrefixNo">Engine Prefix No</label>
                                                                <input type="text" class="form-control" name="enginePrefixNo" id="enginePrefixNo" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="modelCodeKatashiki">Model Code Katashiki</label>
                                                                <input type="text" class="form-control" name="modelCodeKatashiki" id="modelCodeKatashiki" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="sfx">SFX</label>
                                                                <input type="text" class="form-control" name="sfx" id="sfx" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="karoseriCode">Karoseri Code</label>
                                                                <input type="text" class="form-control" name="karoseriCode" id="karoseriCode" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="karoseriName">Karoseri Name</label>
                                                                <input type="text" class="form-control" name="karoseriName" id="karoseriName" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="colorExterior">Color Exterior</label>
                                                                <input type="text" class="form-control" name="colorExterior" id="colorExterior" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="colorInterior">Color Interior</label>
                                                                <input type="text" class="form-control" name="colorInterior" id="colorInterior" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="color">Color</label>
                                                                <input type="text" class="form-control" name="color" id="color" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="warna">Warna</label>
                                                                <input type="text" class="form-control" name="warna" id="warna" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="distributionPrice">Distribution Price</label>
                                                                <input type="number" class="form-control" name="distributionPrice" id="distributionPrice" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="salesTax">Sales Tax</label>
                                                                <input type="number" class="form-control" name="salesTax" id="salesTax" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="luxuryTax">Luxury Tax</label>
                                                                <input type="number" class="form-control" name="luxuryTax" id="luxuryTax" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="cancellDo">Cancel DO</label>
                                                                <input type="text" class="form-control" name="cancellDo" id="cancellDo" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="doNo">DO NO</label>
                                                                <input type="text" class="form-control" name="doNo" id="doNo" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="filler">Filler</label>
                                                                <input type="text" class="form-control" name="filler" id="filler" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="doDate">DO Date</label>
                                                                <input type="date" class="form-control" name="doDate" id="doDate" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="registrationLine">Registration Line</label>
                                                                <input type="text" class="form-control" name="registrationLine" id="registrationLine" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="keyNo">Key No</label>
                                                                <input type="text" class="form-control" name="keyNo" id="keyNo" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="paymentCode">Payment Code</label>
                                                                <input type="text" class="form-control" name="paymentCode" id="paymentCode" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="priceType">Price Type</label>
                                                                <input type="text" class="form-control" name="priceType" id="priceType" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="dueDate">Due Date</label>
                                                                <input type="date" class="form-control" name="dueDate" id="dueDate" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="resFlag">Res Flag</label>
                                                                <input type="text" class="form-control" name="resFlag" id="resFlag" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="daCancelNo">Da Cancel No</label>
                                                                <input type="text" class="form-control" name="daCancelNo" id="daCancelNo" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="daNo">Da No</label>
                                                                <input type="text" class="form-control" name="daNo" id="daNo" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="wmiCode">WMI Code</label>
                                                                <input type="text" class="form-control" name="wmiCode" id="wmiCode" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="zoneCode">Zone Code</label>
                                                                <input type="text" class="form-control" name="zoneCode" id="zoneCode" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="branchCode">Branch Code</label>
                                                                <input type="text" class="form-control" name="branchCode" id="branchCode" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="destinationCode">Destination Code</label>
                                                                <input type="text" class="form-control" name="destinationCode" id="destinationCode" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="doNoTent">Do No Tent</label>
                                                                <input type="text" class="form-control" name="doNoTent" id="doNoTent" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="doTentDate">Do Tent Date</label>
                                                                <input type="date" class="form-control" name="doTentDate" id="doTentDate" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="rrn">RRN</label>
                                                                <input type="text" class="form-control" name="rrn" id="rrn" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="advFlag">Adv Flag</label>
                                                                <input type="text" class="form-control" name="advFlag" id="advFlag" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="mainDealer">Main Dealer</label>
                                                                <input type="text" class="form-control" name="mainDealer" id="mainDealer" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="discountPrice">Discount Price</label>
                                                                <input type="number" class="form-control" name="discountPrice" id="discountPrice" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="intColorName">Int Color Name</label>
                                                                <input type="text" class="form-control" name="intColorName" id="intColorName" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="standardPrice">Standard Price</label>
                                                                <input type="number" class="form-control" name="standardPrice" id="standardPrice" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="reffNo">Reff No</label>
                                                                <input type="text" class="form-control" name="reffNo" id="reffNo" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="wpbt">WPBT</label>
                                                                <input type="number" class="form-control" name="wpbt" id="wpbt" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="vat">VAT</label>
                                                                <input type="number" class="form-control" name="vat" id="vat" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="wpat">WPAT</label>
                                                                <input type="number" class="form-control" name="wpat" id="wpat" required />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="pph22">PPH 22</label>
                                                                <input type="number" class="form-control" name="pph22" id="pph22" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="cabang">Cabang</label>
                                                                <select type="text" class="form-control" name="cabang" id="cabang" required>
                                                                    <option value="">--SELECT CABANG--</option>
                                                                    <option value="WLD">WLD</option>
                                                                    <option value="WLP">WLP</option>
                                                                    <option value="WLS">WLS</option>
                                                                    <option value="WML">WML</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="noPinjaman">No Pinjaman</label>
                                                                <input type="text" class="form-control" name="noPinjaman" id="noPinjaman" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="outstanding">Outstanding</label>
                                                                <input type="text" class="form-control" name="outstanding" id="outstanding" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="tglAkseptasi">Tanggal Akseptasi</label>
                                                                <input type="date" class="form-control" name="tglAkseptasi" id="tglAkseptasi" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="tglJatuhTempo">Tanggal Jatuh Tempo</label>
                                                                <input type="date" class="form-control" name="tglJatuhTempo" id="tglJatuhTempo" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="persenBunga">Persen Bunga</label>
                                                                <input type="text" class="form-control" name="persenBunga" id="persenBunga" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="bunga">Bunga</label>
                                                                <input type="text" class="form-control" name="bunga" id="bunga" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="">
                                                                <label for="pokokBunga">Pokok Bunga</label>
                                                                <input type="text" class="form-control" name="pokokBunga" id="pokokBunga" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2 mb-4">
                                                            <div class="">
                                                                <label for="selisih">Selisih</label>
                                                                <input type="text" class="form-control" name="selisih" id="selisih" />
                                                            </div>
                                                        </div>

                                                    <div className="col-md-12 text-end">
                                                        <button type="button" class="btn col-md-12 btn-sm btn-primary waves-effect waves-light">Simpan</button>
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
        </div>
    );
}

export default Inputstock;
