import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UtmToastService} from '../../shared/alert/utm-toast.service';
import {COLORS} from '../../shared/components/utm/util/color-select/colors.const';
import {ModalConfirmationComponent} from '../../shared/components/utm/util/modal-confirmation/modal-confirmation.component';
import {InputSourceDataType} from './input-source-data.type';
import {InputSourceMngService} from './input-source-mng.service';

@Component({
  selector: 'app-source-data-type-config',
  templateUrl: './source-data-type-config.component.html',
  styleUrls: ['./source-data-type-config.component.scss']
})
export class SourceDataTypeConfigComponent implements OnInit {
  @Output() refreshDataInput = new EventEmitter<boolean>();
  originals: InputSourceDataType[] = [];
  dataInputs: InputSourceDataType[] = [];
  saving = false;
  changed: InputSourceDataType[] = [];
  loading = true;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal,
              private inputSourceMngService: InputSourceMngService,
              private utmToastService: UtmToastService) {
  }

  ngOnInit() {
    this.getInputTypes();
  }

  getInputTypes() {
    this.inputSourceMngService.query({page: 0, size: 1000}).subscribe(response => {
      if (response.body) {
        this.originals = response.body;
        this.loadElements().then(data => {
          this.dataInputs = data;
          this.loading = false;
        });
      }
    });
  }

  loadElements(): Promise<InputSourceDataType[]> {
    return new Promise<InputSourceDataType[]>(resolve => {
      const inputs: InputSourceDataType[] = [];
      for (const data of this.originals) {
        inputs.push({
          id: data.id,
          dataType: data.dataType,
          dataTypeName: data.dataTypeName,
          included: data.included,
          systemOwner: data.systemOwner
        });
      }
      resolve(inputs);
    });
  }

  search($event: string) {
    if (!$event) {
      this.dataInputs = this.originals;
    } else {
      this.dataInputs = this.originals.filter(value =>
        value.dataTypeName.toLowerCase().includes($event.toLowerCase())
      ).slice();
    }
  }

  update() {
    const modalSource = this.modalService.open(ModalConfirmationComponent, {centered: true});
    const changedStr = this.changed.map(value => value.dataTypeName);
    let result = '';
    if (changedStr.length > 1) {
      const lastItem = changedStr.pop();
      result = changedStr.join(', ') + ', and ' + lastItem;
    } else {
      result = changedStr.join(', ');
    }
    modalSource.componentInstance.header = 'Disable source input view';
    modalSource.componentInstance.message = 'Are you sure that you want to hidde the sources ' + result + '?';
    modalSource.componentInstance.confirmBtnText = 'Accept';
    modalSource.componentInstance.confirmBtnIcon = 'icon-cog3';
    modalSource.componentInstance.confirmBtnType = 'default';
    modalSource.result.then(() => {
      this.save();
    });
  }

  save() {
    this.saving = true;
    this.inputSourceMngService.update(this.changed).subscribe(() => {
      this.saving = false;
      this.refreshDataInput.emit(true);
      this.utmToastService.showSuccessBottom('Configuration saved successfully, your sources will be updated');
      for (const sourceDataType of this.changed) {
        const indexOriginal = this.originals.findIndex(value => value.dataType === sourceDataType.dataType);
        const indexChanged = this.changed.findIndex(value => value.dataType === sourceDataType.dataType);
        this.originals[indexOriginal] = this.changed[indexChanged];
        this.changed = [];
      }

    }, () => {
      this.utmToastService.showError('Error', 'Error trying update source configuration');
      this.saving = false;
    });

  }

  changeStatus(sourceDataType: InputSourceDataType) {
    sourceDataType.included = !sourceDataType.included;
    const indexChanged = this.changed.findIndex(value => value.dataType === sourceDataType.dataType);

    if (indexChanged !== -1) {
      this.changed[indexChanged].included = sourceDataType.included;
    } else {
      this.changed.push(sourceDataType);
    }
  }

}
