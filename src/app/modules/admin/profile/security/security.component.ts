import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LogService } from 'app/modules/shared/classes/logs/log.service';
import { Auth, signInWithEmailAndPassword, updatePassword } from '@angular/fire/auth';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule, TranslocoModule,
        MatButtonModule,
    ],
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private afAuth: Auth,
        private _snackBar: MatSnackBar,
        private logger: LogService,
        private _translocoService: TranslocoService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.logger.info("User landed on user security page");
        this.securityForm = this._formBuilder.group({
            currentPassword: [''],
            newPassword: ['']
        });
    }
    async changePassword() {
        try {

            const user = await this.afAuth.currentUser;
            const _formValue = this.securityForm.getRawValue();
            this.logger.info("User click on update password button", _formValue);

            this.logger.info("Checking user firebase session", user);

            if (user) {
                this.logger.info("User firebase session is available", user);
                const _formValue = this.securityForm.getRawValue();
                const credential = await signInWithEmailAndPassword(this.afAuth, user.email, _formValue.currentPassword);

                if (credential) {
                    await updatePassword(user, _formValue.newPassword);
                    this.logger.info("User password updated successfully", credential);
                    this._snackBar.open(this._translocoService.translate("Password changed successfully."), this._translocoService.translate('close'), {
                        duration: 5 * 3000,
                    });

                } else {
                    this.logger.error("User firebase crendentials are not correct", credential);
                    this._snackBar.open(this._translocoService.translate('Error! Please Try Again'), this._translocoService.translate('close'), {
                        duration: 3000,
                    })
                }
            } else {
                this.logger.error("User firebase session is not available");
            }
        } catch (error) {
            this.logger.error("Error in changing password", error);
            // console.error('Error changing password:', error);
            this._snackBar.open(this._translocoService.translate('Error! Please Try Again'), this._translocoService.translate('close'), {
                duration: 3000,
            })
        }

        // Reset the form after the operation is complete.
        this.securityForm.reset();
    }

}
