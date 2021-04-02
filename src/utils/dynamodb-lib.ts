import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();
const table = process.env.DYNAMODB_TABLE as string;

export default {
    get: (params) => db.get({ TableName: table, ...params }).promise(),
    query: (params) => db.query({ TableName: table, ...params }).promise(),
    scan: () => db.scan({ TableName: table }).promise(),
    put: (params) => db.put({ TableName: table, ...params }).promise(),
    delete: (params) => db.delete({ TableName: table, ...params }).promise(),
    batchWrite: (params) => db.batchWrite(params).promise()
};