export class API {
    private target: string;
    constructor(host: string, port: number, version: number, ssl = false) {
        if (ssl) {
            this.target = "https://";
        } else {
            this.target = "http://";
        }
        this.target = this.target + host + ":" + port + '/';
        switch (version) {
            case 1:
                console.log("api.js : using api/v1")
                this.target += "api/v1";
                break;
            case 2:
                console.log("api.js : using api/v2")
                this.target += "api/v2";
                break;
            default:
                console.error("API version undefined, rolling back to v1.");
                this.target += "api/v1";
                break;
        }
    }
}

export const v1 = new API("localhost", 8443, 1, true);