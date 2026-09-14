/* eslint-disable @typescript-eslint/no-extraneous-class */
import { NgModule } from '@angular/core'
import { SSHProfileSettingsActionProvider } from 'tabby-ssh'

import { SecretViewerActionProvider } from './secretViewerActionProvider'

@NgModule({
    providers: [
        { provide: SSHProfileSettingsActionProvider, useClass: SecretViewerActionProvider, multi: true },
    ],
})
export default class PasswordViewerModule { }
