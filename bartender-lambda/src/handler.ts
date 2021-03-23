'use strict';
import { Event, Cocktail, requiredAttrs } from "./types";
import { DynamoDB } from "aws-sdk";
import { isEqual } from "lodash";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

const db = new DynamoDB.DocumentClient();
const table = process.env.DYNAMODB_TABLE as string;

const uid = () => Math.random().toString(36).substr(2, 9);

export const saveCocktail = async (event: Event<Cocktail>) => {
  try {
    // if (!event || !event.body) {
    //   return {
    //     statusCode: 400,
    //     message: "Request body can't be empty.",
    //   }
    // }
    const data = event.body ? JSON.parse(event.body) : event;

    console.log(isEqual(Object.keys(data).sort(), requiredAttrs.sort()));

    if (!isEqual(Object.keys(data).sort(), requiredAttrs.sort())) {
      return {
        statusCode: 400,
        body: `Request body should contain following properties: ${requiredAttrs.join(', ')}.`
      }
    }

    const item = { ...data, id: uid() };
    await db.put({
      TableName: table,
      Item: item
    }).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ Item: item })
    }
  } catch (error) {
    console.log(error, 'error');
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify(error)
      }
    }    
  }

export const getAllCocktails = async () => {
  try {
    const resp = await db.scan({
      TableName: table,
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(resp)
    }
  } catch(error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error)
    }
  }
};

export const getCocktailByName = async (event: Event<Cocktail>) => {
  try {
    const { queryStringParameters } = event;
    if (!queryStringParameters || !queryStringParameters.name) {
      return {
        statusCode: 400,
        body: `Request query should contain name.`
      }
    }
    const resp = await db.query({
      TableName: table,
      KeyConditionExpression: "#name = :name",
      ExpressionAttributeNames: {"#name": "name"},
      ExpressionAttributeValues: { ":name": `${queryStringParameters.name}`}
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(resp)
    };
  } catch(error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error)
    }
  }
};
