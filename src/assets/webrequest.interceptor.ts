// export class WebRequestInterceptor {



//   constructor() {
//     console.log('intercept')
//     const func = (XHR: any): any => {
//       // eslint-disable-next-line @typescript-eslint/no-this-alias
//       const that = this;
//       let senderUrl: string;
//       const open = XHR.prototype.open;
//       XHR.prototype.open = function(method: string, url: string, async: boolean, user: string, pass: string): void {
//         senderUrl = url;
//         const response = that.mockResponse(senderUrl);
//         if (response && that.islocalHost()) {
//           open.call(this, 'GET', response, true, user, pass);
//         } else {
//           // eslint-disable-next-line prefer-rest-params
//           open.apply(this, arguments);
//         }
//       }
//     };
//     func.apply(null, [XMLHttpRequest]);
//   }



//   islocalHost(): boolean {
//     return window.location.hostname === 'localhost';
//   }

// }
