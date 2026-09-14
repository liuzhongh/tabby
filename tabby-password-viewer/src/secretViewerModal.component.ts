import { Component, Input, OnDestroy } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { NotificationsService, PlatformService } from 'tabby-core'

const CLEAR_SECRET_DELAY = 30000

export interface SecretViewerData {
    password?: string|null
    privateKey?: string|null
    passphrase?: string|null
}

@Component({
    templateUrl: './secretViewerModal.component.pug',
    styleUrls: ['./secretViewerModal.component.scss'],
})
export class SecretViewerModalComponent implements OnDestroy {
    @Input() title: string
    @Input() kind: 'password'|'private-key'
    @Input() set loader (value: () => Promise<SecretViewerData>) {
        this.secretLoader = value
        this.reveal()
    }

    data: SecretViewerData = {}
    loading = false
    revealed = false
    error: string|null = null
    private secretLoader?: () => Promise<SecretViewerData>
    private clearTimer?: ReturnType<typeof setTimeout>

    constructor (
        public activeModal: NgbActiveModal,
        private platform: PlatformService,
        private notifications: NotificationsService,
    ) { }

    ngOnDestroy (): void {
        this.clearSecrets()
    }

    async reveal (): Promise<void> {
        if (!this.secretLoader) {
            return
        }
        this.loading = true
        this.error = null
        try {
            this.data = await this.secretLoader()
            this.revealed = true
            this.scheduleClear()
        } catch (error) {
            this.error = error instanceof Error ? error.message : String(error)
            this.clearSecrets()
        } finally {
            this.loading = false
        }
    }

    hide (): void {
        this.clearSecrets()
    }

    close (): void {
        this.clearSecrets()
        this.activeModal.dismiss()
    }

    copy (value: string|null|undefined): void {
        if (!value || !this.revealed) {
            return
        }
        this.platform.setClipboard({ text: value })
        this.notifications.info('Copied to clipboard')
    }

    private scheduleClear (): void {
        if (this.clearTimer) {
            clearTimeout(this.clearTimer)
        }
        this.clearTimer = setTimeout(() => this.clearSecrets(), CLEAR_SECRET_DELAY)
    }

    private clearSecrets (): void {
        if (this.clearTimer) {
            clearTimeout(this.clearTimer)
            this.clearTimer = undefined
        }
        this.data = {}
        this.revealed = false
    }
}
