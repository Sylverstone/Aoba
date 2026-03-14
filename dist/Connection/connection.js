import * as mongodb from "mongodb";
/**
 * Un client mongoDB avec ses tables (collections) intégré.
 * */
export class CustomMongoClient extends mongodb.MongoClient {
    constructor(db_url) {
        super(db_url);
        this.collections = {};
        this.activeCollection = new mongodb.Collection();
    }
    async connect() {
        await super.connect();
        const db = this.db("ParamsDB");
        this.collections.params = db.collection("ReactionRedirectionParams");
        console.log("Connect look good");
        return this;
    }
    async connectTo(To) {
        await super.connect();
        const db = this.db("ParamsDB");
        this.collections.params = db.collection(To);
        console.log("Connect look good");
        return this;
    }
    getCollections() {
        return this.collections;
    }
}
