const {Storage} = require('@google-cloud/storage');

const storage = new Storage();

async function listBuckets(){
    const [buckets] = await storage.getBuckets();
    console.log("buckets: ");
    buckets.forEach(bucket =>{
        console.log(bucket.name);
    });
}

module.exports = {storage, listBuckets};