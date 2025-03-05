import { inject, Injectable } from '@angular/core';
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { TranslocoService } from '@ngneat/transloco';
import { user as userData } from 'app/mock-api/common/user/data';
import { LocalStorageService } from 'app/modules/shared/classes/helper/localstorage';
import { UserUsecases } from 'app/modules/shared/classes/usecases/user/user.usecases';
import { User } from 'app/modules/shared/models/user.model';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthMockApi {
    private readonly _secret: any;
    private _user: any = userData;
    private firebaseObj = inject(Auth);

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _userUseCase: UserUsecases,
        private _localStorage: LocalStorageService,
        private _translocoService: TranslocoService
    ) {
        // Set the mock-api
        this._secret =
            'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';

        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Forgot password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onPost('api/auth/forgot-password', 1000).reply(({ request }): [number, any] | Observable<any> => {
            return new Observable((observer) => {
                (async () => {
                    try {
                        const email = request.body;

                        // Now, initiate the password reset process in Firebase
                        try {
                            await sendPasswordResetEmail(this.firebaseObj, email);

                            // Password reset email sent successfully
                            //console.log('Password reset email sent successfully');

                            observer.next([200, true]);
                            observer.complete();
                        } catch (error) {
                            // Handle any errors that occur during the password reset process
                            console.error('Error sending password reset email:', error);

                            observer.next([500, false]);
                            observer.complete();
                        }
                    } catch (error) {
                        // Invalid credentials or other error occurred
                        // Handle other cases as needed
                        console.error('Error:', error);

                        // Invalid credentials
                        observer.next([404, false]);
                        observer.complete();
                    }
                })();
            });
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Reset password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/reset-password', 1000)
            .reply(() => [200, true]);

        // -----------------------------------------------------------------------------------------------------
        // @ Sign in - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in', 1500)
            .reply(({ request }): [number, any] | Observable<any> => {
                return new Observable((observer) => {
                    (async () => {
                        try {
                            const { email, password } = request.body;
                            // console.log('aaaa');

                            // Sign in using Firebase Authentication
                            const response = await signInWithEmailAndPassword(this.firebaseObj, email, password);
                            const firebaseUser = response.user;
                            // Sign in successful
                            if (firebaseUser) {
                                const idToken = await firebaseUser.getIdToken();

                                this._userUseCase.getUserByEmail(email.toLowerCase()).subscribe((user: User) => {
                                     console.log(user);

                                    if (user && Object.keys(user).length) {
                                        ////console.log(user);
                                        //this._facadeService.getUserOrganizations(user?.organizationId).subscribe((organzations: any) => {
                                        //console.log(organzations);

                                        //  const hasActiveSubscription = General.checkOrgSubscription(organzations.tenant, organzations.sponsor_company);
                                        //console.log(hasActiveSubscription);

                                        // if (hasActiveSubscription) {
                                        // user.status = Utility.parseToDate();
                                        // this._facadeService.updateProfileAccount(user).subscribe();

                                        let userSession: UserSessionModel = this._localStorage.initiateUserSession(user);

                                        // console.log(userSession);
                                        this._user.name = userSession.name;
                                        this._user.id = userSession.id;
                                        this._user.email = userSession.email;
                                        this._user.role = userSession.role;
                                        this._user.roleId = userSession.roleId;
                                        this._user.avatar = userSession.pictureUrl;
                                        this._user.company = userSession.company;
                                        this._user.companyLogo = userSession.companyLogo;
                                        // this._user.organizationId = userSession?.organizationId;
                                        // this._user.organizationName = userSession?.organization?.title;

                                        // if (!user.isSuperAdmin) {
                                        //     if (userSession.roleId == 1 || userSession.roleId == 2) {
                                        //         this._user.role = 'Event Admin'
                                        //     } else if (userSession.roleId == 3) {
                                        //         this._user.role = 'Sponsor Admin';
                                        //     }
                                        // } else if (user.isSuperAdmin) {
                                        //     userSession.roleId = 1;
                                        //     this._user.role = 'Super Admin';
                                        // }

                                        observer.next([
                                            200,
                                            {
                                                user: cloneDeep(firebaseUser),
                                                accessToken: idToken,
                                                tokenType: 'bearer',
                                                session: userSession,
                                            }
                                        ]);
                                        observer.complete();


                                        //  })

                                    } else {
                                        observer.next([404, false]);
                                        observer.complete();
                                    }
                                },
                                    error => {
                                        //console.log(error);
                                    }
                                )


                            }
                        } catch (error) {
                            // Invalid credentials or other error occurred
                            ////console.log(error);
                            // Invalid credentials
                            observer.next([404, false]);
                            observer.complete();
                        }


                    })();
                });
            });
        // -----------------------------------------------------------------------------------------------------
        // @ Sign in using the access token - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in-with-token')
            .reply(({ request }) => {

                // Get the access token
                const accessToken = request.body.accessToken;

                // Verify the token
                if (this._verifyJWTToken(accessToken)) {
                    return [
                        200,
                        {
                            user: cloneDeep(this._user),
                            accessToken: accessToken, //this._generateJWTToken(),
                            tokenType: 'bearer'
                        }
                    ];
                }

                // Invalid token
                return [
                    401,
                    {
                        error: 'Invalid token'
                    }
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign up - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onPost('api/auth/sign-up', 1500).reply(() =>
            // Simply return true
            [200, true]
        );

        // -----------------------------------------------------------------------------------------------------
        // @ Unlock session - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/unlock-session', 1500)
            .reply(({ request }) => {
                // Sign in successful
                if (
                    request.body.email === 'hughes.brian@company.com' &&
                    request.body.password === 'admin'
                ) {
                    return [
                        200,
                        {
                            user: cloneDeep(this._user),
                            accessToken: this._generateJWTToken(),
                            tokenType: 'bearer',
                        },
                    ];
                }

                // Invalid credentials
                return [404, false];
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Return base64 encoded version of the given string
     *
     * @param source
     * @private
     */
    private _base64url(source: any): string {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }

    /**
     * Generates a JWT token using CryptoJS library.
     *
     * This generator is for mocking purposes only and it is NOT
     * safe to use it in production frontend applications!
     *
     * @private
     */
    private _generateJWTToken(): string {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor((date.setDate(date.getDate() + 7)) / 1000);

        // Define token payload
        const payload = {
            iat: iat,
            iss: 'Fuse',
            exp: exp
        };

        // Stringify and encode the header
        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this._base64url(stringifiedHeader);

        // Stringify and encode the payload
        const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
        const encodedPayload = this._base64url(stringifiedPayload);

        // Sign the encoded header and mock-api
        let signature: any = encodedHeader + '.' + encodedPayload;
        signature = HmacSHA256(signature, this._secret);
        signature = this._base64url(signature);

        // Build and return the token
        return encodedHeader + '.' + encodedPayload + '.' + signature;
    }

    /**
     * Verify the given token
     *
     * @param token
     * @private
     */
    private _verifyJWTToken(token: string): boolean {
        // Split the token into parts
        const parts = token.split('.');
        const header = parts[0];
        const payload = parts[1];
        const signature = parts[2];

        // Re-sign and encode the header and payload using the secret
        const signatureCheck = this._base64url(HmacSHA256(header + '.' + payload, this._secret));

        // Verify that the resulting signature is valid
        return true; // (signature === signatureCheck);
    }
}
