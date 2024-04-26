import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';
import {AlertManagementSharedModule} from '../data-management/alert-management/shared/alert-management-shared.module';
import {UtmSharedModule} from '../shared/utm-shared.module';
import {LogstashFilterCreateComponent} from './logstash-filters/logstash-filter-create/logstash-filter-create.component';
import {LogstashFiltersComponent} from './logstash-filters/logstash-filters.component';
import {LogstashPipelinesComponent} from './logstash-pipelines/logstash-pipelines.component';
import {LogstashRoutingModule} from './logstash-routing.module';

@NgModule({
  declarations: [LogstashFiltersComponent, LogstashFilterCreateComponent, LogstashPipelinesComponent],
  imports: [
    CommonModule,
    UtmSharedModule,
    FormsModule,
    NgbModule,
    LogstashRoutingModule,
    InlineSVGModule,
    AlertManagementSharedModule
  ],
  entryComponents: [LogstashFilterCreateComponent]
})
export class LogstashModule {
}
