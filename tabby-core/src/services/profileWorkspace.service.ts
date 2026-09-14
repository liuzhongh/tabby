import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

import { BaseTabComponent } from '../components/baseTab.component'
import { SplitTabComponent } from '../components/splitTab.component'
import { AppService } from './app.service'

@Injectable({ providedIn: 'root' })
export class ProfileWorkspaceService {
    get selectedProfileId$ (): Observable<string|null> { return this.selectedProfileIdChanged }
    get selectedProfileId (): string|null { return this.selectedProfileIdChanged.value }

    private selectedProfileIdChanged = new BehaviorSubject<string|null>(null)

    constructor (private app: AppService) {
        this.app.activeTabChange$.subscribe(tab => {
            if (!tab) {
                return
            }
            this.selectedProfileIdChanged.next(this.getProfileIdForTab(tab))
        })
    }

    selectProfile (profileId: string): void {
        this.selectedProfileIdChanged.next(profileId)
        const tab = this.app.mruTabs.find(x => this.getProfileIdForTab(x) === profileId)
            ?? this.app.tabs.find(x => this.getProfileIdForTab(x) === profileId)
            ?? null
        this.app.selectTab(tab)
    }

    clearSelection (): void {
        this.selectedProfileIdChanged.next(null)
    }

    getVisibleTabs (): BaseTabComponent[] {
        if (!this.selectedProfileId) {
            return this.app.tabs
        }
        return this.app.tabs.filter(tab => this.getProfileIdForTab(tab) === this.selectedProfileId)
    }

    getOpenTabCount (profileId?: string): number {
        if (!profileId) {
            return 0
        }
        return this.app.tabs.filter(tab => this.getProfileIdForTab(tab) === profileId).length
    }

    getProfileIdForTab (tab: BaseTabComponent): string|null {
        const tabs = tab instanceof SplitTabComponent ? tab.getAllTabs() : [tab]
        const profileIds = new Set(tabs.map(x => this.getDirectProfileId(x)).filter((x): x is string => !!x))
        return profileIds.size === 1 ? [...profileIds][0] : null
    }

    private getDirectProfileId (tab: BaseTabComponent): string|null {
        const profile = (tab as BaseTabComponent & { profile?: { id?: string } }).profile
        return profile?.id ?? null
    }
}
