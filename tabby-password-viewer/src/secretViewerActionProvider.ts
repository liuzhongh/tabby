import * as crypto from 'crypto'
import { Injectable } from '@angular/core'
import { FileProvidersService, TranslateService } from 'tabby-core'
import { PasswordStorageService, SSHProfile, SSHProfileSettingsAction, SSHProfileSettingsActionProvider } from 'tabby-ssh'

@Injectable()
export class SecretViewerActionProvider extends SSHProfileSettingsActionProvider {
    constructor (
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
            emptyValueText: this.translate.instant('No saved password'),
            reveal: async () => await this.passwords.loadPassword(profile) ?? profile.options.password,
            save: async value => {
                await this.passwords.savePassword(profile, value)
                profile.options.password = ''
            },
            remove: async () => {
                await this.passwords.deletePassword(profile)
                profile.options.password = ''
            },
        }]
    }

    getPrivateKeyActions (profile: SSHProfile, path: string): SSHProfileSettingsAction[] {
        return [{
            icon: 'fas fa-eye',
            title: this.translate.instant('Private key passphrase'),
            emptyValueText: this.translate.instant('No saved passphrase'),
            reveal: async (): Promise<string|null> => this.passwords.loadPrivateKeyPassword(await this.getPrivateKeyHash(profile, path)),
            save: async value => this.passwords.savePrivateKeyPassword(await this.getPrivateKeyHash(profile, path), value),
            remove: async () => this.passwords.deletePrivateKeyPassword(await this.getPrivateKeyHash(profile, path)),
        }]
    }

    private async getPrivateKeyHash (profile: SSHProfile, path: string): Promise<string> {
        const resolvedPath = path
            .replaceAll('%h', profile.options.host)
            .replaceAll('%r', profile.options.user)
        const contents = (await this.files.retrieveFile(resolvedPath)).toString('utf-8')
        return crypto.createHash('sha512').update(contents).digest('hex')
    }
}
