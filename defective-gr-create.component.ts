import { Component, OnInit } from '@angular/core';
import { DefectiveGoodsPickListService } from '../services/defectiveGoods.service';
import {
  MMGRNPricing, GRN_MM_MAT_TRANS_T, MM_MATSRNO_TRAN_T, MM_MATERIAL_H,
  MM_BYPRODUCT_T, MM_RECEIPT_CLASSIFICATION_T, VW_MM_GRN_JOB_T, MM_RECEIPT_CLASSIFICATION_T_SRNO
} from '@app/models/crm/defective-goods-receipt/defective-goods-receipt.model';
import { PlantDetails } from '@app/core/DataModels';
import { SessionService } from '@app/core/services/SessionService';
import { Router } from '@angular/router';
import { GoodsReceiptService } from '@app/modules/material-management/mm-goods-receipt/goods-receipt/services/goodsreceipt.service';
import { ConstantVariables } from '@app/shared/constants/constants.service';
import { ToastTypes } from '@app/shared/constants/toasts.service';
import { DefectiveGoodsPickList } from '@app/models/crm/defective-goods-receipt/defectivegoodreceipt.model';
@Component({
  selector: 'ems-defective-gr-create',
  templateUrl: './defective-gr-create.component.html',
  styleUrls: ['./defective-gr-create.component.scss'],
  providers: [GoodsReceiptService]
})
export class DefectiveGrCreateComponent implements OnInit {
  mmDefectiveGR: MMGRNPricing;
  isReadOnly: boolean;
  isHeaderHide = false;
  isTransHide = true;
  isSerialMgnHide = true;
  display = false;
  buttonSaveHide: boolean;
  defectiveGoodsPickList: DefectiveGoodsPickList;
  plantDetails: PlantDetails;
  date: any;
  toastType: string;
  message: string;
  tanstEntry: boolean;
  equalHide: boolean;
  prfixmfg: boolean;
  applymfgsrno: boolean;
  equalDistribution: boolean;
  SrNoFrom: number;
  SrNoQty: number;
  SrNoTo: number;
  SrNoWeight: number;
  SrNoPreFix: number;
  srnoCalculation: boolean;
  matSrnoTForm: MM_MATSRNO_TRAN_T[];
  serialMgn: boolean;
  matH: MM_MATERIAL_H;
  mat: GRN_MM_MAT_TRANS_T;
  submit: boolean;
  specificationData: any;
  pieChartData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  };
  ActiveMatRow: GRN_MM_MAT_TRANS_T;
  serialMGN: boolean;
  srNoMatResponse = [];
  matsrnoClose: boolean;
  grnTableValid: boolean;
  DOC_ITEM_NO: number;
  serialmgnvalid = false;
  constructor(
    private defectiveGoodsPickListService: DefectiveGoodsPickListService,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.pieChartData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    };
    this.serialMgn = false;
    this.serialMGN = false;
    this.matsrnoClose = true;
    this.DOC_ITEM_NO = 0;
    this.plantDetails = this.sessionService.getPlantDetails();
    this.date = new Date();
    this.initialLoad();
  }
  initialLoad() {
    this.mmDefectiveGR = new MMGRNPricing();
    this.mmDefectiveGR.MM_MATERIAL_H = new Array<MM_MATERIAL_H>();
    this.matH = new MM_MATERIAL_H();
    this.mmDefectiveGR.CompanyCode = this.plantDetails.companyCode;
    this.mmDefectiveGR.FiscalYearCode = this.plantDetails.FinancialYear;
    this.mmDefectiveGR.FiscalYear = this.plantDetails.FinancialYear;
    this.mmDefectiveGR.Plant = this.plantDetails.plantCode;
    this.mmDefectiveGR.PlantDH = this.plantDetails.plantCode;
    this.mmDefectiveGR.UserID = this.plantDetails.userId;
    this.mat = new GRN_MM_MAT_TRANS_T();
    this.mmDefectiveGR.PoDate = new Date();
    this.matH.PLANT_CODE = Number(this.plantDetails.plantCode);
    this.matH.FYEAR = Number(this.plantDetails.FinancialYear);
    this.matH.EXCHANGE_RATE = ConstantVariables.exchange_rate;
    this.matH.CURRENCY_CODE = ConstantVariables.currency_code;
    this.defectiveGoodsPickListService.Defaultget().subscribe(res => {
      if (
        res['Data'].VW_GL_DEFAULTSETTINGS_C !== null &&
        res['Data'].VW_GL_DEFAULTSETTINGS_C !== undefined
      ) {
        this.mmDefectiveGR.AccCostCenter = '';
        this.mmDefectiveGR.AccBArea = '';
        this.mmDefectiveGR.COACode = ConstantVariables.coacode;
      }
    });
    this.defectiveGoodsPickListService.getJsonData().subscribe(res => {
      this.defectiveGoodsPickList = res;
    });
    this.mmDefectiveGR.DocDate = this.date;
    this.mmDefectiveGR.PostingDate = this.date;
    this.mmDefectiveGR.BillDate = this.date;
    this.mmDefectiveGR.DelChallanDate = this.date;
    this.mmDefectiveGR.TransID = ConstantVariables.transid_defectivegoods;
    this.getReceiptClassification();
    this.equalHide = true;
    this.prfixmfg = true;
    this.submit = false;
  }
  ngOnInit() { }
  getReceiptClassification() {
    this.defectiveGoodsPickListService
      .getRecieptClassification(
        this.plantDetails.companyCode,
        this.plantDetails.plantCode
      )
      .subscribe(res => {
        this.mmDefectiveGR.MM_RECEIPT_CLASSIFICATION_T_SRNO =
          res['Data'].MM_RECEIPT_CLASSIFICATION_T_SRNO;
      });
  }
  valid() {
    return (!this.buttonSaveHide);
  }
  SelectedCustomerno(event) {
    this.mmDefectiveGR.Customer = event.SelectedId;
    this.matH.CUSTOMER_NO = event.SelectedId;
    this.matH.CUSTOMER_NAME = event.SelectedText;
    this.matH.PRICING_PROC = event.SelectedExtraOne;
  }
  getMatDetails(event, rowData, index) {
      const obj = {
      MatCode: event[0].MAT_CODE,
      CompanyCode: Number(this.plantDetails.companyCode),
      PlantCode: Number(this.plantDetails.plantCode),
      TransID: ConstantVariables.transid_defectivegoods,
      Vendor: this.mmDefectiveGR.Vendor
    };
    this.defectiveGoodsPickListService.process(obj).subscribe(res => {
      if (res.IsSucess && res.Data.Table.length > 0) {
        for (const key in res.Data.Table[0]) {
          if (res.Data.Table[0].hasOwnProperty(key)) {
            if (res.Data.Table[0][key] !== null) {
              this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[index][key] =
                res.Data.Table[0][key];
              this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[index].MAT_DESC =
                res.Data.Table[0]['DESCRIPTION'];
            }
          }
        }
        this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[index].EXPIRY_DATE = new Date();
        this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[index].STKTYPE_CODE = ConstantVariables.stk_type;
        this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[index].SELECT = true;
      } else {
      this.ShowToastMessages('Error', 'item does not exist');
      }
    });
  }
  ShowToastMessages(type, message) {
    this.toastType = type;
    this.message = message;
  }
  backData() {
    this.isHeaderHide = false;
    this.isTransHide = true;
  }
  backTo() {
    this.isTransHide = false;
    this.isSerialMgnHide = true;
  }
  backClassData() {
    this.isHeaderHide = !this.isHeaderHide;
  }
  selectedTableRefData(event, rowData, index) {
    this.getMatDetails(event, rowData, index);
    }
  getGrnNo() {
    if (this.mmDefectiveGR) {
      this.mmDefectiveGR.DocNo = '';
      this.mmDefectiveGR.GRN_MM_MAT_TRANS_T = [];
      this.mmDefectiveGR.MM_MATERIAL_H = [];
      this.mmDefectiveGR.MM_MATERIAL_H.push(this.matH);
      this.defectiveGoodsPickListService
        .getGrnNoDetails(this.mmDefectiveGR)
        .subscribe(
          res => {
            if (res['Data'].PrevGRNNo && res['Data'].CurrentGRNNO) {
              for (const key in this.mmDefectiveGR) {
                if (key in this.mmDefectiveGR === key in res['Data']) {
                  this.mmDefectiveGR[key] = res['Data'][key];
                  this.mmDefectiveGR.DelChallanDate = new Date();
                  this.mmDefectiveGR.DocDate = new Date();
                  this.mmDefectiveGR.PostingDate = new Date();
                  this.mmDefectiveGR.BillDate = new Date();
                }
              }
              this.mmDefectiveGR.MovementType = res['Data'].MoveCode;
              this.mmDefectiveGR.MM_MATERIAL_H[0].MOVETYPE_CODE =
                res['Data'].MoveCode;
              this.mmDefectiveGR.CurrentGRNNO = res['Data'].CurrentGRNNO;
              this.mmDefectiveGR.PrevGRNNo = res['Data'].PrevGRNNo;
              this.mmDefectiveGR.PricingCode = ConstantVariables.pricing_code;
              this.mmDefectiveGR.MoveCode = res['Data'].MoveCode;
              this.mmDefectiveGR.PurchaseGroup = '';
              this.mmDefectiveGR.Purchaseorganisation = '';
              this.mmDefectiveGR.PurOrDD = null;
              this.mmDefectiveGR.RequisitionType = null;
              this.mmDefectiveGR.StrogeLocation = ConstantVariables.storage_location;
              this.mmDefectiveGR.DocType = res['Data'].DocType;
              this.mmDefectiveGR.BaseCurrency = ConstantVariables.base_currency;
              this.mmDefectiveGR.DocCurrency = ConstantVariables.doc_currency;
              this.mmDefectiveGR.MM_MATERIAL_H[0].CUSTOMER_NO = this.matH.CUSTOMER_NO;
              this.mmDefectiveGR.MM_MATERIAL_H[0].CUSTOMER_NAME = this.matH.CUSTOMER_NAME;
              this.defectiveGoodsPickListService
                .customerNextDetails(this.mmDefectiveGR)
                .subscribe(
                  res => {
                    if (res['Data'] !== null && res['IsSucess']) {
                      this.isTransHide = false;
                      this.isHeaderHide = true;
                      const matTransT = new GRN_MM_MAT_TRANS_T();
                      this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.push(matTransT);
                      this.mmDefectiveGR.MM_GRN_HEADER_TAX_T =
                        res.Data.MM_GRN_HEADER_TAX_T;
                      for (const key in res.Data.GRN_MM_MAT_TRANS_T[0]) {
                        if (
                          res.Data.GRN_MM_MAT_TRANS_T[0].hasOwnProperty(key)
                        ) {
                          if (res.Data.GRN_MM_MAT_TRANS_T[0][key] !== null) {
                            this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[0][key] =
                              res.Data.GRN_MM_MAT_TRANS_T[0][key];
                          }
                        }
                      }
                      if (this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.length === 0) {
                        const matTransT = new GRN_MM_MAT_TRANS_T();
                        this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.push(matTransT);
                      }
                    }
                  },
                  err => {
                    this.toastType = ToastTypes.errorType;
                    this.message = err.error.ExceptionMessage;
                  }
                );
            } else {
              this.toastType = ToastTypes.errorType;
              this.message = res['Data'].Message;
            }
          },
          err => {
            this.toastType = ToastTypes.errorType;
            this.message = err.error.ExceptionMessage;
          }
        );
    }
  }
  next() {
    if (this.mmDefectiveGR.Vendor && this.mmDefectiveGR.DelChallanNo) {
      this.getGrnNo();
      } else {
      this.submit = true;
    }
  }
  Popupdata() {
    this.mat = this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.find(
      t => t.ENTRY_QTY > 0 && String(t.ENTRY_QTY) !== '' && t.ENTRY_QTY !== null
    );
    if (this.mat !== undefined) {
      this.serialMgn = true;
      this.serialMgnData();
    } else {
      this.toastType = ToastTypes.warnType;
      this.message = 'Enter MRN Quantity';
    }
  }
  save() {
    this.defectiveGoodsPickListService.Save(this.mmDefectiveGR).subscribe(
      res => {
        if (res.IsSucess) {
          this.toastType = ToastTypes.successType;
          this.message = res.Data;
          this.buttonSaveHide = false;
          this.sessionService.setSession(
            'Defective Goods Recipt',
            this.message
          );
          setTimeout(() => {
            this.router.navigate(['dt/SR/crm/defective-gr/list']);
          }, 3000);
        } else {
          this.toastType = ToastTypes.errorType;
          this.message = res.Message;
          this.isReadOnly = false;
        }
      },
      err => {
        this.toastType = ToastTypes.errorType;
        this.message = err.error.ExceptionMessage;
      }
    );
  }
  AcceptDelete(index) {
    this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.splice(index, 1);
  }
  AddMaterialList() {
    const newMat = new GRN_MM_MAT_TRANS_T();
    newMat.DOC_ITEM_NO = (this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.length + 1) * 10;
    this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.push(newMat);
  }
  RowClick(data: GRN_MM_MAT_TRANS_T, index) {
    if (
      data.MAT_CODE !== undefined &&
      data.MAT_CODE !== null &&
      data.MAT_CODE !== '' &&
      (data.ENTRY_QTY !== undefined &&
        data.ENTRY_QTY !== null &&
        String(data.ENTRY_QTY) !== '')
    ) {
      this.serialMgn = false;
      this.serialMGN = false;
      this.ActiveMatRow = data;
    }
  }
  ChangeQty(item, index) {
    if (item.SERIAL_IND) {
      if (item.BASE_UOM === item.SERIAL_UOM) {
        item.SERIAL_QTY = Number(item.ENTRY_QTY);
      } else {
        this.toastType = ToastTypes.warnType;
        this.message = `Base UOM and Serial UOM is different. Please enter Serial Quantity manually for item no ${
          item.DOC_ITEM_NO
          }`;
      }
    }
    if (item.BASE_UOM === item.SERIAL_UOM) {
      item.QTY = Number(item.ENTRY_QTY);
    } else {
      item.NUMERATOR = item.NUMERATOR === 0 ? 1 : item.NUMERATOR;
      item.DENOMINATOR = item.DENOMINATOR === 0 ? 1 : item.DENOMINATOR;
      item.QTY =
        (Number(item.QTY) * Number(item.DENOMINATOR)) / Number(item.NUMERATOR);
    }
    item.PO_QTY = Number(item.ENTRY_QTY);
    item.RECD_QTY = Number(item.ENTRY_QTY);
    item.MAX_QTY = Number(item.ENTRY_QTY);
    item.W_QTY = Number(item.ENTRY_QTY);
    item.ENTRY_QTY = Number(item.ENTRY_QTY);
    item.CUSTOMER_NO = this.matH.CUSTOMER_NO;
    this.LinePricingData(item);
  }
  process() {
    if (
      this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.length > 0 &&
      this.mmDefectiveGR.MM_MATSRNO_TRAN_T.length > 0
    ) {
      if (this.validsrmgn()) {
        this.defectiveGoodsPickListService
          .processDetails(this.mmDefectiveGR)
          .subscribe(
            res => {
              if (res['Data'] !== null) {
                this.mmDefectiveGR.ProcessFlag = true;
                this.mmDefectiveGR.MM_GRN_HEADER_TAX_T =
                  res.Data.MM_GRN_HEADER_TAX_T;
                if (res['Data'].MM_PUR_REQ_HISTORY_T.length) {
                  this.mmDefectiveGR.MM_PUR_REQ_HISTORY_T =
                    res['Data'].MM_PUR_REQ_HISTORY_T;
                }
                if (res['Data'].VW_MM_GRN_JOB_T.length) {
                  this.mmDefectiveGR.VW_MM_GRN_JOB_T =
                    res['Data'].VW_MM_GRN_JOB_T;
                }
                this.isReadOnly = true;
                this.buttonSaveHide = true;
              } else {
                this.toastType = ToastTypes.warnType;
                this.message = res['Message'];
              }
            },
            err => {
              this.toastType = ToastTypes.errorType;
              this.message = err.error.ExceptionMessage;
            }
          );
      } else {
        this.toastType = ToastTypes.warnType;
        this.message = 'MRN Quantity and serial management Quantity is not equal';
      }
     } else {
      this.toastType = ToastTypes.warnType;
      this.message = 'Serial Management is Not Found For Selected Line Item';
    }
  }
  LinePricingData(element) {
    const obj = {
      CompnayCode: this.plantDetails.plantCode,
      PricingCode: ConstantVariables.pricing_code,
      ItemNo: element.DOC_ITEM_NO,
      Qty: element.ENTRY_QTY,
      ExchangeRate: ConstantVariables.exchange_rate,
      BaseCurrency: ConstantVariables.base_currency,
      MM_MATERIAL_H: this.mmDefectiveGR.MM_MATERIAL_H,
      GRN_MM_MAT_TRANS_T: this.mmDefectiveGR.GRN_MM_MAT_TRANS_T,
      MM_GRPRICING_T: this.mmDefectiveGR.MM_GRPRICING_T
    };
    this.defectiveGoodsPickListService
      .getLinePricingData(obj)
      .subscribe(res => {
        this.mmDefectiveGR.MM_GRPRICING_T = res['Data'].MM_GRPRICING_T;
      });
  }
  selectedStatus(event) {
    this.toastType = '';
    this.message = '';
  }
  specification() {
    if (this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[0].SELECT === true) {
      if (this.mmDefectiveGR.rbWithoutRef === true) {
        const obj = {
          MatCode: this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[0].MAT_CODE,
          DocItemNo: this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[0].DOC_ITEM_NO,
          sCompany: this.plantDetails.companyCode,
          sPlant: this.plantDetails.plantCode,
          MM_RECEIPT_CLASSIFICATION_T: this.mmDefectiveGR
            .MM_RECEIPT_CLASSIFICATION_T
        };
        this.defectiveGoodsPickListService
          .processSpecification(obj)
          .subscribe(res => {
            this.specificationData = res['Data'].MM_RECEIPT_CLASSIFICATION_T;
          });
        this.mmDefectiveGR.MM_RECEIPT_CLASSIFICATION_T = this.specificationData.filter(
          ele =>
            ele.DOC_ITEM_NO ===
            this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[0].DOC_ITEM_NO
        );
      } else {
        this.mmDefectiveGR.MM_RECEIPT_CLASSIFICATION_T = this.mmDefectiveGR.MM_RECEIPT_CLASSIFICATION_T.filter(
          (obj, j) => {
            this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.forEach((ele, k) => {
              if (obj.DOC_NO === ele.DOC_NO) {
                return;
              }
            });
          }
        );
      }
      if (this.mmDefectiveGR.MM_RECEIPT_CLASSIFICATION_T.length !== 0) {
        this.mmDefectiveGR.MM_RECEIPT_CLASSIFICATION_T[0].CLASS_CODE = this.mmDefectiveGR.MM_RECEIPT_CLASSIFICATION_T[0].CLASS_CODE;
      } else {
        this.toastType = ToastTypes.warnType;
        this.message =
          'Batch Classification is Not Maintain for The Selected Material';
      }
    } else {
      this.toastType = ToastTypes.warnType;
      this.message = 'Line Item Is Not Selected';
    }
  }
  selectedBack(event) {
    setTimeout(() => {
      this.toastType = event.warn;
      this.message = event.message;
      this.serialMGN = event.serialmgn;
      if (event.type === 'close') {
        this.matSrnoTForm = event.matsrnoform;
        const temparray = this.srNoMatResponse;
        if (temparray.length > 0) {
          this.srNoMatResponse = this.srNoMatResponse.filter(element1 => {
            return element1.DOC_ITEM_NO !== this.matSrnoTForm[0].DOC_ITEM_NO;
          });
        }
        this.srNoMatResponse = this.srNoMatResponse.concat(this.matSrnoTForm);
        this.mmDefectiveGR.MM_MATSRNO_TRAN_T = this.srNoMatResponse;
        this.matsrnoClose = false;
        this.isSerialMgnHide = false;
        this.isTransHide = true;
        this.serialMgn = false;
       }
    }, 300);
  }
  selectDamageInd(event, i) {
    if (event === true) {
      this.mmDefectiveGR.MM_MATSRNO_TRAN_T[i].DAMAGE_IND = true;
      this.mmDefectiveGR.MM_MATSRNO_TRAN_T[i].SHORTAGE_IND = false;
    }
  }
  selectShortageInd(event, i) {
    if (event === true) {
      this.mmDefectiveGR.MM_MATSRNO_TRAN_T[i].SHORTAGE_IND = true;
      this.mmDefectiveGR.MM_MATSRNO_TRAN_T[i].DAMAGE_IND = false;
    }
  }
  serialMgnData() {
    this.serialMGN = false;
    this.grnTableValid = this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.some(
      ele => ele.SELECT === true
    );
    if (this.grnTableValid) {
      for (
        let i = 0;
        i <= this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.length - 1;
        i++
      ) {
        if (this.DOC_ITEM_NO === this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[i].DOC_ITEM_NO) {
          if (this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[i].SELECT === true) {
            this.serialMgn = true;
            this.serialMGN = true;
            break;
          } else {
            this.toastType = ToastTypes.warnType;
            this.message = 'Please Select Item for Proccess';
          }
        }
      }
    } else {
      this.toastType = ToastTypes.warnType;
      this.message = 'Please Select At Least One Item for Proccess';
    }
  }

  selectSerialRowData(event, i) {
    this.serialMgn = false;
    this.serialMGN = false;
    this.DOC_ITEM_NO = 0;
    this.DOC_ITEM_NO = event.DOC_ITEM_NO;
  }
  serialMgnSelect(event, rowData) {
    if (event === true) {
      this.mmDefectiveGR.MM_MATSRNO_TRAN_T.forEach((ele, i) => {
        if (ele.SRNO === rowData.SRNO) {
          Object.assign(this.mmDefectiveGR.MM_MATSRNO_TRAN_T[i], rowData);
        }
      });
    } else {
    }
  }
  validsrmgn() {
    this.serialmgnvalid = false;
    for (
      let i = 0;
      i <= this.mmDefectiveGR.GRN_MM_MAT_TRANS_T.length - 1;
      i++
    ) {
      if (Number(this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[i].ENTRY_QTY)
        === this.mmDefectiveGR.MM_MATSRNO_TRAN_T.filter(ele => ele.DOC_ITEM_NO ===
          this.mmDefectiveGR.GRN_MM_MAT_TRANS_T[i].DOC_ITEM_NO).length) {
        this.serialmgnvalid = true;
      } else {
        this.serialmgnvalid = false;
        break;
      }
    }
    return this.serialmgnvalid;
  }
}
