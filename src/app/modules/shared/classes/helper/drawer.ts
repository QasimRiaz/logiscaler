import { Injectable } from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    private drawer!: MatDrawer;

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    open(): void {
        if (this.drawer) {
            this.drawer.open();
        }
    }

    // Close the drawer and return a Promise<MatDrawerToggleResult>
    close(): Promise<MatDrawerToggleResult> {
        return this.drawer.close();
    }


    toggle(): void {
        if (this.drawer) {
            this.drawer.toggle();
        }
    }
}
