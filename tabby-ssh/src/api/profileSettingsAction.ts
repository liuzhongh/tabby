import { SSHProfile } from './interfaces'

export interface SSHProfileSettingsAction {
    icon: string
    title: string
    run?: () => void|Promise<void>
    reveal?: () => Promise<string|null>
    save?: (value: string) => void|Promise<void>
    remove?: () => void|Promise<void>
    emptyValueText?: string
}

export abstract class SSHProfileSettingsActionProvider {
    getPasswordActions (_profile: SSHProfile): SSHProfileSettingsAction[] {
        return []
    }

    getPrivateKeyActions (_profile: SSHProfile, _path: string): SSHProfileSettingsAction[] {
        return []
    }
}
