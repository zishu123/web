
import { Component, OnInit, Input } from '@angular/core';
import { IssueToCustomerService } from '../services/issueTocustomer.service';
import {
  CRMMMDamageService,
  DS_MM_GRN_HEADER_TAX_T,
  DS_MM_GRPRICING_T,
  DS_MM_MATERIAL_H,
  DS_MM_MATSRNO_TRAN_T,
  DS_MM_MAT_TRANS_T
} from '@app/models/crm/issue-to-customer/issue-to-customer.model';
// import { IssueToCustomerPickList } from '../models/isuueToPicklist.model';
import { SessionService } from '@app/core/services/SessionService';
import { PlantDetails } from '@app/core/DataModels';
import { HttpClient } from '@angular/common/http';
import { ConstantVariables } from '@app/shared/constants/constants.service';
import { ToastTypes } from '@app/shared/constants/toasts.service';
import { IssueToCustomerPickList } from '@app/models/crm/issue-to-customer/isuueToPicklist.model';

@Component({
  selector: 'ems-issue-to-customer-create',
  templateUrl: './issue-to-customer-create.component.html',
  styleUrls: ['./issue-to-customer-create.component.scss'],
  providers: [IssueToCustomerService]

})
export class IssueToCustomerCreateComponent implements OnInit {

  damageService: CRMMMDamageService;
  dS_MM_GRN_HEADER_TAX_T: DS_MM_GRN_HEADER_TAX_T;
  dS_MM_GRPRICING_T: DS_MM_GRPRICING_T;
  dS_MM_MATERIAL_H: DS_MM_MATERIAL_H;
  dS_MM_MATSRNO_TRAN_T: DS_MM_MATSRNO_TRAN_T;
  dS_MM_MAT_TRANS_T: DS_MM_MAT_TRANS_T;
  issueCustomerPicklist: IssueToCustomerPickList;
  Srnodata = [];
  result: any;
  Submitted = false;
  hidden = true;
  isHidden = true;
  dataHidden = true;
  grnHidden = true;
  ifHidden = true;
  hide = false;
  submit = false;
  plantDetails: PlantDetails;
  picklist: any = [];
  custnumber: any;
  curDate: any;
  toastType: string;
  message: string;
  multiplepo = false;
  singlepodiv = false;
  matselect: DS_MM_MAT_TRANS_T;
  mathidden = false;
  @Input() TransId: string;
  BATCH_NO: string;
  onsave = false;
  saveData: void;
  select = false;

  constructor(private issueToCustomerService: IssueToCustomerService, private sessionService: SessionService,
    private http: HttpClient) {


  }
  onSave() {
    this.onsave = false;
  }

  ngOnInit() {
    this.damageService = new CRMMMDamageService();
    this.dS_MM_GRN_HEADER_TAX_T = new DS_MM_GRN_HEADER_TAX_T();
    this.dS_MM_GRPRICING_T = new DS_MM_GRPRICING_T();
    this.dS_MM_MAT_TRANS_T = new DS_MM_MAT_TRANS_T();
    this.plantDetails = this.sessionService.getPlantDetails();
    this.damageService.CompanyCode = this.plantDetails.companyCode;
    this.damageService.FiscalYearCode = this.plantDetails.FinancialYear;
    this.damageService.MM_MAT_TRANS_T = new Array<DS_MM_MAT_TRANS_T>();
    this.damageService.MM_MATSRNO_TRAN_T = new Array<DS_MM_MATSRNO_TRAN_T>();
    this.matselect = new DS_MM_MAT_TRANS_T();
    this.curDate = new Date();
    this.Submitted = false;
    this.TransId =
     this.TransId ===
     ConstantVariables.transid_issue_to_service ? ConstantVariables.transid_issue_to_service : ConstantVariables.transid_issue_to_customer;
    this.BATCH_NO = '';
    this.mathidden = false;
    this.onsave = false;
    this.dS_MM_MATERIAL_H = new DS_MM_MATERIAL_H();
    this.damageService.DocDate = this.curDate;
    this.damageService.PostingDate = this.curDate;
    this.issueToCustomerService.getJsonData().subscribe(res => {
      this.issueCustomerPicklist = res;
    });
    this.getDocAndMoveDetails();
    this.plantEmit(event);
    this.LoginSettings();
    this.select = false;
  }
  next() {
    this.dS_MM_MATERIAL_H.PRICING_PROC =
     this.damageService.PriceCode =
     this.TransId === ConstantVariables.transid_issue_to_customer ?  this.damageService.PriceCode : ConstantVariables.purloc;
    // const transid =
    // this.TransId ===
 // ConstantVariables.transid_issue_to_customer ? ConstantVariables.transid_issue_to_service : ConstantVariables.transid_issue_to_customer;
    const nextobj = {
      'TransId': this.TransId,
      'Vendor': this.damageService.Vendor,
      'Mode': ConstantVariables.addMode,
      'PlantCode': this.damageService.Plant,
      'FYear': Number(this.plantDetails.FinancialYear),
      'MatDocNo': this.damageService.MatDoc,
      'sPlant': this.plantDetails.plantCode,
      'sCompany': this.plantDetails.companyCode,
      'PriceCode': this.TransId === ConstantVariables.transid_issue_to_customer ? ConstantVariables.purloc : this.damageService.PriceCode,
      'IsReplacement': false,
      'IsVisRejMat': true,
      'MM_MAT_TRANS_T': this.damageService.MM_MAT_TRANS_T,
      'MM_GRPRICING_T': this.damageService.MM_GRPRICING_T,
      'MM_MATSRNO_TRAN_T': this.damageService.MM_MATSRNO_TRAN_T
    };
    this.issueToCustomerService.GetMatDetails(nextobj).subscribe(nextres => {
      this.damageService.MM_MAT_TRANS_T = nextres.Data.DS.MM_MAT_TRANS_T;
      this.damageService.MM_GRPRICING_T = nextres.Data.DS.MM_GRPRICING_T;
      this.damageService.MM_MATSRNO_TRAN_T = nextres.Data.DS.MM_MATSRNO_TRAN_T;
      this.damageService.MM_GRN_HEADER_TAX_T = nextres.Data.DS.MM_GRN_HEADER_TAX_T;
   //   const lastIndex =  this.damageService.MM_MAT_TRANS_T[this.damageService.MM_MAT_TRANS_T.length - 1];
      this.damageService.MM_MAT_TRANS_T.forEach((ele, index) => {
        ele.DOC_ITEM_NO = (index + 1) * 10;
      });
      this.damageService.MM_GRPRICING_T.forEach((ele) => {

        ele.DOC_ITEM_NO = 10;
        ele.VALUE = 0;
      });
      if (this.damageService.MM_MAT_TRANS_T.length === 0) {
        this.damageService.MM_MAT_TRANS_T.push(this.dS_MM_MAT_TRANS_T);
      }

    });
    this.mathidden = true;
    this.isHidden = !this.isHidden;
    this.submit = true;
  }
  AcceptDelete(index) {
    this.damageService.MM_MAT_TRANS_T.splice(index, 1);
  }
  AddMaterialList() {
    const newMat = new DS_MM_MAT_TRANS_T();
    this.damageService.MM_MAT_TRANS_T.push(newMat);
  }
  toHome() {
    this.isHidden = !this.isHidden;
    this.mathidden = false;
  }
  rowClick(data) {
    this.matselect = data;
  }
  SrNo() {

    if (this.damageService.MM_MATSRNO_TRAN_T.length === 0) {
      this.toastType = ToastTypes.warnType;
      this.message = 'Select Batch No';
    } else {
     // this.matselect = this.damageService.MM_MAT_TRANS_T.find(d => (d.SELECT === true || d.SELECT === 'TRUE'));

      if ((this.matselect.MAT_CODE !== '') && (String(this.matselect.QTY) !== '')) {
        this.Srnodata = this.damageService.MM_MATSRNO_TRAN_T.filter(sr => this.matselect.DOC_ITEM_NO === Number(sr.DOC_ITEM_NO));
        if (this.Srnodata.length > 0) {
          this.hidden = false;
          this.mathidden = false;
          this.onsave = true;
        } else {
          this.toastType = ToastTypes.warnType;
          this.message = 'Select Atleast One Material';
        }
      } else {
        this.toastType = ToastTypes.warnType;
        this.message = `material code and return qty should not be empty for selected line items`;
      }
    }
  }
  backData() {
    const srnoselect = this.Srnodata.filter(d => d.SELECT === true);
    if (srnoselect.length > 0) {
      if (Number(this.matselect.QTY) === srnoselect.length) {
        this.hidden = true;
        this.dataHidden = false;
        return true;
      } else {
        this.toastType = ToastTypes.warnType;
        this.message = `Serial No Qty doesn't Matches with GR Line Item Qty = ${this.matselect.QTY}`;
        return false;
      }
    } else {
      this.toastType = ToastTypes.warnType;
      this.message = ' Select at Least one Sr No for Rejection';
      return false;
    }
  }
  backupData() {
    this.hidden = true;
    this.dataHidden = true;
    this.mathidden = true;
    this.onsave = false;
  }
  customerEmit(data) {
    this.damageService.Vendor = data.SelectedId;
    this.dS_MM_MATERIAL_H.CUSTOMER_NAME = data.SelectedText;
    this.damageService.PriceCode = data.SelectedExtraOne;
    this.dS_MM_MATERIAL_H.PRICING_PROC = data.SelectedExtraOne;
    this.issueCustomerPicklist.material_doc.Condition = `VENDOR_NO='${data.SelectedId}'`;
  }
  plantEmit(event) {
    this.damageService.Plant = this.plantDetails.plantCode;

  }
  matEmit(event) {
    console.log(event);
    this.damageService.MatDoc = event.DOC_NO;
    this.damageService.MatDoc = event.DOC_NO;
    this.dS_MM_MATERIAL_H.REF_DOC_NO = event.DOC_NO;
  }

  lineItems() {
    const input = {
      'PlantCode': '',
      'SearchId': ConstantVariables.searchId,
      'Condition': '',
      'Sort': '',
      'InputCondition': ''
    }
    this.issueToCustomerService.lineItems(input).subscribe(res => {
      this.damageService.MM_MAT_TRANS_T = res['Data'].DS.MM_MAT_TRANS_T;
    });
  }
  selectedTableData(event, rowData, index, status) {
    const details = {
      'sCompany': this.plantDetails.companyCode,
      'MatCode': status === 'TextChanged' ? event : event[0].MAT_CODE,
      'sPlant': this.plantDetails.plantCode,
      'Vendor': this.damageService.Vendor
    }
    this.issueToCustomerService.retMatDetails(details).subscribe(res => {
      if (res.Data !== null) {
      for (const key in res.Data.Table[0]) {
        if (res.Data.Table[0].hasOwnProperty(key) && key !== null) {
          this.damageService.MM_MAT_TRANS_T[index][key] = res.Data.Table[0][key];
          this.damageService.MM_MAT_TRANS_T[index]['DOC_ITEM_NO'] = (index + 1) * 10;
          this.damageService.MM_MAT_TRANS_T[index]['STKTYPE_CODE'] =
          this.TransId === ConstantVariables.transid_issue_to_customer ? ConstantVariables.stktype_code : res.Data.Table[0]['STKTYPE_CODE']
        }
      }
      this.issueCustomerPicklist['Batchno'].Condition =
`0, '${this.damageService.MM_MAT_TRANS_T[index].DOC_ITEM_NO}', '${this.damageService.MovementType}', '${this.plantDetails.plantCode}', '${this.damageService.MM_MAT_TRANS_T[index].MAT_CODE}', '${this.damageService.MM_MAT_TRANS_T[index].STORAGE_CODE}', '${this.damageService.MM_MAT_TRANS_T[index].BIN_CODE}', '${this.damageService.MM_MAT_TRANS_T[index].BATCH_NO}', '${this.damageService.MM_MAT_TRANS_T[index].STKTYPE_CODE}', '', '', '${this.damageService.MM_MAT_TRANS_T[index].DOC_ITEM_NO}'`;
    } else {
      this.toastType = ToastTypes.warnType;
      this.message = 'Item Does Not Exist';
    }
  });
  }
  LoginSettings() {
    const loginInput = {
      'companycode': this.plantDetails.companyCode,
      'plantCode': this.plantDetails.plantCode,
      'userId': this.plantDetails.userId,
      'fiscalYear': this.plantDetails.FinancialYear
    };
    this.issueToCustomerService.GetLoginSettings(loginInput).subscribe(res => {
      this.damageService.COA_Code = res.Data.Table[0].COA_CODE;
    });
  }
  getDocAndMoveDetails() {
    this.issueToCustomerService.getDocAndMove().subscribe(res => {
      if (res['IsSucess']) {
        this.damageService.DocType = res['Data'].Table[0].DOCTYPECODE;
        this.dS_MM_MATERIAL_H.DOCTYPE_CODE = res['Data'].Table[0].DOCTYPECODE;
        this.damageService.MovementType = res['Data'].Table[0].MOVETYPE_CODE;
        this.dS_MM_MATERIAL_H.MOVETYPE_CODE = res['Data'].Table[0].MOVETYPE_CODE;
      }
    })
  }
  SelectedStockType(event, row) {
    row.STKTYPE_CODE = event.SelectedId;
    if (event !== null) {
      this.issueCustomerPicklist['Batchno'].Condition =
        `0, '${row.DOC_ITEM_NO}', '${this.damageService.MovementType}', '${this.plantDetails.plantCode}', '${row.MAT_CODE}', '${row.STORAGE_CODE}', '${row.BIN_CODE}', '${row.BATCH_NO}', '${row.STKTYPE_CODE}', '', '', '${row.DOC_ITEM_NO}'`;
    }
  }
  SelectedBatchNo(event, row) {
    row.BATCH_NO = event.BATCH_NO;
    if (event !== null) {
      if (event.AVAIL_QTY < row.QTY) {
        row.QTY = event.AVAIL_QTY;
      }
      row.STORAGE_CODE = event.STORAGE_CODE;
      row.BIN_CODE = event.BIN_CODE;
      row.STORAGE_CODE = event.STORAGE_CODE;
      const serialobj = {
        TransNo: 0,
        DocItemNo: row.DOC_ITEM_NO,
        sPlant: this.plantDetails.plantCode,
        MatCode: row.MAT_CODE,
        StorageCode: row.STORAGE_CODE,
        BinCode: row.BIN_CODE,
        BatchNo: row.BATCH_NO,
        StkTypeCode: row.STKTYPE_CODE,
        IsReplacement: false,
        sCompany: this.plantDetails.companyCode
      };
      this.issueToCustomerService.serialSelection(serialobj).subscribe(serialres => {
        if (serialres.Data.Table.length > 0) {
          this.damageService.MM_MATSRNO_TRAN_T = [];
          serialres.Data.Table.forEach(ele => {
            this.dS_MM_MATSRNO_TRAN_T = new DS_MM_MATSRNO_TRAN_T();
            for (const key in ele) {
              if (ele.hasOwnProperty(key) && key !== null) {
                this.dS_MM_MATSRNO_TRAN_T[key] = ele[key];
                this.dS_MM_MATSRNO_TRAN_T.BASEQTY = 1;
                this.dS_MM_MATSRNO_TRAN_T.MFG_DATE = new Date();

              }
            }
            this.dS_MM_MATSRNO_TRAN_T.DOC_ITEM_NO = row.DOC_ITEM_NO;
            this.damageService.MM_MATSRNO_TRAN_T.push(this.dS_MM_MATSRNO_TRAN_T);
          });
        } else {
          this.toastType = ToastTypes.warnType;
          this.message = 'No Data found for selected Batch no';
        }
      });
    }

  }
  selectedToastStatus(event) {
    this.toastType = '';
    this.message = '';
  }

  radioButton() {
    this.multiplepo = false; this.singlepodiv = true;
  }
  save() {
    this.damageService.Mode = ConstantVariables.addMode;
    this.damageService.TransID = this.TransId;
    this.damageService.UserID = String(this.plantDetails.userId);
    this.damageService.isQMRejMat = false;
    this.damageService.isVisRejMat = true;
    this.damageService.BaseCurrency = ConstantVariables.currency;
    this.dS_MM_MATERIAL_H.FYEAR = ConstantVariables.fYear;
    this.damageService.MM_MATERIAL_H = [];

    this.damageService.MM_MATERIAL_H.push(this.dS_MM_MATERIAL_H);
    this.damageService.MM_MAT_TRANS_T.forEach(ele => {
      ele.ENTRY_QTY = ele.QTY;

    });

    //  this.grnHidden=this.grnHidden;

    if (this.backData()) {

      this.issueToCustomerService.Save(this.damageService).subscribe(saveres => {
        if (saveres.IsSucess) {
          this.toastType = ToastTypes.successType;
          this.message = saveres.Data;
        } else {
          this.toastType = ToastTypes.errorType;
          this.message = saveres.Message;
        }
      },
        err => {
          this.toastType = ToastTypes.errorType;
          this.message = err.error.ExceptionMessage;
        });
    }

  }
  backGrnData() {
    if (this.dataHidden === true) {
      this.dataHidden = false;
    }
  }
  onSuccessToastClose(event) {
    this.sessionService.setSession('Issue To Service Center', this.message);
          this.isHidden = true;
          this.dataHidden = true;
          this.mathidden = false;
          this.hidden = true;
          this.ngOnInit();
          this.damageService.Vendor = '';
          this.damageService.MatDoc = '';
          this.onsave = false;
  }
}
