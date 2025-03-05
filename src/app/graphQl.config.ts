import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { EnvironmentProviders, importProvidersFrom, Provider } from '@angular/core';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { take } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Auth } from '@angular/fire/auth';

const uri = environment.apiUrl; // GraphQL server URL

const authContext = (auth: Auth) => setContext(async () => {
    let localToken = localStorage.getItem('accessToken') ?? '';
    let token = "";//await firstValueFrom(auth.idToken.pipe(take(1)));

    // if (token !== localToken) {
    //   localStorage.setItem('accessToken', token); 
    // }
    return {
        headers: {
            "Authorization": `Bearer ${token}`,
            "x-hasura-admin-secret": "C9iTU5dUJ27UGSYqd66oNBtQxpQbTk31Dt2kkeOjc8hob97Gld4n4y95Kr4bJ1Mh",
            "X-Hasura-Role": "admin",
            "X-Hasura-Allowed-Roles": ["admin"]
        },
    };
});

// const authContext = (auth: Auth) => setContext(async () => {

//     let localToken = localStorage.getItem('accessToken') ?? '';
//     const user = await auth.currentUser;
//     let token = '';

//     if (user) {
//         token = await user.getIdToken(); // Get the ID token from the user
//     }
//     // let token = await firstValueFrom(auth.idToken.pipe(take(1)));
//     // console.log(token);
//     // console.log(localToken);

//     if (token != localToken) {
//         localStorage.setItem('accessToken', token);
//     }
//     return {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     }
// });


export function createApollo(httpLink: HttpLink, auth: Auth): ApolloClientOptions<any> {
    return {
        link: ApolloLink.from([
            authContext(auth),
            httpLink.create({ uri, withCredentials: true })
        ]),
        cache: new InMemoryCache(),
    };
}

export const provideGraphql = (): Array<Provider | EnvironmentProviders> => {
    return [
        importProvidersFrom(ApolloModule),
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, Auth],
        },
    ];
};