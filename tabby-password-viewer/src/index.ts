/* eslint-disable @typescript-eslint/no-extraneous-class */
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import TabbyCoreModule from 'tabby-core'
import { SSHProfileSettingsActionProvider } from 'tabby-ssh'

import { SecretViewerModalComponent } from './secretViewerModal.component'
import { SecretViewerActionProvider } from './secretViewerActionProvider'

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        TabbyCoreModule,
    ],
    declarations: [
        SecretViewerModalComponent,
    ],
    providers: [
        { provide: SSHProfileSettingsActionProvider, useClass: SecretViewerActionProvider, multi: true },
    ],
})
export default class PasswordViewerModule { }
