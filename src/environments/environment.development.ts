export const environment = {
  production: false,
  syncfusionKey: "Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXlecnVQRGNfVkR+W0pWYUA=",

  auth : {
    domain: 'dev-1dha8qt8zf60zyxc.us.auth0.com',
    clientId: 'P64odwZiqNbiYRHPaQnMrh2bxyblICze',
    authorizationParams: {
      redirect_uri: 'http://localhost:4200/',
      audience: 'https://dev-1dha8qt8zf60zyxc.us.auth0.com/api/v2/',
      scope: 'openid profile email https://www.googleapis.com/auth/spreadsheets https://sheets.googleapis.com',
    },
  }
};
