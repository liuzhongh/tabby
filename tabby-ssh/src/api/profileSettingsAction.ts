import { SSHProfile } from './interfaces'

export interface SSHProfileSettingsAction {
    icon: string
    title: string
    run?: () => void|Promise<void>
    reveal?: () => Promise<string|null>
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
