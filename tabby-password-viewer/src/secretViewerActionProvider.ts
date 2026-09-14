import * as crypto from 'crypto'
import { Injectable } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FileProvidersService, TranslateService } from 'tabby-core'
import { PasswordStorageService, SSHProfile, SSHProfileSettingsAction, SSHProfileSettingsActionProvider } from 'tabby-ssh'

import { SecretViewerData, SecretViewerModalComponent } from './secretViewerModal.component'

@Injectable()
export class SecretViewerActionProvider extends SSHProfileSettingsActionProvider {
    constructor (
        private modal: NgbModal,
        private files: FileProvidersService,
        private passwords: PasswordStorageService,
        private translate: TranslateService,
    ) {
        super()
    }

    getPasswordActions (profile: SSHProfile): SSHProfileSettingsAction[] {
        return [{
            icon: 'fas fa-eye',
            title: this.translate.instant('Show password'),
            run: () => this.openPassword(profile),
        }]
    }

    getPrivateKeyActions (profile: SSHProfile, path: string): SSHProfileSettingsAction[] {
        return [{
            icon: 'fas fa-eye',
            title: this.translate.instant('Show private key'),
            run: () => this.openPrivateKey(profile, path),
        }]
    }

    private openPassword (profile: SSHProfile): void {
        const modal = this.modal.open(SecretViewerModalComponent, { size: 'lg' })
        modal.result.catch(() => null)
        modal.componentInstance.title = this.translate.instant('Password for {user}@{host}', profile.options)
        modal.componentInstance.kind = 'password'
        modal.componentInstance.loader = async (): Promise<SecretViewerData> => ({
            password: await this.passwords.loadPassword(profile) ?? profile.options.password,
        })
    }

    private openPrivateKey (profile: SSHProfile, path: string): void {
        const modal = this.modal.open(SecretViewerModalComponent, { size: 'lg' })
        modal.result.catch(() => null)
        modal.componentInstance.title = this.translate.instant('Private key: {path}', { path })
        modal.componentInstance.kind = 'private-key'
        modal.componentInstance.loader = async (): Promise<SecretViewerData> => {
            const resolvedPath = path
                .replaceAll('%h', profile.options.host)
                .replaceAll('%r', profile.options.user)
            const contents = (await this.files.retrieveFile(resolvedPath)).toString('utf-8')
            const hash = crypto.createHash('sha512').update(contents).digest('hex')
            return {
                privateKey: contents,
                passphrase: await this.passwords.loadPrivateKeyPassword(hash),
            }
        }
    }
}
