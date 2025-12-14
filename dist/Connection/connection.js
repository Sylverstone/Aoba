import * as mongodb from "mongodb";
/**
 * Un client mongoDB avec ses tables (collections) intégré.
 * */
export class CustomMongoClient extends mongodb.MongoClient {
    constructor(db_url) {
        super(db_url);
        this.collections = {};
    }
    async connect() {
        await super.connect();
        const db = this.db("ParamsDB");
        this.collections.params = db.collection("ReactionRedirectionParams");
        console.log("Connect look good");
        return this;
    }
    getCollections() {
        return this.collections;
    }
}
